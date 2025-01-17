import React, { useRef, useState, useEffect } from "react";
import { Row, Col, Button } from "react-bootstrap";
import Card from "../../../components/Card";
import "./styles.css";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import SaveAsIcon from "@mui/icons-material/SaveAs";
import html2pdf from "html2pdf.js";
import { toast } from "react-toastify";
import axiosInstance from "../../../js/api";
import moment from "moment";
import { Form } from "react-bootstrap";
import dayjs from "dayjs";
import QRImg from "../../../assets/images/qr-code.png";

const CreateInvoice = () => {
  const [selectedUser, setSelectedUser] = useState("");
  const [userList, setUserList] = useState([]);
  const pdfContainerRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingOne, setLoadingOne] = useState(false);

  // Invoice Data Get
  const [invoiceData, setInvoiceData] = useState({
    invoice_number: "",
    date: "",
    name: "",
    email: "",
    mobile: "",
    branch_name: "",
    address: "",
    item_name: "",
    payment_method: "",
    net_amount: "",
    paid_amount: "",
    note: "",
    due_date: "",
  });

  const [invoicePDFData, setInvoicePDFData] = useState({
    user_id: null,
    invoice_number: null,
    date: null,
    name: null,
    email: null,
    mobile: null,
    branch_name: null,
    address: null,
    item_name: null,
    payment_method: null,
    net_amount: null,
    paid_amount: null,
    note: null,
    due_date: null,
  });

  const handleDownloadPDF = () => {
    setLoadingOne(true);
    const element = pdfContainerRef.current;
    if (element) {
      const options = {
        margin: 10,
        filename: "download.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 4, useCORS: true },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      };
      html2pdf(element, options);
      setLoadingOne(false);
    } else {
      toast.error("Error generating PDF. Please try again.");
    }
  };

  useEffect(() => {
    setLoadingOne(true);
    const fetchExpenses = async () => {
      try {
        const response = await axiosInstance.get("/invoice/get");
        if (response.data && response.data.data.length > 0) {
          const allData = response.data.data;
          const sortedExpenses = allData[allData.length - 1];

          setInvoiceData((prevData) => ({
            ...prevData,
            invoice_number: parseInt(sortedExpenses.invoice_number) + 1,
          }));
        }
      } catch (error) {
        console.error("Error fetching Invoice:", error);
      }
    };
    setLoadingOne(false);
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
    const net_amount = parseFloat(invoiceData.net_amount) || 0;
    const paid_amount = parseFloat(invoiceData.paid_amount) || 0;

    return (net_amount - paid_amount).toFixed(0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      setLoadingOne(true);
      const payload = {
        ...invoiceData,
        net_amount: parseInt(invoiceData.net_amount),
        paid_amount: parseInt(invoiceData.paid_amount),
        date: dayjs(invoiceData.date).format("YYYY/MM/DD"),
        due_date: dayjs(invoiceData.due_date).format("YYYY/MM/DD"),
      };

      const response = await axiosInstance.post("/invoice/create", payload);  
      setLoadingOne(false);
      setInvoiceData({
        user_id: "",
        invoice_number: "",
        date: "",
        name: "",
        email: "",
        mobile: "",
        address: "",
        item_name: "",
        payment_method: "",
        net_amount: "",
        paid_amount: "",
        note: "",
        due_date: "",
      });

      if (response.data && response.data.message === "success") {
        const invoice = response.data.data;
        setInvoicePDFData((prevData) => ({
          ...prevData,
          invoice_number: invoice.invoice_number,
          date: invoice.date,
          name: invoice.name,
          email: invoice.email,
          mobile: invoice.mobile,
          //  branch_name: invoice.branch_name,
          address: invoice.address,
          item_name: invoice.item_name,
          payment_method: invoice.payment_method,
          net_amount: invoice.net_amount,
          paid_amount: invoice.paid_amount,
          note: invoice.note,
          due_date: invoice.due_date,
        }));

        toast.success("Invoice added successfully!");
        setIsSubmitting(false);
      } else {
        // Fetch the newly created invoice data
        const newInvoiceResponse = await axiosInstance.get(
          `/invoice/get?id=${response.data.data._id}`
        );
        const newInvoice = newInvoiceResponse.data.data[0];
        setInvoicePDFData((prevData) => ({
          ...prevData,
          invoice_number: newInvoice.invoice_number,
          date: newInvoice.date,
          name: newInvoice.name,
          email: newInvoice.email,
          mobile: newInvoice.mobile,
          branch_name: newInvoice.branch_name,
          address: newInvoice.address,
          item_name: newInvoice.item_name,
          payment_method: newInvoice.payment_method,
          net_amount: newInvoice.net_amount,
          paid_amount: newInvoice.paid_amount,
          note: newInvoice.note,
          due_date: newInvoice.due_date,
        }));

        e.target.reset();
        toast.success("Invoice added successfully!");
      }

    } catch (error) {
      setIsSubmitting(false);
      console.error("Error creating Invoice:", error);
    }
  };

  const handleUserChange = async (e) => {
    const selectedUserId = e.target.value;
    setSelectedUser(selectedUserId);

    try {
      const userResponse = await axiosInstance.get(
        `/user/get?id=${selectedUserId}`
      );
      const selectedUser = userResponse.data.data[0];

      setInvoiceData((prevData) => ({
        ...prevData,
        name: `${selectedUser.first_name} ${selectedUser.last_name}`,
        email: selectedUser.email,
        mobile: selectedUser.contactNumber,
        address: selectedUser.address,
      }));
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    // Fetch user data when the component mounts
    const fetchUserData = async () => {
      try {
        setLoadingOne(true);
        const response = await axiosInstance.get("/user/get");
        setUserList(response.data.data);
        setLoadingOne(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  //Company Details Get
  const [formData, setFormData] = useState({
    company_id: null,
    companyName: "",
    companyAddress: "",
    companyMobile: "",
    companyEmail: "",
    companyGST: "",
    companyLogoUrl: "",
    companyThemeColor: "",
  });

  return (
    <>
      {loadingOne && (
        <div className="loader-background">
          <div className="spinner-box">
            <div className="three-quarter-spinner"></div>
          </div>
        </div>
      )}
      <div className="margintop">
        <Row>
          <Col xl="12" lg="12">
            <Card>
              <Card.Header className="d-md-flex justify-content-between">
                <div className="header-title">
                  <h3 className="card-title">Create Invoice</h3>
                </div>
              </Card.Header>
              <Card.Body>
                <div className="d-md-flex">
                  <Col className="col-md-6">
                    <div className="new-user-info">
                      {/* <form onSubmit={handleSubmit}> */}
                      <div className="row mb-3">
                        <div className="col-md-6 mb-2">
                          <div className="form-outline">
                            <label
                              className="form-label"
                              htmlFor="txt_InvoiceN"
                            >
                              Invoice Number :
                            </label>
                            <input
                              type="text"
                              name="invoice_number"
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
                            <label className="form-label" htmlFor="date">
                              Date :
                            </label>
                            <input
                              type="date"
                              name="date"
                              required
                              id="date"
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
                              <Form.Label htmlFor="userList">
                                Full Name :-
                              </Form.Label>
                              <input
                                type="text"
                                name="name"
                                required
                                id="name"
                                placeholder="Enter Full Name"
                                className="form-control"
                                value={invoiceData.name}
                                onChange={handleChange}
                              />
                            </Form.Group>
                          </div>
                        </div>
                        {/* <div className="col-md-6 mb-2">
                          <div className="form-outline">
                            <label className="form-label" htmlFor="branch_name">
                              Branch Name :
                            </label>
                            <select
                              id="branch_name"
                              required
                              className="form-control"
                              name="branch_name"
                              value={invoiceData.branch_name}
                              onChange={handleChange}
                            >
                              <option hidden="">Select Method</option>
                              <option value="Adajan">Adajan</option>
                              <option value="Katargam">Katargam</option>
                            </select>
                          </div>
                        </div> */}
                        <div className="col-md-12 mb-2">
                          <div className="form-outline">
                            <label className="form-label" htmlFor="address">
                              Address :
                            </label>
                            <input
                              type="text"
                              required
                              name="address"
                              placeholder="Enter Address"
                              id="address"
                              className="form-control"
                              value={invoiceData.address}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                        <div className="col-md-6 mb-2">
                          <div className="form-outline">
                            <label className="form-label" htmlFor="mobile">
                              Phone No. :
                            </label>
                            <input
                              type="tel"
                              required
                              placeholder="Enter Phone No."
                              id="mobile"
                              name="mobile"
                              className="form-control"
                              value={invoiceData.mobile}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                        <div className="col-md-6 mb-2">
                          <div className="form-outline">
                            <label className="form-label" htmlFor="email">
                              Email :
                            </label>
                            <input
                              type="email"
                              required
                              placeholder="Enter Email"
                              id="email"
                              name="email"
                              className="form-control"
                              value={invoiceData.email}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                        <div className="col-md-12 mb-2">
                          <div className="form-outline">
                            <label className="form-label" htmlFor="item_name">
                              Service Name :
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="Enter Service Name"
                              id="item_name"
                              className="form-control"
                              name="item_name"
                              value={invoiceData.item_name}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                        <div className="col-md-6 mb-2">
                          <div className="form-outline">
                            <label
                              className="form-label"
                              htmlFor="payment_method"
                            >
                              Payment Method :
                            </label>
                            <select
                              id="payment_method"
                              required
                              className="form-control"
                              name="payment_method"
                              value={invoiceData.payment_method}
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
                              <option value="Bank Application Pay">
                                Bank Application Pay
                              </option>
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
                            <Form.Label htmlFor="net_amount">
                              Total Payment:
                            </Form.Label>
                            <Form.Control
                              type="number"
                              id="net_amount"
                              value={invoiceData.net_amount}
                              onChange={handleChange}
                              placeholder="Enter Total Payment"
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label htmlFor="paid_amount">
                              Paid Payment:
                            </Form.Label>
                            <Form.Control
                              type="number"
                              id="paid_amount"
                              value={invoiceData.paid_amount}
                              onChange={handleChange}
                              placeholder="Enter Paid Payment"
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label htmlFor="dueAmount">
                              Due Amount:
                            </Form.Label>
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
                            <label className="form-label" htmlFor="note">
                              Notes :
                            </label>
                            <textarea
                              className="form-control"
                              required
                              placeholder="Enter Notes"
                              id="note"
                              name="note"
                              rows="2"
                              value={invoiceData.note}
                              onChange={handleChange}
                            ></textarea>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-outline">
                            <label className="form-label" htmlFor="date">
                              Due Date :
                            </label>
                            <input
                              type="date"
                              name="due_date"
                              required
                              id="due_date"
                              placeholder="Enter Due Date"
                              className="form-control"
                              value={
                                invoiceData.due_date
                                  ? dayjs(invoiceData.due_date).format(
                                    "YYYY-MM-DD"
                                  )
                                  : "-"
                              }
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                      </div>
                      <button
                        type="submit"
                        className={`btn btn-primary btn-block mb-4 w-100 ${isSubmitting ? "disabled" : ""
                          }`}
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                      >
                        {isSubmitting
                          ? "Please wait, creating invoice..."
                          : "Create Invoice"}
                      </button>
                      {/* </form> */}
                    </div>
                  </Col>
                  <Col className="ml-lg-20 col-md-6">
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
                              {/* {invoiceData.branch_name === "Adajan" ? (
                                <>
                                  <div class="col-8">
                                    <h5>
                                      <b>SlimFit</b>
                                    </h5>
                                    <p
                                      style={{ fontSize: "13px" }}
                                      class="mt-1"
                                    >
                                      18 la Victoria near galaxy circle pal
                                      adajan Surat
                                    </p>
                                    <p style={{ fontSize: "13px" }}>
                                      Phone no.:
                                      <strong>+91 88492 06154</strong>
                                    </p>
                                    <p style={{ fontSize: "13px" }}>
                                      Email:
                                      <strong>vslimfit22@gmail.com</strong>
                                    </p>
                                  </div>
                                  <div className="col-4">
                                    <div>
                                      <img
                                        alt=""
                                        src="/static/media/slimfit-logo.194c6d905629b8e298ba.png"
                                        width={"100%"}
                                      />
                                    </div>
                                  </div>
                                </>
                              ) : invoiceData.branch_name === "Katargam" ? (
                                <>
                                  <div class="col-8">
                                    <h5>
                                      <b>FG Group</b>
                                    </h5>
                                    <p
                                      style={{ fontSize: "13px" }}
                                      class="mt-1"
                                    >
                                      18 la Victoria near galaxy circle pal
                                      adajan Surat
                                    </p>
                                    <p style={{ fontSize: "13px" }}>
                                      Phone no.:
                                      <strong>+91 88492 06154</strong>
                                    </p>
                                    <p style={{ fontSize: "13px" }}>
                                      Email:
                                      <strong>vslimfit22@gmail.com</strong>
                                    </p>
                                  </div>
                                  <div className="col-4">
                                    <div>
                                      <img
                                        alt=""
                                        src="/static/media/slimfit-logo.194c6d905629b8e298ba.png"
                                        width={"100%"}
                                      />
                                    </div>
                                  </div>
                                </>
                              ) : (
                                <>
                                  <div class="col-8">
                                    <h5>
                                      <b>Company Name</b>
                                    </h5>
                                    <p
                                      style={{ fontSize: "13px" }}
                                      class="mt-1"
                                    >
                                      Address
                                    </p>
                                    <p style={{ fontSize: "13px" }}>
                                      Phone no.:
                                    </p>
                                    <p style={{ fontSize: "13px" }}>Email:</p>
                                  </div>
                                  <div className="col-4">
                                    <div>
                                      <img
                                        alt=""
                                        src="/static/media/slimfit-logo.194c6d905629b8e298ba.png"
                                        width={"100%"}
                                      />
                                    </div>
                                  </div>
                                </>
                              )} */}
                              <div class="col-8">
                                <h5>
                                  <b>SlimFit</b>
                                </h5>
                                <p style={{ fontSize: "13px" }} class="mt-1">
                                  18 la Victoria near galaxy circle pal adajan
                                  Surat
                                </p>
                                <p style={{ fontSize: "13px" }}>
                                  Phone no.:
                                  <strong>+91 88492 06154</strong>
                                </p>
                                <p style={{ fontSize: "13px" }}>
                                  Email:
                                  <strong>vslimfit22@gmail.com</strong>
                                </p>
                              </div>
                              <div className="col-4">
                                <div>
                                  <img
                                    alt=""
                                    src="/static/media/slimfit-logo.194c6d905629b8e298ba.png"
                                    width={"100%"}
                                  />
                                </div>
                              </div>
                            </>
                          ) : (
                            // Enter data if formData is not available
                            <>
                              <div class="col-8">
                                <h5>
                                  <b>Enter Company Name</b>
                                </h5>
                                <p style={{ fontSize: "13px" }} class="mt-1">
                                  Enter Company Address
                                </p>
                                <p style={{ fontSize: "13px" }}>
                                  Phone no.:
                                  <strong>Enter Phone</strong>
                                </p>
                                <p style={{ fontSize: "13px" }}>
                                  Email:
                                  <strong>Enter Email</strong>
                                </p>
                                <p style={{ fontSize: "13px" }}>
                                  GSTIN:
                                  <strong>Enter GSTIN</strong>
                                </p>
                              </div>
                              <div className="col-4">
                                <div>
                                  <img
                                    alt=""
                                    src="Enter-logo-url.jpg"
                                    width={"100%"}
                                  />
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                        <Row className="border mx-0">
                          <div class="col-5 border px-0">
                            <div class="invoice-details ">
                              <div class="bill-to px-2">Bill To :-</div>
                              <strong>
                                <p
                                  class="mt-2 px-2"
                                  style={{ fontSize: "14px" }}
                                >
                                  {invoicePDFData.name !== null
                                    ? invoicePDFData.name
                                    : "Enter Full Name"}
                                </p>
                              </strong>
                              <strong>
                                <p class="px-2" style={{ fontSize: "14px" }}>
                                  {invoicePDFData.email !== null
                                    ? invoicePDFData.email
                                    : "Enter Email"}
                                </p>
                              </strong>
                            </div>
                          </div>
                          <div class="col-6 text-right">
                            <div class="bill-name-date px-2">
                              <p>
                                <strong>Invoice No. :</strong>
                                <span>
                                  {invoicePDFData.invoice_number !== null
                                    ? invoicePDFData.invoice_number
                                    : "-"}
                                </span>
                              </p>
                              <p class="">
                                <strong>Date :-</strong>
                                <span>
                                  {invoicePDFData.date !== null
                                    ? dayjs(invoicePDFData.date).format(
                                      "DD-MM-YYYY"
                                    )
                                    : "-/-/-"}
                                </span>
                              </p>
                              <p class="">
                                <strong>Phone No. :-</strong>
                                <span>
                                  {invoicePDFData.mobile !== null
                                    ? invoicePDFData.mobile
                                    : "-"}
                                </span>
                              </p>
                              <p class="">
                                <strong>Address :-</strong>
                                <span>
                                  {invoicePDFData.address !== null
                                    ? invoicePDFData.address
                                    : "Enter Invoice Address"}
                                </span>
                              </p>
                            </div>
                          </div>
                        </Row>
                        <div className="invoice-items d-flex">
                          <div className="col-6 border px-0">
                            <div className="bill-to px-2">Services :-</div>
                            <div className="bill-name-date px-2">
                              <p>
                                <span className="inv-paid">
                                  {" "}
                                  {invoicePDFData.item_name !== null
                                    ? invoicePDFData.item_name
                                    : "Enter Service Name"}
                                </span>
                              </p>
                            </div>
                          </div>
                          <div className="col-6 border px-0">
                            <div className="bill-to px-2">Amount :-</div>
                            <div className="bill-name-date px-2">
                              <p>
                                <strong>Paid Amount :-</strong>
                                <span className="inv-paid">
                                  {" "}
                                  {invoicePDFData.paid_amount !== null
                                    ? invoicePDFData.paid_amount
                                    : "-"}
                                </span>
                              </p>
                              <p class="">
                                <strong>Due Amount :-</strong>
                                <span>
                                  {" "}
                                  {calculateDueAmount() !== null
                                    ? calculateDueAmount()
                                    : "-"}
                                </span>
                              </p>
                              <p class="">
                                <strong>Total Amount :-</strong>
                                <span className="inv-total">
                                  {invoicePDFData.net_amount !== null
                                    ? invoicePDFData.net_amount
                                    : "-"}
                                </span>
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="invoice-details d-flex">
                          <div className="col-6 border px-0">
                            <div className="bill-to px-2">Note :-</div>
                            <p style={{ fontSize: "14px" }} className="px-2">
                              <b></b>{" "}
                              <span>
                                {invoicePDFData.note !== null
                                  ? invoicePDFData.note
                                  : "Enter Note"}
                              </span>
                            </p>
                          </div>
                          <div className="col-6 border px-0">
                            <div className="bill-to px-2">Due Date :-</div>
                            <p style={{ fontSize: "14px" }} className="px-2">
                              <b></b>{" "}
                              <span>
                                {invoicePDFData.due_date !== null
                                  ? dayjs(invoicePDFData.due_date).format(
                                    "DD-MM-YYYY"
                                  )
                                  : "-/-/-"}
                              </span>
                            </p>
                          </div>
                        </div>
                        <div className="invoice-details d-flex">
                          <div className="col-8 border px-0">
                            <div className="bill-to px-2">
                              Terms and Conditions :-
                            </div>
                            <div className="px-2">
                              <p style={{ fontSize: "13px" }} className="mt-1">
                                <strong>*</strong> Payment neither refundable
                                nor transferable.
                              </p>
                              <p style={{ fontSize: "13px" }}>
                                <strong>*</strong>
                                Failure in Paying your fee in the due time or
                                the allotted day can result in banning your
                                course.
                              </p>
                              <p style={{ fontSize: "13px" }}>
                                <strong>*</strong> In Case You Do Partial
                                Payment then Second installment you have to pay
                                in 15 Days
                              </p>
                              <p style={{ fontSize: "13px" }}>
                                <strong>*</strong>
                                Pausing the plan and asking for extension is
                                strictly prohibited.
                              </p>
                            </div>
                          </div>
                          <div className="col-4 border px-0">
                            <div className="bill-to px-2">QR :-</div>
                            <div className="d-flex w-100 justify-content-center align-items-center">
                              <img alt="" src={QRImg} width={"70%"} />
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
