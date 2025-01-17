import React, { useState } from 'react';
import { Row, Col, Form, Button, CardHeader } from 'react-bootstrap';
import { BsEye, BsEyeSlash } from 'react-icons/bs';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Card from '../../../components/Card';
import Logo from '../../../assets/images/slimfit-logo.png';
import img1 from '../../../assets/images/bg3.png';
import img2 from '../../../assets/images/right-side-bg.png';
import ContactsIcon from '@mui/icons-material/Contacts';
import api from '../../../js/api'

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true)

    if (!email || !password) {
      toast.error("Please enter both email and password.");
      return;
    }

    try {
      const response = await api.post("/login", { email, password });
      const token = response.data.data.authorization;

      localStorage.setItem("authorization", token);

      toast.success("Login successful", { position: "top-right", className: 'custom-toast' });
      window.location.href = "/dashboard/sales-list";
    } catch (error) {
      console.error("Login failed:", error);

      toast.error(error.response.data.message, {
        position: "top-right",
        className: 'custom-toast'
      });
    }
    setLoading(false)
  };

  return (
    <>
      {loading && (
        <div className="loader-background">
          <div className="spinner-box">
            <div className="three-quarter-spinner"></div>
          </div>
        </div>
      )}
      <section className="login-content">
        <Row className="m-0 align-items-center vh-100">
          <Col md="6" className='d-none d-md-block' style={{ backgroundImage: `url(${img1})`, backgroundSize: 'cover', height: '100vh' }}>
            <img alt='Logo' src={Logo} width={'150px'} style={{ marginTop: '20px' }} />
          </Col>
          <Col md="6" style={{ backgroundImage: `url(${img2})`, backgroundSize: 'cover', height: '100vh' }}>
            <img alt='Logo' src={Logo} className='d-block d-md-none' width={'150px'} style={{ marginTop: '20px' }} />
            <Row className="justify-content-center align-items-center h-100">
              <Col md="7">
                <Card className="card-transparent glass-img p-0 shadow-none d-flex justify-content-center mb-0 logincard">
                  <CardHeader>
                    <div className='header-title'>
                      <h3 className="card-title text-white"><ContactsIcon style={{ fontSize: '40px' }} /> Admin Login</h3>
                    </div>
                  </CardHeader>
                  <Card.Body>
                    <Form>
                      <Form.Group className="mb-3">
                        <Form.Control
                          type="email"
                          placeholder="Email"
                          name="email"
                          value={email}
                          onChange={handleEmailChange}
                        />
                      </Form.Group>
                      <Form.Group className="mb-3 d-flex">
                        <Form.Control
                          type={showPassword ? "text" : "password"}
                          placeholder="Password"
                          name="password"
                          value={password}
                          onChange={handlePasswordChange}
                          style={{ borderRadius: '3px 0px 0px 3px' }}
                        />
                        <Button variant="outline-secondary" style={{ padding: '6px 10px', borderWidth: '1.5px', borderColor: "#fff", borderRadius: '0px 3px 3px 0px', backgroundColor: '#fff' }} onClick={handleTogglePassword}>
                          {showPassword ? <BsEyeSlash /> : <BsEye />}
                        </Button>
                      </Form.Group>
                      <Button variant="primary" onClick={handleSignIn}>
                        Sign In
                      </Button>
                    </Form>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
      </section>
      <ToastContainer />
    </>
  );
};

export default SignIn;
