import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Form, Button } from 'react-bootstrap';
import Card from '../../../components/Card';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DrawIcon from '@mui/icons-material/Draw';
import TextField from '@mui/material/TextField';
import DateRangeIcon from '@mui/icons-material/DateRange';
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import AddIcon from '@mui/icons-material/Add';
import axiosInstance from '../../../js/api';
import Swal from 'sweetalert2';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDateRangePicker, setShowDateRangePicker] = useState(false);
  const [selectedActivationStatus, setSelectedActivationStatus] = useState('all');
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(new Date().setMonth(new Date().getMonth() - 3)),
      endDate: new Date(),
      key: 'selection'
    }
  ]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleDateRangeChange = (item) => {
    setDateRange([item.selection]);
  };

  const handleDateRangeButtonClick = () => {
    setShowDateRangePicker(!showDateRangePicker);
  };

  const handleActivationStatusChange = (event) => {
    setSelectedActivationStatus(event.target.value);
  };

  const handleUserRemove = (userId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this user!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, remove it!',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        removeUser(userId);
      }
    });
  };

  const removeUser = async (userId) => {
    try {
      await axiosInstance.post(`/user/remove?id=${userId}`);
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
      toast.success('User removed successfully');
    } catch (error) {
      console.error('Error removing user:', error);
      toast.error('Error removing user');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get('/user/get');
        setUsers(response.data.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchData();
  }, []);

  // Filter users based on search term and date range
  const filteredUsers = users.filter((user) => {
    const nameMatch =
      user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.last_name.toLowerCase().includes(searchTerm.toLowerCase());

    const dateRangeMatch =
      dateRange[0].startDate <= new Date(user.joinDate) &&
      (!dateRange[0].endDate || new Date(user.joinDate) <= dateRange[0].endDate);

    const activationStatusMatch =
      (selectedActivationStatus === 'all') ||
      (selectedActivationStatus === 'active' && user.isUserActive) ||
      (selectedActivationStatus === 'inactive' && !user.isUserActive);

    return nameMatch && dateRangeMatch && activationStatusMatch;
  });

  const displayUsers = filteredUsers.map((user, index) => (
    <tr key={index}>
      <td>{index + 1}</td>
      <td>{user.first_name + ' ' + user.last_name}</td>
      <td>{user.gender}</td>
      <td>{user.joinDate ? new Date(user.joinDate).toLocaleDateString() : 'N/A'}</td>
      <td>{user.contactNumber}</td>
      <td>
        <button
          className={`btn`}
          style={{ backgroundColor: user.isUserActive ? "#42ff74" : "#ff7272", padding: '0px 10px', fontSize: '14px', fontWeight: '600', color: '#000' }}
        >
          {user.isUserActive ? 'Active' : 'Inactive'}
        </button>
      </td>
      <td>
        <div className="flex align-items-center list-user-action">
          <Link
            className="btn btn-sm btn-icon btn-success"
            to={`/user/profile-user?user_id=${user._id}`}
          >
            <span className="btn-inner">
              <DrawIcon style={{ width: '32px', marginTop: '7px' }} />
            </span>
          </Link>
          <button
            style={{ marginLeft: '10px' }}
            className="btn btn-sm btn-icon btn-danger"
            onClick={() => handleUserRemove(user._id)}
          >
            <span className="btn-inner">
              <svg
                width="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                stroke="currentColor"
              >
                <path
                  d="M19.3248 9.46826C19.3248 9.46826 18.7818 16.2033 18.4668 19.0403C18.3168 20.3953 17.4798 21.1893 16.1088 21.2143C13.4998 21.2613 10.8878 21.2643 8.27979 21.2093C6.96079 21.1823 6.13779 20.3783 5.99079 19.0473C5.67379 16.1853 5.13379 9.46826 5.13379 9.46826"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
                <path
                  d="M20.708 6.23975H3.75"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
                <path
                  d="M17.4406 6.23973C16.6556 6.23973 15.9796 5.68473 15.8256 4.91573L15.5826 3.69973C15.4326 3.13873 14.9246 2.75073 14.3456 2.75073H10.1126C9.53358 2.75073 9.02558 3.13873 8.87558 3.69973L8.63258 4.91573C8.47858 5.68473 7.80258 6.23973 7.01758 6.23973"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </svg>
            </span>
          </button>
        </div>
      </td>
    </tr>
  ));

  const activationStatusFilter = (
    <Form.Select
      className='search-filed'
      id="outlined-size-small"
      size="small"
      style={{ borderRadius: '3px', borderColor: '#000' }}
      value={selectedActivationStatus}
      onChange={handleActivationStatusChange}
    >
      <option value="all" selected>All</option>
      <option value="active">Active</option>
      <option value="inactive">Inactive</option>
    </Form.Select>
  );

  return (
    <>
      <div className='margintop'>
        <Row>
          <Col sm="12">
            <Card>
              <Card.Header>
                <div className="header-title d-none d-md-block">
                  <h4 className="card-title">User List</h4>
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
                      <Button className="btn btn-btn btn-primary ml-60 ml-md-0" onClick={handleDateRangeButtonClick} style={{ padding: '5px' }}>
                        <DateRangeIcon style={{ color: '#fff' }} />
                      </Button>
                      {showDateRangePicker && (
                        <div className='date-filter'
                          style={{
                            position: 'absolute',
                            left: '70%',
                            zIndex: '999',
                            boxShadow: 'rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px',
                          }}
                        >
                          <DateRange
                            editableDateInputs={true}
                            onChange={handleDateRangeChange}
                            moveRangeOnFirstSelection={false}
                            ranges={dateRange}
                          />
                        </div>
                      )}
                    </div>
                    <div className="header-title">
                      <Form.Group className="col-md-8 d-flex">
                        {activationStatusFilter}
                      </Form.Group>
                    </div>
                    <div className="header-title">
                      <Link
                        className="btn btn-btn btn-primary px-3 mb-lg-0 mb-2 mr-10 "
                        to="/user/add-user" style={{ fontWeight: '600' }}
                      >
                        <AddIcon /> Add User
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
                        <th><b>Gender</b></th>
                        <th><b>Joining Date</b></th>
                        <th><b>Mobile</b></th>
                        <th><b>User Status</b></th>
                        <th min-width="100px"><b>Action</b></th>
                      </tr>
                    </thead>
                    <tbody>{displayUsers}</tbody>
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

export default UserList
