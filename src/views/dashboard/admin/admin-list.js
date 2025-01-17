import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'
import { Row, Col } from 'react-bootstrap'
import Card from '../../../components/Card'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import TextField from '@mui/material/TextField';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import AddIcon from '@mui/icons-material/Add';
import axiosInstance from '../../../js/api';


const AdminList = () => {
  const [admins, setAdmins] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loggedInAdminId, setLoggedInAdminId] = useState('');
  const adminType = localStorage.getItem('adminType');

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Fetch admin data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get('/get-admins');
        setAdmins(response.data.data);
      } catch (error) {
        console.error('Error fetching admin data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axiosInstance.get('/get-profile');
        const adminData = response.data.data;
        setLoggedInAdminId(adminData._id);
      } catch (error) {
        console.error('Error fetching admin details:', error);
      }
    };

    fetchProfileData();
  }, []);

  // Filter admins based on search term, admin type, and createdBy
  const filteredAdmins = admins
    .filter((admin) =>
      admin.full_name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((admin) =>
      adminType === 'MASTER' ? true : admin.type === 'SUB'
    )
    .filter((admin) => admin.createdById === loggedInAdminId);

  // Display admins
  const displayAdmins = filteredAdmins.map((admin, index) => (
    <tr key={index}>
      <td>{index + 1}</td>
      <td>{admin.full_name}</td>
      <td>{admin.type}</td>
      <td>{new Date(admin.createdAt).toLocaleDateString()}</td>
      <td>{admin.mobile}</td>
      <td>{admin.email}</td>
    </tr>
  ));

  return (
    <>
      <div className='margintop'>
        <Row>
          <Col sm="12">
            <Card>
              <Card.Header>
                <div className="header-title d-none d-md-block">
                  <h4 className="card-title">Admin List</h4>
                </div>
              </Card.Header>
              <Card.Body className="px-0" style={{ position: 'relative' }}>
                <div className='card-body pt-0'>
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="header-title">
                      <TextField
                        placeholder="Search"
                        id="outlined-size-small"
                        size="small"
                        className='search-filed'
                        style={{ marginRight: '10px', width: '300px' }}
                        value={searchTerm}
                        onChange={handleSearchChange}
                      />
                    </div>
                    <div className="header-title">
                      <Link
                        className="btn btn-btn btn-primary px-3 mb-lg-0 mb-2 mr-10 "
                        to="/admin/add-admin" style={{ fontWeight: '600' }}
                      >
                        <AddIcon /> Add Admin
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="table-responsive">
                  <table
                    id="user-list-table"
                    className="table table-striped"
                    role="grid"
                    data-toggle="data-table"
                  >
                    <thead>
                      <tr className="ligth">
                        <th><b>No.</b></th>
                        <th><b>Full Name</b></th>
                        <th><b>Type</b></th>
                        <th><b>Date</b></th>
                        <th><b>Mobile</b></th>
                        <th><b>Email</b></th>
                      </tr>
                    </thead>
                    <tbody>{displayAdmins}</tbody>
                  </table>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
      <ToastContainer />
    </>
  )
}

export default AdminList
