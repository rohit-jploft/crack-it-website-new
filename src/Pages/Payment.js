import "./../style.css";
import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "./Header";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Successicon from "./../Images/success.svg";
import Bookingimg2 from "./../Images/booking-img2.svg";
import Stripe from "./../Images/stripe.svg";
import { useFormik } from "formik";
import * as Yup from "yup";
import TextInput from "../components/InputField";
import getStripe from "../components/stript";
import { PaymentForm } from "./stripe";
import { CardElement, Elements, useElements, useStripe } from "@stripe/react-stripe-js";
import { stripePromise } from "../data/stripePromise";
import Axios from "axios";
import { BASE_URL } from "../constant";
const Payment = () => {
  const [show, setShow] = useState(false);
  const handleClose2 = () => setShow(false);
  const handleShow2 = () => setShow(true);
  // const stripe = useStripe();
  // const elements = useElements();
  const formik = useFormik({
    initialValues: {
      cardholderName: "",
      cardNo: "",
      expiry: "",
      cvv: "",
    },
    validationSchema: Yup.object().shape({
      cardholderName: Yup.string().required("Name is required"),
      cardNo: Yup.string()
        .matches(/^\d{16}$/, "Card number must be 16 digits")
        .required("Card number is required"),
      expiry: Yup.string().required("Expiry is required"),
      cvv: Yup.string()
        .matches(/^\d{3,4}$/, "CVV must be 3 or 4 digits")
        .required("CVV is required"),
    }),
    onSubmit: async (values) => {
      console.log(values);
 
   

      // const res = await Axios.post(`${BASE_URL}payment/intent/create`, {
      //   ...values,
      // });
      // console.log(res);
    },
  });

  return (
    <>
      <Header />
      <section className="">
        <Container>
          <div className="main-content">
            <div className="job-categ">
              <div className="payment_field">
                <h3>Payment</h3>
                <div className="info-header info-payment">
                  <h6>Service Provider Info</h6>
                  <div className="profile-detail payment_detail">
                    <div>
                      <img src={Bookingimg2} alt="img" />
                    </div>
                    <div>
                      <h4>James M</h4>
                      <p>Front-end Expert | 5 year</p>
                    </div>
                  </div>
                </div>
                <div className="payment-stripe">
                  <div>
                    <img src={Stripe} alt="img" />
                  </div>
                  <div>
                    <h5>$59.00</h5>
                  </div>
                </div>
                <div className="payment-divider">
                  <h2>
                    <span>or pay with card</span>
                  </h2>
                </div>
                  <form onSubmit={formik.handleSubmit}>
                    <div className="row">
                      <div className="col-md-12">
                        <div class="input-field"></div>
                      </div>
                      <div className="col-md-12">
                        <div class="input-field">
                          <TextInput
                            type="text"
                            name="cardholderName"
                            value={formik.values.cardholderName}
                            handleChange={formik.handleChange}
                            label="Name on Card"
                            error={
                              formik.touched.cardholderName &&
                              Boolean(formik.errors.cardholderName)
                            }
                            helperText={
                              formik.touched.cardholderName &&
                              formik.errors.cardholderName
                            }
                          />
                        </div>
                      </div>
                      <div className="col-md-12">
                        <div class="input-field">
                          <TextInput
                            type="text"
                            name="cardNo"
                            value={formik.values.cardNo}
                            handleChange={formik.handleChange}
                            label="Card Number"
                            error={
                              formik.touched.cardNo &&
                              Boolean(formik.errors.cardNo)
                            }
                            helperText={
                              formik.touched.cardNo && formik.errors.cardNo
                            }
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div class="input-field">
                          <TextInput
                            type="date"
                            name="expiry"
                            value={formik.values.expiry}
                            handleChange={formik.handleChange}
                            label="Expiry Date"
                            error={
                              formik.touched.expiry &&
                              Boolean(formik.errors.expiry)
                            }
                            helperText={
                              formik.touched.expiry && formik.errors.expiry
                            }
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div class="input-field">
                          <TextInput
                            type="number"
                            name="cvv"
                            value={formik.values.cvv}
                            handleChange={formik.handleChange}
                            label="CVV"
                            error={
                              formik.touched.cvv && Boolean(formik.errors.cvv)
                            }
                            helperText={formik.touched.cvv && formik.errors.cvv}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="">
                      <Button
                        type="submit"
                        className="btn-pay"
                        // onClick={handleShow2}
                      >
                        PAY
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
          <Modal.Title>Your Booking Payment Has Been Done</Modal.Title>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Payment;
