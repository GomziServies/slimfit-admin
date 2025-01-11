import React, { useState, useEffect } from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Card from '../../../components/Card';
import 'react-toastify/dist/ReactToastify.css';
import DateRangeIcon from '@mui/icons-material/DateRange';
import DrawIcon from '@mui/icons-material/Draw';
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import TextField from '@mui/material/TextField';
import axiosInstance from '../../../js/api';
import { ToastContainer, toast } from 'react-toastify'
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Swal from 'sweetalert2';
import DeleteIcon from '@mui/icons-material/Delete';


const SalesList = () => {
  const [employee, setEmployee] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDateRangePicker, setShowDateRangePicker] = useState(false);
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)),
      endDate: new Date(),
      key: 'selection',
    },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get('/invoice/get');
        setEmployee(response.data.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast.error('Error fetching user data');
      }
    };

    fetchData();
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleDateRangeChange = (item) => {
    setDateRange([item.selection]);
  };

  const handleDateRangeButtonClick = () => {
    setShowDateRangePicker(!showDateRangePicker);
  };

  //Pagination
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage - 1);
  };

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(0);
  };

  const offset = currentPage * itemsPerPage;

  // Calculate sums
  const totalPaidAmount = employee.reduce((sum, invoice) => sum + parseFloat(invoice.paidPayment), 0);
  const totalDueAmount = employee.reduce((sum, invoice) => sum + parseFloat(invoice.dueAmount), 0);
  const totalAmount = employee.reduce((sum, invoice) => sum + parseFloat(invoice.totalPayment), 0);

  const filteredEmployee = employee.filter((invoice) => {
    const nameMatch = invoice.fullName.toLowerCase().includes(searchTerm.toLowerCase());

    const dateRangeMatch =
      dateRange[0].startDate <= new Date(invoice.createdAt) &&
      (!dateRange[0].endDate || new Date(invoice.createdAt) <= dateRange[0].endDate);

    return nameMatch && dateRangeMatch;
  });

  const handleInvoiceRemove = (invoiceID) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this Invoice!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, remove it!',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        removeUser(invoiceID);
      }
    });
  };

  const removeUser = async (invoiceID) => {
    try {
      await axiosInstance.post(`/invoice/remove?id=${invoiceID}`);
      setEmployee((prevUsers) => prevUsers.filter((user) => user._id !== invoiceID));
      toast.success('Invoice removed successfully');
    } catch (error) {
      console.error('Error removing Invoice:', error);
      toast.error('Error removing Invoice');
    }
  };

  const displayEmployee = filteredEmployee.map((invoice, index) => (
    <tr key={index} >
      <td>{index + 1}</td>
      <td>{invoice.fullName}</td>
      <td>{invoice.phoneNumber}</td>
      <td>{invoice.paidPayment}</td>
      <td>{invoice.totalPayment}</td>
      <td>{new Date(invoice.createdAt).toLocaleDateString()}</td>
      <td>
        <div className="flex align-items-center list-user-action">
          <Link
            className="btn btn-success px-2 py-1"
            to={`/dashboard/update-invoice?invoice_id=${invoice._id}`}
          >
            <span className="btn-inner">
              <DrawIcon style={{ marginTop: '7px' }} />
            </span> Update
          </Link>
          <Button className="btn bg-danger px-2 py-1" style={{ marginLeft: '8px', border: 'none' }} onClick={() => handleInvoiceRemove(invoice._id)} >
            <span className="btn-inner">
              <DeleteIcon style={{ marginTop: '7px' }} />
            </span>
          </Button>
        </div>
      </td>
    </tr>
  ));

  return (
    <>
      <div className='margintop'>
        <Row>
          <Col sm="12">
            <Card>
              <Card.Header className="d-flex justify-content-between">
                <div className="header-title">
                  <h3 className="card-title">Total Sales</h3>
                </div>
                <div className="header-title">
                  <Link
                    className="btn btn-btn btn-primary px-3 mb-lg-0 mb-2 mr-10 "
                    to="/dashboard/create-invoice" style={{ fontWeight: '600' }}
                  >
                    <NoteAddIcon /> Create invoice
                  </Link>
                </div>
              </Card.Header>
              <div className='mb-30 col-12 mt-30 ml-30'>
                <Row>
                  <Col className='col-md-3 col-10 mb-lg-0 mb-2 '>
                    <div style={{ padding: '20px', boxShadow: '2px 2px 10px #d2e5ff', backgroundColor: '#cce5ff', borderRadius: '10px' }}>
                      <Row>
                        <div className='col-4'>
                          <div>
                            <AttachMoneyIcon style={{ fontSize: '56px', color: '#004085' }} />
                          </div>
                        </div>
                        <div className='col-8'>
                          <span style={{ fontSize: '18px', fontWeight: '600', color: '#000' }}>₹{totalPaidAmount} /-</span> <br />
                          <span style={{ opacity: '.8', color: '#004085', fontSize: '14px', }}>Paid Amount</span>
                        </div>
                      </Row>
                    </div>
                  </Col>
                  <Col className='col-md-3 col-10 mb-lg-0 mb-2'>
                    <div style={{ padding: '20px', boxShadow: '2px 2px 10px #d2e5ff', backgroundColor: '#fff3cd', borderRadius: '10px' }}>
                      <Row>
                        <div className='col-4 pl-0'>
                          <div className='ml-10'>
                            <CurrencyExchangeIcon style={{ fontSize: '56px', color: '#856404' }} />
                          </div>
                        </div>
                        <div className='col-8'>
                          <span style={{ fontSize: '18px', fontWeight: '600', color: '#000' }}>₹{totalDueAmount} /-</span> <br />
                          <span style={{ opacity: '.8', color: '#856404', fontSize: '14px', }}>Due Amount</span>
                        </div>
                      </Row>
                    </div>
                  </Col>
                  <Col className='col-md-3 col-10'>
                    <div style={{ padding: '20px', boxShadow: '2px 2px 10px #d2e5ff', backgroundColor: '#d4edda', borderRadius: '10px' }}>
                      <Row>
                        <div className='col-4 pl-0'>
                          <div className='ml-10'>
                            <AccountBalanceIcon style={{ fontSize: '56px', color: '#155724' }} />
                          </div>
                        </div>
                        <div className='col-8'>
                          <span style={{ fontSize: '18px', fontWeight: '600', color: '#000' }}>₹{totalAmount} /-</span> <br />
                          <span style={{ opacity: '.8', color: '#155724', fontSize: '14px', }}>Total Amount
                          </span>
                        </div>
                      </Row>
                    </div>
                  </Col>
                </Row>
              </div>
              <Card.Body className="px-0" style={{ position: 'relative' }}>
                <div className='card-body pt-0 pb-1'>
                  <div className="d-flex justify-content-between">
                    <div className="header-title">
                      <h3 className="card-title">Paid Amount</h3>
                    </div>
                    <div className="header-title d-flex">
                      <div>
                        <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                          <InputLabel id="demo-select-small-label">Show Rows</InputLabel>
                          <Select
                            labelId="demo-select-small-label"
                            id="demo-select-small"
                            value={itemsPerPage}
                            label="Show Rows"
                            onChange={handleItemsPerPageChange}
                          >
                            <MenuItem value={5}>5</MenuItem>
                            <MenuItem value={10}>10</MenuItem>
                            <MenuItem value={15}>15</MenuItem>
                            <MenuItem value={20}>20</MenuItem>
                            <MenuItem value={30}>30</MenuItem>
                            <MenuItem value={100}>100</MenuItem>
                          </Select>
                        </FormControl>
                      </div>
                      <TextField
                        placeholder="Search"
                        id="outlined-size-small"
                        size="small"
                        className='search-filed'
                        style={{ marginRight: '10px', width: '300px', marginTop: '8.5px' }}
                        value={searchTerm}
                        onChange={handleSearchChange}
                      />
                      <Button className="btn btn-btn btn-primary ml-60 ml-md-0 py-0 mt-2 mb-1" onClick={handleDateRangeButtonClick} style={{ padding: '5px' }}>
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
                        <th>No.</th>
                        <th>User Name</th>
                        <th>Mobile</th>
                        <th>Paid Amount</th>
                        <th>Total Amount</th>
                        <th>Purchase Date</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>{displayEmployee}</tbody>
                  </table>
                </div>
                <div className='pagination-container'>
                  <Stack spacing={2}>
                    <Pagination
                      count={Math.ceil(filteredEmployee.length / itemsPerPage)}
                      page={currentPage + 1}
                      onChange={handlePageChange}
                      variant='outlined'
                      shape='rounded'
                    />
                  </Stack>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
      <ToastContainer />
    </>
  );
};

export default SalesList;
