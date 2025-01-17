import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Row, Col, Form, Button } from 'react-bootstrap';
import Card from '../../../components/Card';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import axiosInstance from '../../../js/api';
import LibraryAddCheckIcon from '@mui/icons-material/LibraryAddCheck';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';

const UserProfile = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const user_id = searchParams.get('user_id');

  const [userData, setUserData] = useState({
    first_name: '',
    last_name: '',
    contactNumber: '',
    dateOfBirth: '',
    anniversaryDate: '',
    email: '',
    client_img_url: '',
    gender: '',
    address: '',
    membershipType: '',
    membershipDuration: '',
    membershipMonth: '',
    joinDate: '',
    isUserActive: '',
    qrCodeUrl: '',
    selectedFile: null,
    maritalStatus: ''
  });

  useEffect(() => {
    if (user_id) {
      fetchUserData(user_id);
    }
  }, [user_id]);

  const fetchUserData = async (user_id) => {
    try {
      const response = await axiosInstance.get(`/user/get?id=${user_id}`);

      // Check if response contains data
      if (response.data && response.data.data) {
        const user = response.data.data[0];
        console.log(user);

        setUserData({
          first_name: user.first_name,
          last_name: user.last_name,
          contactNumber: user.contactNumber,
          email: user.email,
          client_img_url: user.client_img_url,
          gender: user.gender,
          address: user.address,
          membershipType: user.membershipType,
          membershipDuration: user.membershipDuration,
          membershipMonth: user.membershipMonth,
          dateOfBirth: user.dateOfBirth && user.dateOfBirth.split('T')[0],
          anniversaryDate: user.anniversaryDate && user.anniversaryDate.split('T')[0],
          joinDate: user.joinDate && user.joinDate.split('T')[0],
          isUserActive: user.isUserActive,
          qrCodeUrl: user.qrCodeUrl,
          maritalStatus: user.maritalStatus,
          selectedFile: null,
        });
      } else {
        console.error('No data found for user:', user_id);
        toast.error('No data found for user');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };


  const handleChange = (e) => {
    const { id, value, files } = e.target;

    if (id === 'fileInput' && files.length > 0) {
      const file = files[0];
      setUserData({
        ...userData,
        selectedFile: file,
        client_img_url: URL.createObjectURL(file),
      });
    } else {
      setUserData((prevData) => ({
        ...prevData,
        [id]: value,
      }));
    }
  };

  const handleFileButtonClick = () => {
    document.getElementById('fileInput').click();
  };

  const handleUpdateUser = async () => {
    try {
      if (userData.selectedFile) {
        // New image selected, handle file upload
        const formDataForUpload = new FormData();
        formDataForUpload.append('file', userData.selectedFile);
        const uploadResponse = await axiosInstance.post('/file-upload', formDataForUpload);
        const imageUrl = uploadResponse.data.data.fileURL;

        const userDataToSend = {
          ...userData,
          client_img_url: imageUrl,
        };

        const response = await axiosInstance.post(`/user/update?id=${user_id}`, userDataToSend);

        if (response.data && response.data.data) {
          toast.success('User details updated successfully');
        } else {
          console.error('Error updating User details:', response.data.message);
          toast.error('Error updating User details');
        }
      } else {
        // No new image selected, update user details with existing image URL
        const response = await axiosInstance.post(`/user/update?id=${user_id}`, userData);

        if (response.data && response.data.data) {
          toast.success('User details updated successfully');
        } else {
          console.error('Error updating User details:', response.data.message);
          toast.error('Error updating User details');
        }
      }
    } catch (error) {
      console.error('Error updating User details:', error);
      toast.error('Error updating User details');
    }
  };


  const handleToggleStatus = async () => {
    try {
      const updatedStatus = !userData.isUserActive;
      // Toggle the user's active status (assuming isUserActive is a boolean field)
      const userDataToSend = {
        ...userData,
        isUserActive: updatedStatus,
      };

      const response = await axiosInstance.post(`/user/update?id=${user_id}`, userDataToSend);

      if (response.data && response.data.data) {
        setUserData((prevData) => ({
          ...prevData,
          isUserActive: updatedStatus,
        }));
        toast.success(`User status updated to ${updatedStatus ? 'Active' : 'Inactive'}`);
      } else {
        console.error('Error updating user status:', response.data.message);
        toast.error('Error updating user status');
      }
    } catch (error) {
      console.error('Error updating user status:', error);
      toast.error('Error updating user status');
    }
  };

  const downloadQRCode = (url, fileName) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadExcel = async () => {
    try {
      const response = await fetch(userData.qrCodeUrl);
      const blob = await response.blob();

      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);

      link.download = 'QR_Code';

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading QR Code:', error);
    }
  };


  return (
    <div className='margintop'>
      <Row>
        <Col xl="12" lg="12">
          <Card>
            <Card.Header className="d-flex justify-content-between">
              <div className="header-title">
                <h4 className="card-title">Update User</h4>
              </div>
            </Card.Header>
            <Card.Body>
              <div className="new-user-info">
                <form>
                  <Row>
                    <Col md={4} className="text-center mt-3">
                      <img alt='Photos' src={userData.client_img_url} style={{ borderRadius: '10px', width: '70%' }} />
                      <div>
                        <Button
                          type='button'
                          variant='btn btn-primary'
                          className='mt-2 px-2 py-1 mb-2'
                          onClick={handleFileButtonClick}
                        >
                          <PhotoCameraIcon />
                        </Button>
                        <input
                          type='file'
                          id='fileInput'
                          className='d-none'
                          onChange={handleChange}
                        />
                      </div>
                      <p
                        className='mt-lg-2'
                        style={{ color: 'red', fontSize: '14px', fontWeight: '600' }}
                      >
                        Note: Photo/Image Size Limit only 1 MB
                      </p>
                      <div>
                        <img alt='Photos' src={userData.qrCodeUrl} style={{ borderRadius: '10px', width: '100%' }} />
                        <Button
                          onClick={handleDownloadExcel}
                          className="btn btn-btn btn-primary mb-lg-0 mb-2 px-3 mr-10" style={{ fontWeight: '600' }}
                        >
                          <CloudDownloadIcon />  Download QR Code
                        </Button>
                      </div>
                    </Col>
                    <Col>
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label htmlFor="first_name">First Name:</Form.Label>
                            <Form.Control
                              type="text"
                              id="first_name"
                              value={userData.first_name}
                              onChange={handleChange}
                              placeholder="Enter First Name"
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label htmlFor="last_name">Last Name:</Form.Label>
                            <Form.Control
                              type="text"
                              id="last_name"
                              value={userData.last_name}
                              onChange={handleChange}
                              placeholder="Enter Last Name"
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label htmlFor="contactNumber">Mobile:</Form.Label>
                            <Form.Control
                              type="contactNumber"
                              id="contactNumber"
                              value={userData.contactNumber}
                              onChange={handleChange}
                              placeholder="Enter Mobile"
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label htmlFor="email">Email:</Form.Label>
                            <Form.Control
                              type="email"
                              id="email"
                              value={userData.email}
                              onChange={handleChange}
                              placeholder="Enter Email"
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label htmlFor="dateOfBirth">Date of Birth :</Form.Label>
                            <Form.Control
                              type="date"
                              id="dateOfBirth"
                              value={userData.dateOfBirth}
                              onChange={handleChange}
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label htmlFor="maritalStatus">Marital Status :</Form.Label>
                            <Form.Control
                              as="select"
                              id="maritalStatus"
                              value={userData.maritalStatus}
                              onChange={handleChange}
                            >
                              <option>Select Status</option>
                              <option value="married">Married</option>
                              <option value="unmarried">Unmarried</option>
                            </Form.Control>
                          </Form.Group>
                        </Col>
                        {userData.maritalStatus === 'married' && (
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label htmlFor="anniversaryDate">Anniversary Date :</Form.Label>
                              <Form.Control
                                type="date"
                                id="anniversaryDate"
                                value={userData.anniversaryDate}
                                onChange={handleChange}
                              />
                            </Form.Group>
                          </Col>
                        )}
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label htmlFor="gender">Gender:</Form.Label>
                            <Form.Select
                              id="gender"
                              value={userData.gender}
                              onChange={handleChange}
                            >
                              <option value="">Select Gender</option>
                              <option value="Male">Male</option>
                              <option value="Female">Female</option>
                              <option value="Other">Other</option>
                            </Form.Select>
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label htmlFor="address">Address :</Form.Label>
                            <Form.Control
                              type="text"
                              id="address"
                              value={userData.address}
                              onChange={handleChange}
                              placeholder='Enter Address'
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label htmlFor="membershipType">Membership Type :</Form.Label>
                            <Form.Control
                              type="text"
                              id="membershipType"
                              value={userData.membershipType}
                              onChange={handleChange}
                              placeholder='Enter Membership Name'
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label htmlFor="membershipMonth">Membership Duration (in Month) :</Form.Label>
                            <Form.Control
                              type="text"
                              id="membershipMonth"
                              value={userData.membershipMonth}
                              onChange={handleChange}
                              placeholder='Enter Membership Duration in day '
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label htmlFor="joinDate">Join Date:</Form.Label>
                            <Form.Control
                              type="date"
                              id="joinDate"
                              value={userData.joinDate}
                              onChange={handleChange}
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label htmlFor="isUserActive">Status:</Form.Label> <br />
                            <Button
                              type="button"
                              variant={userData.isUserActive ? 'success' : 'danger'}
                              onClick={handleToggleStatus}
                            >
                              {userData.isUserActive ? 'Active' : 'Inactive'}
                            </Button>
                          </Form.Group>
                        </Col>
                        <Col md={12}>
                          <Button
                            type="button"
                            variant="btn btn-primary"
                            className="mt-2"
                            onClick={handleUpdateUser}
                          >
                            <LibraryAddCheckIcon /> Update User Details
                          </Button>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </form>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default UserProfile;
