import "./../style.css";
import React from "react";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "./Header";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Successicon from "./../Images/success.svg";
import Upi from "./../Images/upi.svg";
import { UserContext } from "../context/userContext";
import TextInput from "../components/InputField";
import { useFormik } from "formik";
import * as Yup from "yup";
import { createWithDrawalReq, getAllBankDetails } from "../data/wallet";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const WithdrawAmount = () => {
  const navigate = useNavigate();

  const { walletAmount, setWalletAmount } = useContext(UserContext);

  const [show, setShow] = useState(false);
  const handleClose2 = () => {
    setShow(false);
    navigate("/wallet");
  };
  const handleShow2 = () => setShow(true);
  const [upiData, setUpiData] = useState([]);
  const [banksData, setBanksData] = useState([]);

  const getBanksData = async () => {
    const res = await getAllBankDetails();
    const upi = res.data.filter((item) => item.type === "UPI");
    const bank = res.data.filter((item) => item.type === "BANK");

    setBanksData(bank);
    setUpiData(upi);
  };
  useEffect(() => {
    getBanksData();
  }, []);
  const createWithdrawReq = async (obj) => {
    const userId = localStorage.getItem("userId");
    const data = await createWithDrawalReq({ ...obj, user: userId });
    console.log(data);
    if (data && data?.data && data?.status === 200 && data?.success) {
      handleShow2(); // navigate("/withdraw-amount");
    } 
    if(data.status === 202 && !data.success){
        toast.error(data.message);
    }
  };
  const formik = useFormik({
    initialValues: {
      amount: "",
      bank: "",
    },
    validationSchema: Yup.object({
      amount: Yup.number().positive().required("Amount is required"),
      bank: Yup.string().required("Select a bank or upi"),
    }),
    onSubmit: async (values) => {
      console.log(values);
      await createWithdrawReq(values);
    },
  });
  return (
    <>
    <ToastContainer/>
      <Header />
      <section className="">
        <Container>
          <div className="main-content">
            <div className="job-categ">
              <div className="payment_field">
                <h3>Withdraw Amount</h3>
                <div className="info-header info-payment">
                  {/* <h6>Service Provider Info</h6> */}
                </div>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    formik.handleSubmit();
                  }}
                >
                  <div class="input-field">
                    <TextInput
                      name="amount"
                      type="number"
                      class="form-control"
                      id="exampleFormControlInput1"
                      placeholder="Enter amount"
                      value={formik.values.amount}
                      handleChange={formik.handleChange}
                      error={
                        formik.touched.amount && Boolean(formik.errors.amount)
                      }
                      helperText={formik.touched.amount && formik.errors.amount}
                    />
                  </div>
                  <div className="walletamount-box">
                    <div className="header-wa">
                      <h3>Bank Details</h3>
                      <button
                        className="btn_addnew"
                        onClick={() => navigate("/AddBankDtails")}
                      >
                        Add New
                      </button>
                    </div>
                    {banksData.map((bank) => {
                      return (
                        <div className="radio_wallet">
                          <div>
                            <p>
                              Bank Name <b>{bank?.bankName}</b>
                            </p>
                            <p>
                              Account Name <b>{bank?.accountName}</b>
                            </p>
                            <p>
                              Account Number <b>{bank?.accountName}</b>
                            </p>
                            <p>
                              IFSC Code <b>{bank?.ifscCode}</b>
                            </p>
                          </div>
                          <label className="radio-button">
                            <input
                              type="radio"
                              class="radio-button__input"
                              id="choice1-1"
                              name="bank"
                              checked={formik.values.bank === bank._id}
                              onChange={() =>
                                formik.setFieldValue("bank", bank._id)
                              }
                            />
                            <span className="radio-button__control"></span>
                          </label>
                        </div>
                      );
                    })}
                    {formik.touched.bank && Boolean(formik.errors.bank) && (
                      <div
                        style={{
                          color: "red",
                          textAlign: "left",
                          marginLeft: "9px",
                          fontSize: "13px",
                          marginBottom: "-4px",
                          marginTop: "3px",
                        }}
                      >
                        <span>{formik.touched.bank && formik.errors.bank}</span>
                      </div>
                    )}
                  </div>

                  <div className="walletamount-box">
                    <div className="header-wa">
                      <h3>UPI Id</h3>
                      <Link to="/AddUpiId">
                        <button className="btn_addnew">Add New</button>
                      </Link>
                    </div>

                    {upiData.map((item) => {
                      return (
                        <div className="radio_wallet">
                          <div>
                            <img className="upi-img" src={Upi} alt="img" />
                            {item?.upiId}
                          </div>
                          <label className="radio-button">
                            <input
                              type="radio"
                              class="radio-button__input"
                              id="choice1-1"
                              name="bank"
                              checked={formik.values.bank === item._id}
                              onChange={() =>
                                formik.setFieldValue("bank", item._id)
                              }
                            />
                            <span className="radio-button__control"></span>
                          </label>
                        </div>
                      );
                    })}
                    {formik.touched.bank && Boolean(formik.errors.bank) && (
                      <div
                        style={{
                          color: "red",
                          textAlign: "left",
                          marginLeft: "9px",
                          fontSize: "13px",
                          marginBottom: "-4px",
                          marginTop: "3px",
                        }}
                      >
                        <span>{formik.touched.bank && formik.errors.bank}</span>
                      </div>
                    )}
                  </div>
                  <div className="expert-price pt-0 pb-0">
                    <h4>${formik?.values?.amount}</h4>
                  </div>
                  <div className="">
                    <Button type="submit" className="btn-pay">
                      WITHDRAW
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <Modal show={show} onHide={handleClose2} className="cancel_modal">
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          <img src={Successicon} alt="img" />
          <Modal.Title>
            Your withdraw request submitted successfully!
          </Modal.Title>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default WithdrawAmount;
