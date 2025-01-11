import React, { useState } from 'react';
import { Row, Col, Form, Button } from 'react-bootstrap';
import Card from '../../../components/Card';
import { toast } from 'react-toastify';
import { BsEye, BsEyeSlash } from 'react-icons/bs';
import 'react-toastify/dist/ReactToastify.css';
import axiosInstance from '../../../js/api';


const AddAdmin = () => {
    const [adminData, setAdminData] = useState({
        full_name: '',
        email: '',
        mobile: '',
        admin_type: '',
        password: '',
        rePassword: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const adminType = localStorage.getItem('adminType');

    const handleChange = (e) => {
        const { id, value } = e.target;
        setAdminData((prevData) => ({
            ...prevData,
            [id]: value,
        }));
    };

    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!adminData.full_name || !adminData.email || !adminData.password || !adminData.rePassword) {
            toast.error('Please fill in all required fields.');
            return;
        }

        if (adminData.password !== adminData.rePassword) {
            toast.error('Passwords do not match.');
            return;
        }

        try {
            // Send a request to create admin
            await axiosInstance.post('/create-admin', {
                full_name: adminData.full_name,
                email: adminData.email,
                mobile: adminData.mobile,
                type: adminData.admin_type,
                password: adminData.password,
            });

            // Clear the form after successful submission
            setAdminData({
                full_name: '',
                email: '',
                mobile: '',
                admin_type: '',
                password: '',
                rePassword: '',
            });

            toast.success('Admin added successfully!');
        } catch (error) {
            console.error('Error creating admin:', error);
            toast.error('Error creating admin. Please try again.');
        }
    };

    const adminTypeOptions = () => {
        if (adminType === 'CLIENT') {
            return (
                <>
                    <option value="SUB">Sub Admin</option>
                    {/* You can add more options based on your requirements */}
                </>
            );
        } else if (adminType === 'TRIAL') {
            return (
                <>
                    <option value="SUB">Sub Admin</option>
                </>
            );
        } else {
            return (
                <>
                    <option value="SUB">Sub Admin</option>
                    <option value="CLIENT">Client Admin</option>
                    <option value="TRIAL">Trial Admin</option>
                </>
            );
        }
    };


    return (
        <div className='margintop'>
            <Row>
                <Col xl="12" lg="12">
                    <Card>
                        <Card.Header className="d-flex justify-content-between">
                            <div className="header-title">
                                <h4 className="card-title">Add Admin</h4>
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <div className="new-user-info">
                                <form onSubmit={handleSubmit}>
                                    <Row>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label htmlFor="full_name">Full Name:</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    id="full_name"
                                                    value={adminData.full_name}
                                                    onChange={handleChange}
                                                    placeholder="Enter Full Name"
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label htmlFor="email">Email:</Form.Label>
                                                <Form.Control
                                                    type="email"
                                                    id="email"
                                                    value={adminData.email}
                                                    onChange={handleChange}
                                                    placeholder="Enter Email"
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label htmlFor="mobile">Mobile :</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    id="mobile"
                                                    value={adminData.mobile}
                                                    onChange={handleChange}
                                                    placeholder="Enter Mobile No."
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label htmlFor="admin_type">Admin Type:</Form.Label>
                                                <Form.Select
                                                    id="admin_type"
                                                    value={adminData.admin_type}
                                                    onChange={handleChange}
                                                    placeholder="Select Admin Type"
                                                >
                                                    <option value="">Select Admin Type</option>
                                                    {adminTypeOptions()}
                                                </Form.Select>
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label htmlFor="password">Password:</Form.Label>
                                                <div className="input-group">
                                                    <Form.Control
                                                        type={showPassword ? "text" : "password"}
                                                        id="password"
                                                        value={adminData.password}
                                                        onChange={handleChange}
                                                        placeholder="Enter Password"
                                                    />
                                                    <Button variant="outline-secondary" style={{ padding: '6px 10px', borderWidth: '1.5px', borderColor: "#dfdfdf" }} onClick={handleTogglePassword}>
                                                        {showPassword ? <BsEyeSlash /> : <BsEye />}
                                                    </Button>
                                                </div>
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label htmlFor="rePassword">Re-enter Password:</Form.Label>
                                                <Form.Control
                                                    type="password"
                                                    id="rePassword"
                                                    value={adminData.rePassword}
                                                    onChange={handleChange}
                                                    placeholder="Enter Re-enter Password"
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={12}>
                                            <Button type="submit" className="btn btn-primary">
                                                Add Admin
                                            </Button>
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

export default AddAdmin;
