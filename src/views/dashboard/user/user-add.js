import React, { useState } from 'react';
import { Row, Col, Form, Button } from 'react-bootstrap';
import Card from '../../../components/Card';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import axiosInstance from '../../../js/api';

const AddUser = () => {
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
        selectedFile: null,
        maritalStatus: ''
    });

    const handleChange = (e) => {
        const { id, value, files } = e.target;

        if (id === 'fileInput' && files.length > 0) {
            const file = files[0];
            setUserData((prevData) => ({
                ...prevData,
                selectedFile: file,
                client_img_url: URL.createObjectURL(file),
            }));
        } else if (id === 'maritalStatus') {
            // Handle special case for anniversaryDate when maritalStatus is "unmarried"
            const newAnniversaryDate = value === 'unmarried' ? ' ' : userData.anniversaryDate;

            setUserData((prevData) => ({
                ...prevData,
                [id]: value,
                anniversaryDate: newAnniversaryDate,
            }));
        } else {
            setUserData((prevData) => ({
                ...prevData,
                [id]: value,
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (
            !userData.first_name ||
            !userData.last_name ||
            !userData.contactNumber ||
            !userData.dateOfBirth ||
            !userData.email ||
            !userData.gender ||
            !userData.address ||
            !userData.selectedFile // Ensure a file is selected
        ) {
            toast.error('Please fill in all required fields.');
            return;
        }

        try {
            const formDataForUpload = new FormData();
            formDataForUpload.append('file', userData.selectedFile);
            const uploadResponse = await axiosInstance.post('/file-upload', formDataForUpload);
            const imageUrl = uploadResponse.data.data.fileURL;

            const userDataToSend = {
                ...userData,
                client_img_url: imageUrl,
            };

            await axiosInstance.post('/user/create', userDataToSend);

            setUserData({
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
                selectedFile: null,
                maritalStatus: 'Select Status',
            });

            toast.success('User added successfully!');
        } catch (error) {
            console.error('Error adding user:', error);
            toast.error('Error adding user');
        }
    };

    const handleFileButtonClick = () => {
        document.getElementById('fileInput').click();
    };


    return (
        <div className='margintop'>
            <Row>
                <Col xl="12" lg="12">
                    <Card>
                        <Card.Header className="d-flex justify-content-between">
                            <div className="header-title">
                                <h4 className="card-title">Add User</h4>
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <div className="new-user-info">
                                <form onSubmit={handleSubmit}>
                                    <Row>
                                        <Col md={4} className="text-center mt-3">
                                            <img alt='Photos' src={userData.client_img_url} style={{ borderRadius: '10px', width: '70%', height: '70%' }} />
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
                                                <Col md={12}>
                                                    <Button type="submit" className="btn btn-primary">
                                                        Add User
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

export default AddUser;
