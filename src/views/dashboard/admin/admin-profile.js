import React, { useState, useEffect } from 'react';
import { Row, Col, Form, Button } from 'react-bootstrap';
import Card from '../../../components/Card';
import axiosInstance from '../../../js/api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LibraryAddCheckIcon from '@mui/icons-material/LibraryAddCheck';
import photo from '../../../assets/images/avatars/avatar9.jpg';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import { formatDate } from '@fullcalendar/react';

const AdminProfile = () => {
  const [formData, setFormData] = useState({
    company_id: null,
    full_name: '',
    mobile: '',
    email: '',
    companyName: '',
    companyAddress: '',
    companyMobile: '',
    companyEmail: '',
    companyGST: '',
    companyLogoUrl: '',
    companyThemeColor: '',
    companyFbLink: '',
    companyInstaLink: '',
    selectedFile: null,
  });

  const [companyDataExists, setCompanyDataExists] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get('/get-profile');
        const adminData = response.data.data;
        setFormData((prevData) => ({
          ...prevData,
          full_name: adminData.full_name,
          mobile: adminData.mobile,
          email: adminData.email,
        }));

        const companyResponse = await axiosInstance.get('/company/get');

        if (companyResponse.data.data.length > 0) {
          const companyData = companyResponse.data.data[0];
          setCompanyDataExists(true);
          setFormData((prevData) => ({
            ...prevData,
            company_id: companyData._id,
            companyName: companyData.company_name,
            companyAddress: companyData.company_address,
            companyMobile: companyData.company_mobile,
            companyEmail: companyData.company_email,
            companyGST: companyData.company_gst,
            companyLogoUrl: companyData.company_logo_url,
            companyThemeColor: companyData.company_theme_color,
            companyFbLink: companyData.company_fb_link,
            companyInstaLink: companyData.company_instagram_link,
          }));
        } else {
          setCompanyDataExists(false);
        }
      } catch (error) {
        console.error('Error fetching admin details:', error);
        toast.error('Error fetching admin details');
      }
    };

    fetchData();
  }, []);

  const allowedImageTypes = ['image/jpeg', 'image/png', 'image/jpg'];

  const handleChange = (e) => {
    const { id, value, files } = e.target;

    if (id === 'fileInput' && files.length > 0) {
      const file = files[0];

      if (!allowedImageTypes.includes(file.type)) {
        toast.error('Invalid image format. Please upload a valid image.');
        return;
      }

      setFormData({
        ...formData,
        selectedFile: file,
        companyLogoUrl: URL.createObjectURL(file),
      });
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [id]: value,
      }));
    }
  };

  const handleUpdate = async () => {
    try {
      const formDataForUpload = new FormData();
      formDataForUpload.append('file', formData.selectedFile);
      const uploadResponse = await axiosInstance.post('/file-upload', formDataForUpload);
      const imageUrl = uploadResponse.data.data.fileURL;
      const response = await axiosInstance.post("/company/update", {
        company_id: formData.company_id,
        company_name: formData.companyName,
        company_address: formData.companyAddress,
        company_mobile: formData.companyMobile,
        company_email: formData.companyEmail,
        company_gst: formData.companyGST,
        company_logo_url: imageUrl,
        company_theme_color: formData.companyThemeColor,
        company_fb_link: formData.companyFbLink,
        company_instagram_link: formData.companyInstaLink,
      });

      toast.success('Details updated successfully', { autoClose: 2000 });
    } catch (error) {
      console.error('Error updating details:', error);
      toast.error('Error updating details');
    }
  };

  const handleFileButtonClick = () => {
    document.getElementById('fileInput').click();
  };

  const handleAddCompany = async () => {
    try {
      const formDataForUpload = new FormData();
      formDataForUpload.append('file', formData.selectedFile);
      const uploadResponse = await axiosInstance.post('/file-upload', formDataForUpload);
      const imageUrl = uploadResponse.data.data.fileURL;
      const response = await axiosInstance.post("/company/create", {
        company_name: formData.companyName,
        company_address: formData.companyAddress,
        company_mobile: formData.companyMobile,
        company_email: formData.companyEmail,
        company_gst: formData.companyGST,
        company_logo_url: imageUrl,
        company_theme_color: formData.companyThemeColor,
        company_fb_link: formData.companyFbLink,
        company_instagram_link: formData.companyInstaLink,
      });
      toast.success('Company details added successfully', { autoClose: 2000 });
    } catch (error) {
      console.error('Error adding company details:', error);
      toast.error('Error adding company details');
    }
  };

  const handleUpdateAdminDetails = async () => {
    try {
      const response = await axiosInstance.post("/update-profile", {
        full_name: formData.full_name,
        mobile: formData.mobile,
        email: formData.email,
      });

      toast.success('Admin details updated successfully', { autoClose: 2000 });
    } catch (error) {
      console.error('Error updating admin details:', error);
      toast.error('Error updating admin details');
    }
  };

  return (
    <div className='margintop'>
      <Col xl='12' lg='12'>
        <Row>
          <div className='col-md-12'>
            <Card>
              <Card.Header className='d-flex justify-content-between'>
                <div className='header-title'>
                  <h4 className='card-title'>Admin Details</h4>
                </div>
              </Card.Header>
              <Card.Body>
                <div className='new-user-info'>
                  <form>
                    <div className='col-12'>
                      <div className=''>
                        <Form.Group className='form-group'>
                          <Form.Label htmlFor='full_name'>Full Name:</Form.Label>
                          <Form.Control
                            type='text'
                            id='full_name'
                            placeholder='Enter Name'
                            value={formData.full_name}
                            onChange={handleChange}
                          />
                        </Form.Group>
                        <Form.Group className='form-group'>
                          <Form.Label htmlFor='mobile'>Mobile Number:</Form.Label>
                          <Form.Control
                            type='text'
                            id='mobile'
                            placeholder='Enter your mobile'
                            value={formData.mobile}
                            onChange={handleChange}
                          />
                        </Form.Group>
                        <Form.Group className='form-group'>
                          <Form.Label htmlFor='email'>Email:</Form.Label>
                          <Form.Control
                            type='email'
                            id='email'
                            placeholder='Enter Your Email'
                            value={formData.email}
                            onChange={handleChange}
                          />
                        </Form.Group>
                      </div>
                      <Button
                        type='button'
                        variant='btn btn-primary'
                        className='mt-2'
                        onClick={handleUpdateAdminDetails}
                      >
                        Update
                      </Button>
                    </div>
                  </form>
                </div>
              </Card.Body>
            </Card>
          </div>
          <div className='col-12'>
            <Card>
              <Card.Header className='d-flex justify-content-between'>
                <div className='header-title'>
                  <h4 className='card-title'>Update Company Details For Invoice:-</h4>
                </div>
              </Card.Header>
              <Card.Body>
                <div className='new-user-info'>
                  <form>
                    <Row>
                      <Col md={4} className='text-center mt-3'>
                        <img alt='Photos' src={formData.companyLogoUrl} style={{ borderRadius: '10px', width: '70%', height: '70%' }} />
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
                      </Col>
                      <Col md={8}>
                        <Row>
                          <Form.Group className='col-md-6 form-group'>
                            <Form.Label htmlFor='companyName'>Company Name:</Form.Label>
                            <Form.Control
                              type='text'
                              id='companyName'
                              placeholder='Enter Company Name'
                              value={formData.companyName}
                              onChange={handleChange}
                            />
                          </Form.Group>
                          <Form.Group className='col-md-6 form-group'>
                            <Form.Label htmlFor='companyAddress'>Company Address:</Form.Label>
                            <Form.Control
                              type='text'
                              id='companyAddress'
                              placeholder='Enter Company Address'
                              value={formData.companyAddress}
                              onChange={handleChange}
                            />
                          </Form.Group>
                          <Form.Group className='col-md-6 form-group'>
                            <Form.Label htmlFor='companyMobile'>Company Mobile:</Form.Label>
                            <Form.Control
                              type='text'
                              id='companyMobile'
                              placeholder='Enter Company Mobile'
                              value={formData.companyMobile}
                              onChange={handleChange}
                            />
                          </Form.Group>
                          <Form.Group className='col-md-6 form-group'>
                            <Form.Label htmlFor='companyEmail'>Company Email:</Form.Label>
                            <Form.Control
                              type='text'
                              id='companyEmail'
                              placeholder='Enter Company Email'
                              value={formData.companyEmail}
                              onChange={handleChange}
                            />
                          </Form.Group>
                          <Form.Group className='col-md-12 form-group'>
                            <Form.Label htmlFor='companyGST'>Company GST:</Form.Label>
                            <Form.Control
                              type='text'
                              id='companyGST'
                              placeholder='Enter Company GST'
                              value={formData.companyGST}
                              onChange={handleChange}
                            />
                          </Form.Group>
                          <Form.Group className='col-md-6 form-group'>
                            <Form.Label htmlFor='companyInstaLink'>Instagram Link:</Form.Label>
                            <Form.Control
                              type='text'
                              id='companyInstaLink'
                              value={formData.companyInstaLink}
                              onChange={handleChange}
                            />
                          </Form.Group>
                          <Form.Group className='col-md-6 form-group'>
                            <Form.Label htmlFor='companyFbLink'>Facebook Link:</Form.Label>
                            <Form.Control
                              type='text'
                              id='companyFbLink'
                              value={formData.companyFbLink}
                              onChange={handleChange}
                            />
                          </Form.Group>
                          <Form.Group className='col-md-12 form-group'>
                            <Form.Label htmlFor='companyThemeColor'>Invoice Theme:</Form.Label>
                            <Form.Control
                              type='color'
                              id='companyThemeColor'
                              value={formData.companyThemeColor}
                              onChange={handleChange}
                            />
                          </Form.Group>
                        </Row>
                        {companyDataExists ? (
                          <Button
                            type='button'
                            variant='btn btn-primary'
                            className='mt-2'
                            onClick={handleUpdate}
                          >
                            <LibraryAddCheckIcon /> Update Company Details
                          </Button>
                        ) : (
                          <Button
                            type='button'
                            variant='btn btn-success'
                            className='mt-2'
                            onClick={handleAddCompany}
                          >
                            <LibraryAddCheckIcon /> Add Company Details
                          </Button>
                        )}
                      </Col>
                    </Row>
                  </form>
                </div>
              </Card.Body>
            </Card>
          </div>
        </Row>
      </Col>
      <ToastContainer />
    </div>
  );
};

export default AdminProfile;
