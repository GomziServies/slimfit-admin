import React, { useEffect, useState, memo, Fragment } from 'react';
import { Row, Col, Card, Button } from 'react-bootstrap'
import AOS from 'aos'
import '../../../node_modules/aos/dist/aos'
import '../../../node_modules/aos/dist/aos.css'
import SwiperCore, { Navigation } from 'swiper'
import Chart from 'react-apexcharts'
import 'swiper/swiper-bundle.min.css'
import { useSelector } from 'react-redux'
import * as SettingSelector from '../../store/setting/selectors'
import imgadmin from '../../assets/images/admin-vector.png'
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import DateRangeIcon from '@mui/icons-material/DateRange';
import TextField from '@mui/material/TextField';
import axiosInstance from '../../js/api';
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { toast, ToastContainer } from 'react-toastify';
import moment from 'moment';
import Pagination from './pagination';


// install Swiper modules
SwiperCore.use([Navigation])

const Index = memo((props) => {
  const [invoice, setInvoice] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [adminData, setAdminData] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get('/get-profile');
        const adminData = response.data.data;
        setAdminData(adminData)
      } catch (error) {
        console.error('Error fetching admin details:', error);
        toast.error('Error fetching admin details');
      }
    };

    const fetchDashboard = async () => {
      try {
        const response = await axiosInstance.get('/dashboard/get');
        const dashboardData = response.data.data;
        console.log(dashboardData)
        setDashboardData(dashboardData)
      } catch (error) {
        console.error('Error fetching admin details:', error);
        toast.error('Error fetching admin details');
      }
    };

    fetchData();
    fetchDashboard();
  }, []);
  useSelector(SettingSelector.theme_color)

  const getVariableColor = () => {
    let prefix =
      getComputedStyle(document.body).getPropertyValue('--prefix') || 'bs-'
    if (prefix) {
      prefix = prefix.trim()
    }
    const color1 = getComputedStyle(document.body).getPropertyValue(
      `--${prefix}primary`,
    )
    const color2 = getComputedStyle(document.body).getPropertyValue(
      `--${prefix}info`,
    )
    const color3 = getComputedStyle(document.body).getPropertyValue(
      `--${prefix}primary-tint-20`,
    )
    const color4 = getComputedStyle(document.body).getPropertyValue(
      `--${prefix}warning`,
    )
    return {
      primary: color1.trim(),
      info: color2.trim(),
      warning: color4.trim(),
      primary_light: color3.trim(),
    }
  }
  const variableColors = getVariableColor()

  const colors = [variableColors.primary, variableColors.info]
  useEffect(() => {
    return () => colors
  })

  useEffect(() => {
    AOS.init({
      startEvent: 'DOMContentLoaded',
      disable: function () {
        var maxWidth = 996
        return window.innerWidth < maxWidth
      },
      throttleDelay: 10,
      once: true,
      duration: 700,
      offset: 10,
    })
  })

  const chart1 = {
    options: {
      chart: {
        fontFamily:
          '"Inter", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
        toolbar: {
          show: false,
        },
        sparkline: {
          enabled: false,
        },
      },
      colors: colors,
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'smooth',
        width: 3,
      },
      yaxis: {
        show: true,
        labels: {
          show: true,
          minWidth: 19,
          maxWidth: 19,
          style: {
            colors: '#8A92A6',
          },
          offsetX: -5,
        },
      },
      legend: {
        show: false,
      },
      xaxis: {
        labels: {
          minHeight: 22,
          maxHeight: 22,
          show: true,
          style: {
            colors: '#8A92A6',
          },
        },
        lines: {
          show: false, //or just here to disable only x axis grids
        },
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'Jun', 'Jul', 'Aug'],
      },
      grid: {
        show: false,
      },
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'dark',
          type: 'vertical',
          shadeIntensity: 0,
          gradientToColors: undefined, // optional, if not defined - uses the shades of same color in series
          inverseColors: true,
          opacityFrom: 0.4,
          opacityTo: 0.1,
          stops: [0, 50, 80],
          colors: colors,
        },
      },
      tooltip: {
        enabled: true,
      },
    },
    series: [
      {
        name: 'total',
        data: [0, 20, 44, 100, 84, 100, 124, 20, 44, 100, 84, 100, 124],
      },
    ],
  }

  const [state, setState] = useState([
    {
      startDate: new Date(),
      endDate: null,
      key: 'selection'
    }
  ]);

  const [showDateRangePicker, setShowDateRangePicker] = useState(false);

  const handleDateRangeButtonClick = () => {
    setShowDateRangePicker(!showDateRangePicker);
  };

  //Company Details Get
  const [formData, setFormData] = useState({
    companyName: '',
    companyMobile: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const companyResponse = await axiosInstance.get('/company/get');

        if (companyResponse.data.data.length > 0) {
          const companyData = companyResponse.data.data[0];
          setFormData((prevData) => ({
            ...prevData,
            companyName: companyData.company_name,
            companyMobile: companyData.company_mobile,
          }));
        }
      } catch (error) {
        console.error('Error fetching admin details:', error);
        toast.error('Error fetching admin details');
      }
    };

    fetchData();
  }, []);

  const handleWhatsAppClick = (invoice) => {
    setSelectedInvoice(invoice);

    // Assuming you have a function to send a WhatsApp message
    sendWhatsAppMessage(invoice.phoneNumber, invoice);
  };

  // Function to send a WhatsApp message
  const sendWhatsAppMessage = (phoneNumber, invoice) => {
    // Format the phone number (remove leading '+')
    const formattedPhoneNumber = phoneNumber.replace(/^\+/, '');

    // Construct the WhatsApp message with company name, contact details, invoice information, and product name
    const message = `Hi ${invoice.fullName},\n\n`
      + `You have a due amount of ₹${invoice.dueAmount} for the product "${invoice.productName}".\n`
      + `Please make the payment at your earliest convenience.\n\n`
      + `Company Name: ${formData.companyName}\n`
      + `Contact: ${formData.companyMobile}\n\n`
      + `Thanks!`;

    // Construct the WhatsApp message link
    const whatsappLink = `https://api.whatsapp.com/send?phone=${formattedPhoneNumber}&text=${encodeURIComponent(message)}`;

    // Open the link in a new window
    window.open(whatsappLink, '_blank');
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Calculate sums
  const totalPaidAmount = invoice.reduce((sum, invoice) => sum + parseFloat(invoice.paidPayment), 0);
  const totalDueAmount = invoice.reduce((sum, invoice) => sum + parseFloat(invoice.dueAmount), 0);
  const totalAmount = invoice.reduce((sum, invoice) => sum + parseFloat(invoice.totalPayment), 0);

  //Invoice Date
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get('/invoice/get');
        setInvoice(response.data.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast.error('Error fetching user data');
      }
    };

    fetchData();
  }, []);

  // Move the declaration of invoicesWithDueAmount here
  const invoicesWithDueAmount = invoice
    .filter((invoice) => parseFloat(invoice.dueAmount) > 0)
    .filter((invoice) => {
      const invoiceDate = new Date(invoice.dueAmountDate);
      const today = new Date();
      const endDate = new Date();
      endDate.setDate(today.getDate() + 7);

      return today <= invoiceDate && invoiceDate <= endDate;
    });

  // Pagination
  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(invoicesWithDueAmount.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // Display filtered data in a table
  const displayFilteredInvoices = invoicesWithDueAmount
    .slice(startIndex, endIndex)
    .map((filteredInvoice, index) => (
      <tr key={index}>
        <td style={{ fontSize: '14px', padding: '8px', textAlign: 'center' }}>{index + 1}</td>
        <td style={{ fontSize: '14px', padding: '8px', textAlign: 'center' }}>{filteredInvoice.fullName}</td>
        <td style={{ fontSize: '14px', padding: '8px', textAlign: 'center' }}>{filteredInvoice.productName}</td>
        <td style={{ fontSize: '14px', padding: '8px', textAlign: 'center' }}>{moment(filteredInvoice.dueAmountDate).format('DD/MM/YYYY')}</td>
        <td style={{ fontSize: '14px', padding: '8px', textAlign: 'center' }}>{filteredInvoice.dueAmount}</td>
        <td>
          <button
            className="btn btn-sm btn-icon btn-success"
            style={{ textAlign: 'center' }}
            onClick={() => handleWhatsAppClick(filteredInvoice)}
          >
            <span className="btn-inner">
              <svg fill="none" xmlns="http://www.w3.org/2000/svg" class="icon-32" width="32" height="32" viewBox="0 0 24 24"><path fill-rule="evenodd" clip-rule="evenodd" d="M19.0714 19.0699C16.0152 22.1263 11.4898 22.7867 7.78642 21.074C7.23971 20.8539 6.79148 20.676 6.36537 20.676C5.17849 20.683 3.70117 21.8339 2.93336 21.067C2.16555 20.2991 3.31726 18.8206 3.31726 17.6266C3.31726 17.2004 3.14642 16.7602 2.92632 16.2124C1.21283 12.5096 1.87411 7.98269 4.93026 4.92721C8.8316 1.02443 15.17 1.02443 19.0714 4.9262C22.9797 8.83501 22.9727 15.1681 19.0714 19.0699Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M15.9393 12.4131H15.9483" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M11.9306 12.4131H11.9396" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M7.92128 12.4131H7.93028" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
            </span>
          </button>
        </td>
      </tr>
    ));

  // Pagination buttons
  const paginationButtons = Array.from({ length: totalPages }, (_, index) => (
    <button
      style={{ padding: '6px 14px', marginRight: '3px', borderRadius: '50%' }}
      key={index}
      onClick={() => handlePageChange(index + 1)}
      className={`btn ${currentPage === index + 1 ? 'btn-primary' : 'btn-secondary'}`}
    >
      {index + 1}
    </button>
  ));

  //Expense
  const [expense, setExpense] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get('/expense/get');
        setExpense(response.data.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast.error('Error fetching user data');
      }
    };

    fetchData();
  }, []);

  // Calculate sums
  const totalCostAmount = expense.reduce((sum, expense) => sum + parseFloat(expense.expenseAmount), 0);

  const adminName = adminData?.full_name || 'Admin';
  const totalLead = dashboardData?.totalLeads || '0';

  return (
    <Fragment>
      <div className='margintop'>
        <Col sm="12">
          <Row>
            <Col className='col-md-5 col-12' >
              <Card style={{ padding: '20px', boxShadow: '2px 2px 10px #d2e5ff', backgroundColor: '#c8dbff' }}>
                <Row>
                  <div className='col-8'>
                    <h4 style={{ color: '#367BFF' }}> Hi, Welcome Back </h4>
                    <h2 style={{ textTransform: 'capitalize' }}>{adminName}</h2>
                  </div>
                  <div className='col-4'>
                    <div className='img-admin'>
                      <img src={imgadmin} alt='' className='img-fluid' />
                    </div>
                  </div>
                </Row>
              </Card>
            </Col>
            <Col className='col-md-4 col-12' >
              <Card style={{ padding: '20px', boxShadow: '2px 2px 10px #d2e5ff', backgroundColor: '#007bff' }}>
                <Row>
                  <div className='col-4 pl-0'>
                    <div>
                      <CurrencyRupeeIcon style={{ fontSize: '84px', color: '#fff' }} />
                    </div>
                  </div>
                  <div className='col-6'>
                    <span class="count-numbers">₹{totalAmount}/-</span>
                    <span class="count-name">Total Income</span>
                  </div>
                </Row>
              </Card>
            </Col>
            <Col className='col-md-3 col-12' >
              <Card style={{ padding: '20px', boxShadow: '2px 2px 10px #d2e5ff', backgroundColor: '#26c6da' }}>
                <Row>
                  <div className='col-4 pl-0'>
                    <div>
                      <AttachMoneyIcon style={{ fontSize: '84px', color: '#fff' }} />
                    </div>
                  </div>
                  <div className='col-6'>
                    <span class="count-numbers">₹{totalCostAmount}/-</span>
                    <span class="count-name">Total Cost</span>
                  </div>
                </Row>
              </Card>
            </Col>
          </Row>
        </Col>
        <Col sm="12">
          <Row>
            <Col className='col-md-4 col-12' >
              <Card style={{ padding: '20px', boxShadow: '2px 2px 10px #d2e5ff', }}>
                <Row>
                  <div className='col-4 pl-0'>
                    <div>
                      <AttachMoneyIcon style={{ fontSize: '84px', color: 'green' }} />
                    </div>
                  </div>
                  <div className='col-6'>
                    <span class="count-numbers2">₹{totalDueAmount}/-</span>
                    <span class="count-name" style={{ opacity: '.8', color: '#007bff' }}>Total Due Amount</span>
                  </div>

                </Row>
              </Card>
            </Col>
            <Col className='col-md-4 col-12' >
              <Card style={{ padding: '20px', boxShadow: '2px 2px 10px #d2e5ff', }}>
                <Row>
                  <div className='col-4 pl-0'>
                    <div>
                      <AccountBalanceWalletIcon style={{ fontSize: '84px', color: '#b650ff' }} />
                    </div>
                  </div>
                  <div className='col-6'>
                    <span class="count-numbers2">₹{totalPaidAmount}/-</span>
                    <span class="count-name" style={{ opacity: '.8', color: '#007bff' }}>Paid Amount</span>
                  </div>

                </Row>
              </Card>
            </Col>
            <Col className='col-md-34col-12' >
              <Card style={{ padding: '20px', boxShadow: '2px 2px 10px #d2e5ff', }}>
                <Row>
                  <div className='col-4 pl-0'>
                    <div>
                      <PeopleAltIcon style={{ fontSize: '84px', color: '#478aff' }} />
                    </div>
                  </div>
                  <div className='col-6'>
                    <span class="count-numbers2">{totalLead}</span>
                    <span className="count-name " style={{ opacity: '.8', color: '#007bff' }}>Total Leads<p style={{ fontSize: '12px', marginLeft: '45px', color: ' #000' }}>Per
                      Month</p>
                    </span>
                  </div>

                </Row>
              </Card>
            </Col>
          </Row>
        </Col>
         <Col sm="12">
          <Row>
            <Col className='col-md-7 col-12' >
              <Card style={{ padding: '20px', boxShadow: '5px 5px 30px #d2e5ff', }}>
                <Card.Header className=" pt-0 px-0">
                  <div className="header-title d-block d-md-none mb-3">
                    <h4 className="card-title">Due Amount</h4>
                  </div>
                  <div className="d-flex justify-content-between">

                    <div className="header-title d-none d-md-block">
                      <h4 className="card-title">Due Amount</h4>
                    </div>
                    <div className="header-title">
                      <TextField
                        placeholder="Search"
                        id="outlined-size-small"
                        size="small"
                        style={{ marginRight: '10px', width: '180px' }}
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
                            onChange={(item) => setState([item.selection])}
                            moveRangeOnFirstSelection={false}
                            ranges={state}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </Card.Header>
                <Card.Body className="px-0" style={{ position: 'relative' }}>
                  <div className="table-responsive">
                    <table
                      id="order-list-table"
                      className="table table-striped"
                      role="grid"
                      data-toggle="data-table"
                    >
                      <thead>
                        <tr className="ligth">
                          <th style={{ fontSize: '14px', padding: '8px' }}>No.</th>
                          <th style={{ fontSize: '14px', padding: '8px' }}>User Name</th>
                          <th style={{ fontSize: '14px', padding: '8px' }}>Product Name</th>
                          <th style={{ fontSize: '14px', padding: '8px' }}>Purchase Date</th>
                          <th style={{ fontSize: '14px', padding: '8px' }}>Due Amount</th>
                          <th style={{ fontSize: '14px', padding: '8px' }}>Action</th>
                        </tr>
                      </thead>
                      <tbody>{displayFilteredInvoices}</tbody>
                    </table>
                    <div className="pagination-container d-flex pb-3 justify-content-end">
                      {paginationButtons}
                    </div>
                  </div>
                </Card.Body>
              </Card >
            </Col >
            <Col className='col-md-5 col-12' >
              <Card style={{ padding: '20px', boxShadow: '2px 2px 10px #d2e5ff', }}>
                <Card.Header className="d-flex justify-content-between pt-0 px-0">
                  <div className="header-title">
                    <h5 className="card-title" style={{ backgroundColor: '#f5e7ff', padding: '5px 10px', borderLeft: '4px solid #00acf0' }}>Total User Chart</h5>
                  </div>
                </Card.Header>
                <div className='col-12'>
                  <Chart
                    options={chart1.options}
                    series={chart1.series}
                    type="area"
                    height="250"
                  />
                </div>
                <div class="row">
                  <div class="col-md-4 mt-2">
                    <select id="dataDropdown" style={{ borderRadius: '5px', border: '3px solid #c676ff', fontSize: '15px', fontWeight: '600' }} onchange="toggleData()">
                      <option value="expenseData" style={{}}>Expense Data</option>
                      <option value="invoiceData">Invoice Data</option>
                    </select>
                  </div>
                  <div class="col-md-6 mt-2">
                    <h6 class="" id="totalAmount"></h6>
                  </div>
                </div>
              </Card>
            </Col>
          </Row >
        </Col >
      </div >
      <ToastContainer />
    </Fragment >
  )
})

export default Index
