import React, { useRef, useState, useEffect } from 'react';
import { Row, Col, Button, } from 'react-bootstrap';
import Card from '../../../components/Card';
import './styles.css'
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';
import SaveAsIcon from '@mui/icons-material/SaveAs';
import html2pdf from 'html2pdf.js';
import { toast } from 'react-toastify';
import axiosInstance from '../../../js/api';
import moment from 'moment';
import { Form } from 'react-bootstrap';


const CreateInvoice = () => {
   const [selectedUser, setSelectedUser] = useState('');
   const [userList, setUserList] = useState([]);
   const pdfContainerRef = useRef(null);
   const [isSubmitting, setIsSubmitting] = useState(false);

   // Invoice Data Get
   const [invoiceData, setInvoiceData] = useState({
      user_id: '',
      invoice_number: '',
      date: '',
      fullName: '',
      email: '',
      phoneNumber: '',
      invoiceAddress: '',
      productName: '',
      paymentMethod: '',
      totalPayment: '',
      paidPayment: '',
      invoiceNotes: '',
      dueAmount: '',
      dueAmountDate: '',
      membershipMonth: ''
   });

   const [invoicePDFData, setInvoicePDFData] = useState({
      user_id: null,
      invoice_number: null,
      date: null,
      fullName: null,
      email: null,
      phoneNumber: null,
      invoiceAddress: null,
      productName: null,
      paymentMethod: null,
      totalPayment: null,
      paidPayment: null,
      invoiceNotes: null,
      dueAmount: null,
      dueAmountDate: null,
      membershipMonth: null
   });

   const handleDownloadPDF = () => {
      const element = pdfContainerRef.current;

      if (element) {
         const options = {
            margin: 10,
            filename: 'download.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 4, useCORS: true },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
         };

         html2pdf(element, options);
      } else {
         toast.error('Error generating PDF. Please try again.');
      }
   };

   useEffect(() => {
      const fetchExpenses = async () => {
         try {
            const response = await axiosInstance.get('/invoice/get');
            if (response.data && response.data.data.length > 0) {
               const allData = response.data.data
               const sortedExpenses = allData[allData.length - 1]

               setInvoiceData((prevData) => ({
                  ...prevData,
                  invoice_number: parseInt(sortedExpenses.invoice_number) + 1,
               }));
            }
         } catch (error) {
            console.error('Error fetching Invoice:', error);
            toast.error('Error fetching Invoice');
         }
      };

      fetchExpenses();
   }, []);

   const handleChange = (e) => {
      const { id, value } = e.target;

      setInvoiceData((prevData) => ({
         ...prevData,
         [id]: value,
      }));
   };

   const calculateDueAmount = () => {
      const totalPayment = parseFloat(invoiceData.totalPayment) || 0;
      const paidPayment = parseFloat(invoiceData.paidPayment) || 0;

      return (totalPayment - paidPayment).toFixed(0);
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      setIsSubmitting(true);
      const dueAmount = calculateDueAmount();
      try {
         const response = await axiosInstance.post('/invoice/create', {
            ...invoiceData,
            user_id: selectedUser,
            dueAmount: dueAmount
         });

         if (response.data && response.data.message === "success") {
            const invoice = response.data.data;
            setInvoicePDFData((prevData) => ({
               ...prevData,
               invoice_number: invoice.invoice_number,
               date: invoice.date,
               fullName: invoice.fullName,
               email: invoice.email,
               phoneNumber: invoice.phoneNumber,
               invoiceAddress: invoice.invoiceAddress,
               productName: invoice.productName,
               paymentMethod: invoice.paymentMethod,
               totalPayment: invoice.totalPayment,
               paidPayment: invoice.paidPayment,
               invoiceNotes: invoice.invoiceNotes,
               dueAmount: invoice.dueAmount,
               dueAmountDate: moment(invoice.dueAmountDate).format('DD/MM/YYYY'),
               membershipMonth: invoice.membershipMonth
            }));

            setInvoiceData({
               user_id: '',
               invoice_number: '',
               date: '',
               fullName: '',
               email: '',
               phoneNumber: '',
               invoiceAddress: '',
               productName: '',
               paymentMethod: '',
               totalPayment: '',
               paidPayment: '',
               invoiceNotes: '',
               dueAmount: '',
               dueAmountDate: '',
               membershipMonth: ''
            })

            toast.success('Invoice added successfully!');
            setIsSubmitting(false);
         } else {
            // Fetch the newly created invoice data
            const newInvoiceResponse = await axiosInstance.get(`/invoice/get?id=${response.data.data._id}`);
            const newInvoice = newInvoiceResponse.data.data[0];
            setInvoicePDFData((prevData) => ({
               ...prevData,
               invoice_number: newInvoice.invoice_number,
               date: newInvoice.date,
               fullName: newInvoice.fullName,
               email: newInvoice.email,
               phoneNumber: newInvoice.phoneNumber,
               invoiceAddress: newInvoice.invoiceAddress,
               productName: newInvoice.productName,
               paymentMethod: newInvoice.paymentMethod,
               totalPayment: newInvoice.totalPayment,
               paidPayment: newInvoice.paidPayment,
               invoiceNotes: newInvoice.invoiceNotes,
               dueAmount: newInvoice.dueAmount,
               dueAmountDate: moment(newInvoice.dueAmountDate).format('DD/MM/YYYY'),
               membershipMonth: newInvoice.membershipMonth
            }));

            e.target.reset();
            toast.success('Invoice added successfully!');
         }
      } catch (error) {
         setIsSubmitting(false);
         console.error('Error creating Invoice:', error);
         toast.error('Error creating Invoice. Please try again.');
      }
   };

   const handleUserChange = async (e) => {
      const selectedUserId = e.target.value;
      setSelectedUser(selectedUserId);

      try {
         const userResponse = await axiosInstance.get(`/user/get?id=${selectedUserId}`);
         const selectedUser = userResponse.data.data[0];

         setInvoiceData((prevData) => ({
            ...prevData,
            fullName: `${selectedUser.first_name} ${selectedUser.last_name}`,
            email: selectedUser.email,
            phoneNumber: selectedUser.contactNumber,
            invoiceAddress: selectedUser.address,
         }));

      } catch (error) {
         console.error('Error fetching user data:', error);
         toast.error('Error fetching user data');
      }
   };

   useEffect(() => {
      // Fetch user data when the component mounts
      const fetchUserData = async () => {
         try {
            const response = await axiosInstance.get('/user/get');
            setUserList(response.data.data);
         } catch (error) {
            console.error('Error fetching user data:', error);
            toast.error('Error fetching user data');
         }
      };

      fetchUserData();
   }, []);

   //Company Details Get
   const [formData, setFormData] = useState({
      company_id: null,
      companyName: '',
      companyAddress: '',
      companyMobile: '',
      companyEmail: '',
      companyGST: '',
      companyLogoUrl: '',
      companyThemeColor: '',
   });

   useEffect(() => {
      const fetchData = async () => {
         try {
            const companyResponse = await axiosInstance.get('/company/get');

            if (companyResponse.data.data.length > 0) {
               const companyData = companyResponse.data.data[0];
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
               }));
            }
         } catch (error) {
            console.error('Error fetching admin details:', error);
            toast.error('Error fetching admin details');
         }
      };

      fetchData();
   }, []);

   return (
      <>
         <div className='margintop'>
            <Row>
               <Col xl="12" lg="12">
                  <Card>
                     <Card.Header className="d-md-flex justify-content-between">
                        <div className="header-title">
                           <h3 className="card-title">Create Invoice</h3>
                        </div>
                        <div className="header-title">
                           <Link
                              className="btn btn-btn btn-success px-3 mb-lg-0 mb-2 mr-10 "
                              to="/dashboard/admin-profile" style={{ fontWeight: '600', }}
                           >
                              <SaveAsIcon /> Changes Details
                           </Link>
                        </div>
                     </Card.Header>
                     <Card.Body>
                        <div className='d-md-flex'>
                           <Col className='col-md-6'>
                              <div className="new-user-info">
                                 <form onSubmit={handleSubmit}>
                                    <div className="row mb-3">
                                       <div className="col-md-6 mb-2">
                                          <div className="form-outline">
                                             <label className="form-label" htmlFor="txt_InvoiceN">Invoice Number :</label>
                                             <input
                                                type="text"
                                                name='invoice_number'
                                                required
                                                placeholder="Enter Invoice Number"
                                                id="invoice_number"
                                                className="form-control"
                                                value={invoiceData.invoice_number}
                                                onChange={handleChange}
                                             />
                                          </div>
                                       </div>
                                       <div className="col-md-6">
                                          <div className="form-outline">
                                             <label className="form-label" htmlFor="date">Date :</label>
                                             <input
                                                type="date"
                                                name='date'
                                                required
                                                id='date'
                                                placeholder="Enter Date"
                                                className="form-control"
                                                value={invoiceData.date}
                                                onChange={handleChange}
                                             />
                                          </div>
                                       </div>
                                       <div className="col-md-12">
                                          <div className="form-outline">
                                             <Form.Group className="mb-3 col-md-12">
                                                <Form.Label htmlFor="userList">Full Name :-</Form.Label>
                                                <Form.Select id="userList" onChange={handleUserChange}>
                                                   <option value="" hidden>Select User</option>
                                                   {userList.map((user) => (
                                                      <option key={user._id} value={user._id}>
                                                         {user.first_name + ' ' + user.last_name}
                                                      </option>
                                                   ))}
                                                </Form.Select>
                                             </Form.Group>
                                          </div>
                                       </div>
                                       <div className="col-md-12 mb-2">
                                          <div className="form-outline">
                                             <label className="form-label" htmlFor="invoiceAddress">Address :</label>
                                             <input
                                                type="text"
                                                required
                                                name='invoiceAddress'
                                                placeholder="Enter Address"
                                                id="invoiceAddress"
                                                className="form-control"
                                                value={invoiceData.invoiceAddress}
                                                onChange={handleChange}
                                             />
                                          </div>
                                       </div>
                                       <div className="col-md-6 mb-2">
                                          <div className="form-outline">
                                             <label className="form-label" htmlFor="phoneNumber">Phone No. :</label>
                                             <input
                                                type="tel"
                                                required
                                                placeholder="Enter Phone No."
                                                id="phoneNumber"
                                                name='phoneNumber'
                                                className="form-control"
                                                value={invoiceData.phoneNumber}
                                                onChange={handleChange}
                                             />
                                          </div>
                                       </div>
                                       <div className="col-md-6 mb-2">
                                          <div className="form-outline">
                                             <label className="form-label" htmlFor="email">Email :</label>
                                             <input
                                                type="email"
                                                required
                                                placeholder="Enter Email"
                                                id="email"
                                                name='email'
                                                className="form-control"
                                                value={invoiceData.email}
                                                onChange={handleChange}
                                             />
                                          </div>
                                       </div>
                                       <div className="col-md-12 mb-2">
                                          <div className="form-outline">
                                             <label className="form-label" htmlFor="productName">Plan Name :</label>
                                             <input
                                                type="text"
                                                required
                                                placeholder="Enter Plan Name"
                                                id="productName"
                                                className="form-control"
                                                name='productName'
                                                value={invoiceData.productName}
                                                onChange={handleChange}
                                             />
                                          </div>
                                       </div>
                                       <div className="col-md-6 mb-2">
                                          <div className="form-outline">
                                             <label className="form-label" htmlFor="paymentMethod">Payment Method :</label>
                                             <select
                                                id="paymentMethod"
                                                required
                                                className="form-control"
                                                name='paymentMethod'
                                                value={invoiceData.paymentMethod}
                                                onChange={handleChange}
                                             >
                                                <option hidden="">Select Method</option>
                                                <option value="Google Pay">Google Pay</option>
                                                <option value="Phone Pay">Phone Pay</option>
                                                <option value="Bharat Pay">Bharat Pay</option>
                                                <option value="Paytm">Paytm</option>
                                                <option value="Freecharg">Freecharg</option>
                                                <option value="Amazon pay">Amazon pay</option>
                                                <option value="UPI ID Pay">UPI ID Pay</option>
                                                <option value="MobikWik">MobikWik</option>
                                                <option value="PayU">PayU</option>
                                                <option value="Cred">Cred</option>
                                                <option value="Paypal">Paypal</option>
                                                <option value="Bank Application Pay">Bank Application
                                                   Pay</option>
                                                <option value="Credit Card">Credit Card</option>
                                                <option value="Debit Card">Debit Card</option>
                                                <option value="RTGS">RTGS</option>
                                                <option value="NEFT">NEFT</option>
                                                <option value="Cheque">Cheque</option>
                                                <option value="Cash">Cash</option>
                                             </select>
                                          </div>
                                       </div>
                                       <Col md={6}>
                                          <Form.Group className="mb-3">
                                             <Form.Label htmlFor="totalPayment">Total Payment:</Form.Label>
                                             <Form.Control
                                                type="number"
                                                id="totalPayment"
                                                value={invoiceData.totalPayment}
                                                onChange={handleChange}
                                                placeholder="Enter Total Payment"
                                             />
                                          </Form.Group>
                                       </Col>
                                       <Col md={6}>
                                          <Form.Group className="mb-3">
                                             <Form.Label htmlFor="paidPayment">Paid Payment:</Form.Label>
                                             <Form.Control
                                                type="number"
                                                id="paidPayment"
                                                value={invoiceData.paidPayment}
                                                onChange={handleChange}
                                                placeholder="Enter Paid Payment"
                                             />
                                          </Form.Group>
                                       </Col>
                                       <Col md={6}>
                                          <Form.Group className="mb-3">
                                             <Form.Label htmlFor="dueAmount">Due Amount:</Form.Label>
                                             <Form.Control
                                                type="number"
                                                id="dueAmount"
                                                value={calculateDueAmount()}
                                                readOnly
                                             />
                                          </Form.Group>
                                       </Col>
                                       <div className="col-md-6 mb-2">
                                          <div className="form-outline">
                                             <label className="form-label" htmlFor="dueAmountDate">Due Date :</label>
                                             <input
                                                type="date"
                                                required
                                                id="dueAmountDate"
                                                className="form-control"
                                                name='dueAmountDate'
                                                value={invoiceData.dueAmountDate}
                                                onChange={handleChange}
                                             />
                                          </div>
                                       </div>
                                       <div className="col-md-6 mb-2">
                                          <div className="form-outline">
                                             <label className="form-label" htmlFor="invoiceNotes">Notes :</label>
                                             <textarea
                                                className="form-control"
                                                required
                                                placeholder="Enter Notes"
                                                id="invoiceNotes"
                                                name='invoiceNotes'
                                                rows="2"
                                                value={invoiceData.invoiceNotes}
                                                onChange={handleChange}
                                             ></textarea>
                                          </div>
                                       </div>
                                       <div className="col-md-12 mb-2">
                                          <div className="form-outline">
                                             <label className="form-label" htmlFor="membershipMonth">Membership Duration (in Month) : :</label>
                                             <input
                                                className="form-control"
                                                required
                                                placeholder="Enter Membership Duration (in Month)"
                                                id="membershipMonth"
                                                name='membershipMonth'
                                                rows="2"
                                                type='number'
                                                value={invoiceData.membershipMonth}
                                                onChange={handleChange}
                                             ></input>
                                          </div>
                                       </div>
                                    </div>
                                    <button type="submit" className={`btn btn-primary btn-block mb-4 w-100 ${isSubmitting ? 'disabled' : ''}`} disabled={isSubmitting}>
                                       {isSubmitting ? 'Please wait, creating invoice...' : 'Create Invoice'}
                                    </button>
                                 </form>
                              </div>
                           </Col>
                           <Col className='ml-lg-20 col-md-6'>
                              <div ref={pdfContainerRef}>
                                 <div className="">
                                    <div className="header-title text-center">
                                       <h4 className="card-title">Tax Invoice</h4>
                                    </div>
                                 </div>
                                 <div class="border">
                                    <div class="invoice-header row mt-10 p-3">
                                       {formData ? (
                                          <>
                                             <div class="col-8">
                                                <h5><b>{formData.companyName}</b></h5>
                                                <p style={{ fontSize: '13px' }} class="mt-1">{formData.companyAddress}</p>
                                                <p style={{ fontSize: '13px' }}>Phone no.:
                                                   <strong>{formData.companyMobile}</strong>
                                                </p>
                                                <p style={{ fontSize: '13px' }}>Email:
                                                   <strong>{formData.companyEmail}</strong>
                                                </p>
                                                <p style={{ fontSize: '13px' }}>GSTIN:
                                                   <strong>{formData.companyGST}</strong>
                                                </p>
                                             </div>
                                             <div className='col-4'>
                                                <div>
                                                   <img alt='' src={formData.companyLogoUrl} width={'90%'} />
                                                </div>
                                             </div>
                                          </>
                                       ) : (
                                          // Dummy data if formData is not available
                                          <>
                                             <div class="col-8">
                                                <h5><b>Dummy Company Name</b></h5>
                                                <p style={{ fontSize: '13px' }} class="mt-1">Dummy Company Address</p>
                                                <p style={{ fontSize: '13px' }}>Phone no.:
                                                   <strong>Dummy Phone</strong>
                                                </p>
                                                <p style={{ fontSize: '13px' }}>Email:
                                                   <strong>Dummy Email</strong>
                                                </p>
                                                <p style={{ fontSize: '13px' }}>GSTIN:
                                                   <strong>Dummy GSTIN</strong>
                                                </p>
                                             </div>
                                             <div className='col-4'>
                                                <div>
                                                   <img alt='' src="dummy-logo-url.jpg" width={'90%'} />
                                                </div>
                                             </div>
                                          </>
                                       )}
                                    </div>
                                    <Row className='border mx-0'>
                                       <div class="col-5 border px-0">
                                          <div class="invoice-details ">
                                             <div class="bill-to">Bill To</div>
                                             <strong>
                                                <p class="mt-2 ml-10" style={{ fontSize: '14px' }}>
                                                   {invoicePDFData.fullName !== null ? invoicePDFData.fullName : 'Dummy Full Name'}
                                                </p>
                                             </strong>
                                             <strong>
                                                <p class="px-2" style={{ fontSize: '14px' }}>
                                                   {invoicePDFData.email !== null ? invoicePDFData.email : 'Dummy Email'}
                                                </p>
                                             </strong>
                                          </div>
                                       </div>
                                       <div class="col-6 text-right">
                                          <div class="bill-name-date px-2">
                                             <p>
                                                <strong>Invoice No. :</strong>
                                                <span>{invoicePDFData.invoice_number !== null ? invoicePDFData.invoice_number : '001'}</span>
                                             </p>
                                             <p class="">
                                                <strong>Date :-</strong>
                                                <span>{invoicePDFData.date !== null ? invoicePDFData.date : '09/09/0009'}</span>
                                             </p>
                                             <p class="">
                                                <strong>Phone No. :-</strong>
                                                <span>{invoicePDFData.phoneNumber !== null ? invoicePDFData.phoneNumber : '122131212'}</span>
                                             </p>
                                             <p class="">
                                                <strong>Address :-</strong>
                                                <span>{invoicePDFData.invoiceAddress !== null ? invoicePDFData.invoiceAddress : 'Dummy Invoice Address'}</span>
                                             </p>
                                          </div>
                                       </div>
                                    </Row>
                                    <div className="invoice-items">
                                       <table>
                                          <thead>
                                             <tr>
                                                <th>Services</th>
                                                <th>Paid Amount</th>
                                                <th>Total Amount</th>
                                                <th>Membership Month</th>
                                             </tr>
                                          </thead>
                                          <tbody>
                                             <tr>
                                                <td>
                                                   <div>{invoicePDFData.productName !== null ? invoicePDFData.productName : 'Dummy Product Name'}</div>
                                                </td>
                                                <td>
                                                   <span>{invoicePDFData.paidPayment !== null ? invoicePDFData.paidPayment : '500'}</span>
                                                </td>
                                                <td>
                                                   <span>{invoicePDFData.totalPayment !== null ? invoicePDFData.totalPayment : '1500'}</span>
                                                </td>
                                                <td>
                                                   <span>{invoicePDFData.membershipMonth !== null ? invoicePDFData.membershipMonth : '1'} Month</span>
                                                </td>
                                             </tr>
                                          </tbody>
                                       </table>
                                    </div>
                                    <div className="invoice-details d-flex">
                                       <div className="col-6 border px-0">
                                          <div className="bill-to px-2">Description :-</div>
                                          <p style={{ fontSize: '16px' }} className="px-2">
                                             <b></b> <span>
                                                {invoicePDFData.dueAmount !== null && parseFloat(invoicePDFData.dueAmount) > 0 ?
                                                   `${invoicePDFData.dueAmount} pending and pay by this date ${invoicePDFData.dueAmountDate !== null ? invoicePDFData.dueAmountDate : '10/10/1010'}`
                                                   : 'No due pending'}
                                             </span>
                                          </p>
                                          {invoicePDFData.invoiceNotes !== null && (
                                             <p style={{ fontSize: '14px' }} className="px-2">
                                                <b></b> <span>{invoicePDFData.invoiceNotes}</span>
                                             </p>
                                          )}
                                       </div>
                                       <div className="col-6 border px-0">
                                          <div className="bill-to px-2">Amount :-</div>
                                          <div className="bill-name-date px-2">
                                             <p>
                                                <strong>Paid Amount :-</strong>
                                                <span className="inv-paid"> {invoicePDFData.paidPayment !== null ? invoicePDFData.paidPayment : '500'}</span>
                                             </p>
                                             <p class="">
                                                <strong>Due Amount :-</strong>
                                                <span> {invoicePDFData.dueAmount !== null ? invoicePDFData.dueAmount : '1000'}</span>
                                             </p>
                                             <p class="">
                                                <strong>Total Amount :-</strong>
                                                <span className="inv-total">{invoicePDFData.totalPayment !== null ? invoicePDFData.totalPayment : '1500'}</span>
                                             </p>
                                          </div>
                                       </div>
                                    </div>
                                    <div className="invoice-details d-flex">
                                       <div className="col-12 border px-0">
                                          <div className="bill-to px-2">Terms and Conditions :-</div>
                                          <div className="px-2">
                                             <p style={{ fontSize: '13px' }} className="mt-1">
                                                <strong>*</strong> Payment
                                                neither refundable nor transferable.
                                             </p>
                                             <p style={{ fontSize: '13px' }}><strong>*</strong>
                                                Failure in Paying your fee
                                                in the due time or the allotted day can result in
                                                banning your course.
                                             </p>
                                             <p style={{ fontSize: '13px' }}><strong>*</strong> In
                                                Case You Do Partial
                                                Payment then Second installment you have to pay in
                                                15 Days
                                             </p>
                                             <p style={{ fontSize: '13px' }}><strong>*</strong>
                                                Pausing the plan and asking
                                                for extension is strictly prohibited.
                                             </p>
                                          </div>
                                       </div>
                                    </div>
                                 </div>
                              </div>
                              <div className="header-title text-center mt-20">
                                 <Button
                                    className="btn btn-btn btn-success px-3"
                                    onClick={handleDownloadPDF}
                                 >
                                    Download PDF
                                 </Button>
                              </div>
                           </Col>
                        </div>
                     </Card.Body>
                  </Card>
               </Col>
            </Row>
         </div>
      </>
   );
};

export default CreateInvoice;