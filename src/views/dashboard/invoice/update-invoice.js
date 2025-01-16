import React, { useRef, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Row, Col, Button } from "react-bootstrap";
import Card from "../../../components/Card";
import "./styles.css";
import "react-toastify/dist/ReactToastify.css";
import html2pdf from "html2pdf.js";
import { toast } from "react-toastify";
import axiosInstance from "../../../js/api";
import * as dayjs from "dayjs";
import QRImg from "../../../assets/images/qr-code.png";

const CreateInvoice = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const invoice_id = searchParams.get("invoice_id");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Invoice Data Get
  const [invoiceData, setInvoiceData] = useState({
    id: "",
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
    id: null,
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

  const calculateDueAmount = () => {
    const net_amount = parseFloat(invoiceData.net_amount) || 0;
    const paid_amount = parseFloat(invoiceData.paid_amount) || 0;

    return (net_amount - paid_amount).toFixed(0);
  };

  const fetchInvoice = async () => {
    try {
      const response = await axiosInstance.get(`/invoice/get?id=${invoice_id}`);
      if (response.data && response.data.data.length > 0) {
        const allData = response.data.data[0];
        setInvoiceData((prevData) => ({
          ...prevData,
          id: allData._id,
          invoice_number: allData.invoice_number,
          date: allData.date,
          name: allData.name,
          email: allData.email,
          mobile: allData.mobile,
          branch_name: allData.branch_name,
          address: allData.address,
          item_name: allData.item_name,
          payment_method: allData.payment_method,
          net_amount: allData.net_amount,
          paid_amount: allData.paid_amount,
          note: allData.note,
          due_date: allData.due_date,
        }));

        setInvoicePDFData((prevData) => ({
          ...prevData,
          id: allData._id,
          invoice_number: allData.invoice_number,
          date: allData.date,
          name: allData.name,
          email: allData.email,
          mobile: allData.mobile,
          branch_name: allData.branch_name,
          address: allData.address,
          item_name: allData.item_name,
          payment_method: allData.payment_method,
          net_amount: allData.net_amount,
          paid_amount: allData.paid_amount,
          note: allData.note,
          due_date: allData.due_date,
        }));
      }
    } catch (error) {
      console.error("Error fetching Invoice:", error);
      toast.error("Error fetching Invoice");
    }
  };
  
  useEffect(() => {
    fetchInvoice();
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setInvoiceData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        ...invoiceData,
        net_amount: parseInt(invoiceData.net_amount),
        paid_amount: parseInt(invoiceData.paid_amount),
        date: dayjs(invoiceData.date).format("YYYY/MM/DD"),
        due_date: dayjs(invoiceData.due_date).format("YYYY/MM/DD"),
      };

      const response = await axiosInstance.post(`/invoice/update`, payload);
      if (response.data && !response.data.error) {
        toast.success("Invoice Updated successfully!");
        setIsSubmitting(false);
        fetchInvoice();
      } else {
        setIsSubmitting(false);
        toast.error(`Error Updating Invoice: ${response.data.error}`);
      }
    } catch (error) {
      setIsSubmitting(false);
      console.error("Error Updating Invoice:", error);
      toast.error("Error Updating Invoice. Please try again.");
    }
  };

  //PDF Download
  const pdfContainerRef = useRef(null);

  const handleDownloadPDF = () => {
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
    } else {
      toast.error("Error generating PDF. Please try again.");
    }
  };

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        // const companyResponse = await axiosInstance.get('/company/get');
        // if (companyResponse.data.data.length > 0) {
        //    const companyData = companyResponse.data.data[0];
        //    setFormData((prevData) => ({
        //       ...prevData,
        //       company_id: companyData._id,
        //       companyName: companyData.company_name,
        //       companyAddress: companyData.company_address,
        //       companyMobile: companyData.company_mobile,
        //       companyEmail: companyData.company_email,
        //       companyGST: companyData.company_gst,
        //       companyLogoUrl: companyData.company_logo_url,
        //       companyThemeColor: companyData.company_theme_color,
        //    }));
        // }
      } catch (error) {
        console.error("Error fetching admin details:", error);
        toast.error("Error fetching admin details");
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <div className="margintop">
        <Row>
          <Col xl="12" lg="12">
            <Card>
              <Card.Header className="d-md-flex justify-content-between">
                <div className="header-title">
                  <h3 className="card-title">Update Invoice</h3>
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
                              value={dayjs(invoiceData.date).format(
                                "YYYY-MM-DD"
                              )}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                        <div className="col-md-12 mb-2">
                          <div className="form-outline">
                            <label className="form-label" htmlFor="name">
                              Full Name :
                            </label>
                            <input
                              type="text"
                              required
                              name="name"
                              placeholder="Enter Full Name"
                              id="name"
                              className="form-control"
                              value={invoiceData.name}
                              onChange={handleChange}
                            />
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
                        <div className="col-md-6 mb-2">
                          <div className="form-outline">
                            <label className="form-label" htmlFor="net_amount">
                              Total Amount :
                            </label>
                            <input
                              type="number"
                              required
                              placeholder="Enter Total Amount"
                              id="net_amount"
                              className="form-control"
                              name="net_amount"
                              value={invoiceData.net_amount}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                        <div className="col-md-6 mb-2">
                          <div className="form-outline">
                            <label className="form-label" htmlFor="paid_amount">
                              Paid Amount :
                            </label>
                            <input
                              type="number"
                              required
                              placeholder="Enter Paid Amount"
                              id="paid_amount"
                              className="form-control"
                              value={invoiceData.paid_amount}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                        <div className="col-md-6 mb-2">
                          <div className="form-outline">
                            <label className="form-label" htmlFor="dueAmount">
                              Due Amount :
                            </label>
                            <input
                              type="number"
                              required
                              id="dueAmount"
                              className="form-control"
                              name="dueAmount"
                              value={calculateDueAmount()}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
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
                        className={`btn btn-primary btn-block mb-4 w-100 ${
                          isSubmitting ? "disabled" : ""
                        }`}
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                      >
                        {isSubmitting
                          ? "Please wait, updating invoice..."
                          : "Update Invoice"}
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
                            // Dummy data if formData is not available
                            <>
                              <div class="col-8">
                                <h5>
                                  <b>Dummy Company Name</b>
                                </h5>
                                <p style={{ fontSize: "13px" }} class="mt-1">
                                  Dummy Company Address
                                </p>
                                <p style={{ fontSize: "13px" }}>
                                  Phone no.:
                                  <strong>Dummy Phone</strong>
                                </p>
                                <p style={{ fontSize: "13px" }}>
                                  Email:
                                  <strong>Dummy Email</strong>
                                </p>
                                <p style={{ fontSize: "13px" }}>
                                  GSTIN:
                                  <strong>Dummy GSTIN</strong>
                                </p>
                              </div>
                              <div className="col-4">
                                <div>
                                  <img
                                    alt=""
                                    src="dummy-logo-url.jpg"
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
                              <div class="bill-to">Bill To</div>
                              <strong>
                                <p
                                  class="mt-2 ml-10"
                                  style={{ fontSize: "14px" }}
                                >
                                  {invoicePDFData.name !== null
                                    ? invoicePDFData.name
                                    : "Dummy Full Name"}
                                </p>
                              </strong>
                              <strong>
                                <p class="px-2" style={{ fontSize: "14px" }}>
                                  {invoicePDFData.email !== null
                                    ? invoicePDFData.email
                                    : "Dummy Email"}
                                </p>
                              </strong>
                            </div>
                          </div>
                          <div class="col-6 border text-right">
                            <div class="bill-name-date px-2">
                              <p>
                                <strong>Invoice No. :</strong>
                                <span>
                                  {invoicePDFData.invoice_number !== null
                                    ? invoicePDFData.invoice_number
                                    : "001"}
                                </span>
                              </p>
                              <p class="">
                                <strong>Date :-</strong>
                                <span>
                                  {invoicePDFData.date !== null
                                    ? invoicePDFData.date
                                    : "09/09/0009"}
                                </span>
                              </p>
                              <p class="">
                                <strong>Phone No. :-</strong>
                                <span>
                                  {invoicePDFData.mobile !== null
                                    ? invoicePDFData.mobile
                                    : "122131212"}
                                </span>
                              </p>
                              <p class="">
                                <strong>Address :-</strong>
                                <span>
                                  {invoicePDFData.address !== null
                                    ? invoicePDFData.address
                                    : "Dummy Invoice Address"}
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
                                    : "Dummy Product Name"}
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
                                  : "Dummy Note"}
                              </span>
                            </p>
                          </div>
                          <div className="col-6 border px-0">
                            <div className="bill-to px-2">Due Date :-</div>
                            <p style={{ fontSize: "14px" }} className="px-2">
                              <b></b>{" "}
                              <span>
                                {invoicePDFData.due_date !== null
                                  ? invoicePDFData.due_date
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
            {/* {isLoading && (
                     <>
                        
                        <div className="d-none d-md-block">
                           <div
                              style={{
                                 position: 'absolute',
                                 top: 0,
                                 left: 0,
                                 width: '100%',
                                 height: '100%',
                                 background: 'rgba(255, 255, 255, 0.8)',
                                 display: 'flex',
                                 alignItems: 'center',
                                 justifyContent: 'center',
                              }}
                           >
                              <Spinner animation="border" variant="primary" />
                           </div>
                        </div>

                        
                        <div className="d-md-none">
                           <div
                              style={{
                                 position: 'absolute',
                                 top: 0,
                                 left: 0,
                                 width: '100%',
                                 height: '100%',
                                 background: 'rgba(255, 255, 255, 0.8)',
                                 display: 'flex',
                                 alignItems: 'center',
                                 justifyContent: 'center',
                                 marginTop: '200px',
                              }}
                           >
                              <Spinner animation="border" variant="primary" />
                           </div>
                        </div>
                     </>
                  )} */}
          </Col>
        </Row>
      </div>
    </>
  );
};

export default CreateInvoice;
