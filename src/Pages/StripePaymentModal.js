import React from "react";
import {
  CardNumberElement,
  CardCvcElement,
  CardExpiryElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Col, FloatingLabel, Form, Modal, Row } from "react-bootstrap";
import { ErrorMessage, Formik } from "formik";
import { Cardvalidataion } from "../utils/ValidationSchema";
import ErrorComponent from "./ErrorComponent";

import CloseIcon from "../assets/img/close-icon.svg";
import { SubmitResponse } from "../utils/ApiFunctions";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useLocalization } from "./Localization/Localization";
import moment from "moment";

const CARD_OPTIONS = {
  iconStyle: "solid",
  style: {
    base: {
      iconColor: "#c4f0ff",
      color: "black",
      fontWeight: 200,
      padding: "20px",
      border: "1px solid #C19444",
      fontFamily: "Roboto, Open Sans, Segoe UI, sans-serif",
      fontSize: "16px",
      fontSmoothing: "antialiased",
      ":-webkit-autofill": { color: "black" },
      "::placeholder": { color: "gray" },
    },
    invalid: {
      iconColor: "#ffc7ee",
      color: "black",
    },
  },
};

const PaymentForm = (props) => {
  const { t } = useLocalization();

  const navigate = useNavigate();
  const usr = localStorage.getItem("user_id");
  const school = localStorage.getItem("school");
  const stripe = useStripe();
  const elements = useElements();
  const [btn, setPaybtn] = useState(false);

  const CheckOut = async () => {
    const data = {
      cartId: props?.data?.cartId,
      userId: usr,
      school: school,
      shippingType: props?.data?.shippingType,
      paymentMode: "CARD",
      orderType: "NORMAL",
      deliveryBreakTime: props?.data?.servingtime
        ? props?.data?.servingtime
        : "",
      deliveryTime: props?.data?.deliveryTime
        ? moment(props?.data?.deliveryTime).format("HH:mm:ss")?.toString()
        : "",
      servingPlace: props?.data?.servingplace ? props?.data?.servingplace : "",
    };

    // if(servingtime=="break/")

    const res = await SubmitResponse(`shop/order/create`, data);
    if (res?.status == 200) {
      toast.success(res?.data?.message);
      navigate("/ShopList");
    }
  };

  const handleSubmit = async (values) => {
    if (!stripe || !elements) {
      return;
    }

    const result = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(
        CardCvcElement,
        CardExpiryElement,
        CardNumberElement
      ),
    });

    if (result.error) {
      toast.error(result.error.message);
    } else {
      setPaybtn(true);
      const datas = {
        id: result.paymentMethod.id,
        amount: parseFloat(props?.data?.amount * 100)?.toFixed(2),
      };
      const response = await SubmitResponse("/common/create_payment", datas);

      if (response?.status == 200) {
        // toast.success("Payment Done");
        CheckOut();
      }
    }
  };

  return (
    <>
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className="modasss"
      >
        <Modal.Body>
          <div className="login-box px-5">
            <button onClick={() => props.onHide()} className="btn-btn-close">
              <img src={CloseIcon} alt="" />
            </button>
            <div>
              {/* <CardElement />{" "} */}

              <label htmlFor="floatingPasswordCustom" className="labelhead">
                {t("enter_card")}
              </label>

              <Formik
                initialValues={{
                  cardnumber: "",
                  exp_month: "",
                  exp_year: "",
                  cvc: "",
                  // orderId: data?._id,
                }}
                onSubmit={handleSubmit}
                // validationSchema={Cardvalidataion}
                enableReinitialize
              >
                {({
                  values,
                  errors,
                  touched,
                  handleChange,
                  handleBlur,
                  handleSubmit,
                  isSubmitting,
                  /* and other goodies */
                }) => (
                  // <form onSubmit={handleSubmit}>
                  //   <Row>
                  //     <Col md={6}>
                  //       {" "}
                  //       <Form.Group className="mb-3" controlId="formBasicEmail">
                  //         <FloatingLabel label="Card No." className="mb-3">
                  //           <Form.Control
                  //             type="number"
                  //             name="cardnumber"
                  //             value={values?.cardnumber}
                  //             onChange={handleChange}
                  //             placeholder="+61 6556897225"
                  //             className="phone-feild"
                  //           />
                  //           <div className="mobile-icon">
                  //             {/* <BsBank /> */}
                  //           </div>
                  //         </FloatingLabel>
                  //         <ErrorComponent
                  //           error={
                  //             errors.cardnumber &&
                  //             touched.cardnumber &&
                  //             errors.cardnumber
                  //           }
                  //         />
                  //       </Form.Group>
                  //     </Col>
                  //     <Col md={6}>
                  //       <Form.Group className="mb-3" controlId="formBasicEmail">
                  //         <FloatingLabel label="Expiry Month" className="mb-3">
                  //           <Form.Control
                  //             type="string"
                  //             placeholder="MM"
                  //             // pattern="[0-9]{2}"
                  //             name="exp_month"
                  //             value={values?.exp_month}
                  //             onChange={handleChange}
                  //             required
                  //             // placeholder="+61 6556897225"
                  //             className="phone-feild"
                  //           />
                  //           <div className="mobile-icon">
                  //             {/* <img src={Iccalendar} alt="" /> */}
                  //           </div>
                  //         </FloatingLabel>
                  //         <ErrorComponent
                  //           error={
                  //             errors.exp_month &&
                  //             touched.exp_month &&
                  //             errors.exp_month
                  //           }
                  //         />
                  //       </Form.Group>
                  //     </Col>

                  //     <Col md={6}>
                  //       <Form.Group className="mb-3" controlId="formBasicEmail">
                  //         <FloatingLabel
                  //           controlId="floatingInput"
                  //           label="Expiry Year"
                  //           className="mb-3"
                  //         >
                  //           <Form.Control
                  //             type="number"
                  //             placeholder="YYYY"
                  //             name="exp_year"
                  //             value={values?.exp_year}
                  //             onChange={handleChange}
                  //             pattern="[0-9]{2}"
                  //             required
                  //             // placeholder="+61 6556897225"
                  //             className="phone-feild"
                  //           />
                  //           <div className="mobile-icon">
                  //             {/* <img src={Iccalendar} alt="" /> */}
                  //           </div>
                  //         </FloatingLabel>
                  //         <ErrorComponent
                  //           error={
                  //             errors.exp_year &&
                  //             touched.exp_year &&
                  //             errors.exp_year
                  //           }
                  //         />
                  //       </Form.Group>
                  //     </Col>

                  //     <Col md={6}>
                  //       <Form.Group className="mb-3" controlId="formBasicEmail">
                  //         <FloatingLabel
                  //           controlId="floatingInput"
                  //           label="CVV"
                  //           className="mb-3"
                  //         >
                  //           <Form.Control
                  //             type="number"
                  //             name="cvc"
                  //             value={values?.cvc}
                  //             onChange={handleChange}
                  //             placeholder="+61 6556897225"
                  //             className="phone-feild"
                  //           />
                  //           <div className="mobile-icon">
                  //             {/* <img src={Iccvv} alt="" /> */}
                  //           </div>
                  //         </FloatingLabel>
                  //         <ErrorComponent
                  //           error={errors.cvc && touched.cvc && errors.cvc}
                  //         />
                  //       </Form.Group>
                  //     </Col>

                  //     <button type="submit" className="cmn-new-btn-ewn">
                  //       Pay
                  //     </button>
                  //   </Row>
                  // </form>
                  <form onSubmit={handleSubmit}>
                    <Row>
                      <Col md={12}>
                        <div className="FormRow">
                          <CardNumberElement options={CARD_OPTIONS} />
                        </div>
                      </Col>

                      <Col md={6}>
                        <div className="FormRow">
                          <CardExpiryElement options={CARD_OPTIONS} />
                        </div>
                      </Col>

                      <Col md={6}>
                        <div className="FormRow">
                          <CardCvcElement options={CARD_OPTIONS} />
                        </div>
                      </Col>
                      <Col md={6}>
                        {btn == false ? (
                          <button
                            type="submit"
                            disabled={btn}
                            className="cmn-new-btn-ewn w-100"
                          >
                            {t("pay")}
                          </button>
                        ) : (
                          <button
                            disabled={btn}
                            className="cmn-new-btn-ewn w-100"
                          >
                            {t("please_wait")}
                          </button>
                        )}
                      </Col>
                    </Row>
                  </form>
                )}
              </Formik>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default PaymentForm;
