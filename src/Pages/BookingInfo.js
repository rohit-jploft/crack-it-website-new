import "./../style.css";
import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Chip from '@mui/material/Chip';
import Header from "./Header";
import Container from "react-bootstrap/Container";
import Bookingimg2 from "./../Images/default_avatar.png";
import Time2 from "./../Images/time2.svg";
import Message2 from "./../Images/message2.svg";
import { getSingleBookingDetail } from "../data/booking";
import {
  convertDateStampToTimeZone,
  getDateFromTimeStamps,
  getTimeFromTimestamps,
} from "../helper/helper";
import TextInput from "../components/InputField";
import Axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import { AVATAR_BASE_URL, BASE_URL, STRIPE_PUBLIC_KEY } from "../constant";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { PaymentContext } from "../context/paymentContext";
import { getWallet } from "../data/wallet";
import { Button, Modal } from "react-bootstrap";

import {
  FormLabel,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  Card,
} from "@mui/material";
import { isExpert } from "../utils/authHelper";
import Loader from "../components/Loader";
import { useNavigate } from "react-router-dom";
import { BookingContext } from "../context/bookingContext";
const BookingInfo = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { bookingIdAfterPayment, setBookingIdAfterPayment } =
    useContext(PaymentContext);

  const { ticketRaiseBookingId, setTicketRaiseBookingId } =
    useContext(BookingContext);
  const [showPaymentMethodModel, setShowPaymentMethodModel] = useState(false);
  const [bookingData, setBookingData] = useState();
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoRemoved, setPromoRemoved] = useState(false);
  const [lastTriedPromo, setLastTriedPromo] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentAmount, setPaymentAmount] = useState();
  const [walletPaymentDone, setWalletPaymentDone] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [walletAmount, setWalletAmount] = useState();
  const isThisExpert = isExpert();

  const getBookingData = async () => {
    const data = await getSingleBookingDetail(bookingId);
    console.log(data, "bookingData");
    setBookingData(data.data);
  };
  useEffect(() => {
    getBookingData();
    setPromoApplied(false);
    setPromoRemoved(false);
    setWalletPaymentDone(false);
  }, [promoApplied, promoRemoved, bookingId, walletPaymentDone]);

  const applyPromoCode = async () => {
    if (lastTriedPromo !== promoCode) {
      try {
        const res = await Axios.put(`${BASE_URL}promo/code/apply`, {
          promoCode,
          bookingId,
        });
        console.log(res);

        if (res && res.data) {
          setPromoApplied(true);
          setLastTriedPromo(promoCode);
          toast(res?.data?.message, { type: res?.data?.type });
        }
      } catch (error) {
        console.log(error);
      }
    }
  };
  const removePromoCode = async () => {
    try {
      const res = await Axios.put(`${BASE_URL}promo/code/remove`, {
        bookingId,
      });
      console.log(res);
      if (res && res.data && res.data.success) {
        console.log("promo removed");
        setPromoCode("");
        setPromoRemoved(true);
        toast.success("Promo removed successfully");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const makePayment = async (amount, meetingId) => {
    const stripe = await loadStripe(STRIPE_PUBLIC_KEY);

    try {
      const body = {
        amount: amount,
        meetingId: meetingId,
      };
      const headers = {
        "Content-Type": "application/json",
      };
      const response = await fetch(`${BASE_URL}payment/intent/create`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(body),
      });

      const session = await response.json();
      console.log(session, "payment session");
      setBookingIdAfterPayment(meetingId);
      localStorage.setItem("bookingIdAfterPayment", meetingId);
      localStorage.setItem("sessionId", session.id);

      const result = stripe.redirectToCheckout({
        sessionId: session.id,
      });

      if (result.error) {
        console.log(result.error);
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      return error;
    }
  };
  const role = localStorage.getItem("role");
  const userId = localStorage.getItem("userId");

  const paymentProceed = async () => {
    const stripe = await loadStripe(STRIPE_PUBLIC_KEY);

    setIsLoading(true);
    if (paymentMethod === "STRIPE" && paymentAmount) {
      setShowPaymentMethodModel(false);
      makePayment(paymentAmount, bookingId);
    }
    if (paymentMethod === "WALLET" && paymentAmount) {
      setShowPaymentMethodModel(false);
      const payWallet = await Axios.put(`${BASE_URL}payment/wallet`, {
        bookingId: bookingId,
        amount: paymentAmount,
        userId: userId,
      });
      console.log(payWallet.data, "payWallet");
      setTimeout(
        () => {
          setIsLoading(false);

          if (
            payWallet &&
            payWallet.data.success &&
            payWallet.data.data &&
            payWallet.data.data?.id
          ) {
            console.log("wallet api done");
            setBookingIdAfterPayment(payWallet.data.data?.bookingId);
            localStorage.setItem(
              "bookingIdAfterPayment",
              payWallet.data.data?.bookingId
            );
            localStorage.setItem("sessionId", payWallet.data.data?.id);
            localStorage.setItem(
              "walletTransactionId",
              payWallet.data.data?.walletTransactionId
            );
            const result = stripe.redirectToCheckout({
              sessionId: payWallet?.data?.data?.id,
            });

            if (result.error) {
              console.log(result.error);
            }

            setWalletPaymentDone(true);
            setIsLoading(false);
          } else if (
            payWallet &&
            payWallet.data.success &&
            payWallet.data.data &&
            !payWallet.data.data?.id
          ) {
            setWalletPaymentDone(true);
            setIsLoading(false);
            toast.success("Payment successfull");
          } else if (payWallet && !payWallet.data.success) {
            setIsLoading(false);
            toast.error(payWallet?.data?.message, { autoClose: 300 });
          } else {
            setIsLoading(false);
            toast.error("Something went wrong");
          }
          console.log(payWallet, "response after payment through wallet");
          setIsLoading(false);
        },
        payWallet ? 2000 : 3000
      );
    }
  };

  const proceedWhenAmountIsZero = async () => {
    setIsLoading(true);
    const res = await Axios.put(`${BASE_URL}payment/booking/zero/${bookingId}`);
    console.log(res, "zero amount");
    if (res && res?.data && res.data.success) {
      toast.success("Booking has been confirmed");
      setWalletPaymentDone(false);
      setIsLoading(false);
      window.location.reload();
    } else {
      toast.error(res?.data?.message);
      setIsLoading(false);
    }
  };

  const getWalletData = async () => {
    const data = await getWallet();
    setWalletAmount(data?.data?.wallet?.amount);
  };

  useEffect(() => {
    if (
      (showPaymentMethodModel || !showPaymentMethodModel) &&
      paymentMethod === "WALLET"
    ) {
      getWalletData();
    }
  }, [paymentMethod, showPaymentMethodModel]);
  return (
    <>
      <Header />
      <ToastContainer />
      <section className="">
        <Loader
          open={isLoading}
          title={
            paymentMethod === "WALLET"
              ? "Processing Payment through Wallet.."
              : "Processing Payment"
          }
        />
        <Container>
          <div className="main-content">
            <div class="content-head">
              <div>
                <h2>
                  Booking info (BookingId -{" "}
                  {bookingData?.booking?.booking?.bookingId})
                </h2>
                <p>See your scheduled meetings from your calendar</p>
              </div>
              <div>
                {/* <Link to="/MyBookings"> */}
                <button
                  className={`btn_${
                    bookingData?.booking?.booking?.status === "CONFIRMED" ||
                    bookingData?.booking?.booking?.status === "ACCEPTED" ||
                    bookingData?.booking?.booking?.status === "COMPLETED"
                      ? "confirmed"
                      : "rejected"
                  }`}
                >
                  {bookingData?.booking?.booking?.status}
                </button>
                {/* </Link> */}
              </div>
            </div>
            <div className="provider-info">
             <div style={{display:"flex", justifyContent:"space-between"}}>
             <div className="info-header">
                
                {!isThisExpert && <h6>Service Provider Info</h6>}
                {isThisExpert && <h6>Service Taker Info</h6>}
               
                <div
                  className="profile-detail"
                  style={{ justifyContent: "space-between" }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    {" "}
                    <div>
                      {!isThisExpert && (
                        <img
                          src={
                            bookingData?.booking?.booking?.expert?.profilePhoto
                              ? `${AVATAR_BASE_URL}${bookingData?.booking?.booking?.expert?.profilePhoto}`
                              : Bookingimg2
                          }
                          alt="img"
                        />
                      )}
                      {isThisExpert && (
                        <img
                          src={
                            bookingData?.booking?.booking?.user?.profilePhoto
                              ? `${AVATAR_BASE_URL}${bookingData?.booking?.booking?.user?.profilePhoto}`
                              : Bookingimg2
                          }
                          alt="img"
                        />
                      )}
                    </div>
                    <div>
                      {!isThisExpert && (
                        <h4>
                          {bookingData?.booking?.booking?.expert?.firstName}{" "}
                          {bookingData?.booking?.booking?.expert?.lastName}
                        </h4>
                      )}
                      {isThisExpert && (
                        <h4>
                          {bookingData?.booking?.booking?.user?.firstName}{" "}
                          {bookingData?.booking?.booking?.user?.lastName}
                        </h4>
                      )}
                      {!isThisExpert && (
                        <p>
                          {bookingData?.expertProfile?.jobCategory?.title} |{" "}
                          {bookingData?.expertProfile?.experience} year
                        </p>
                      )}
                    </div>
                  </div>
                  {bookingData?.booking?.booking?.status === "CANCELLED" &&
                    bookingData?.booking?.booking?.cancelBy == "EXPERT" && (
                      <div style={{}}>
                        <button
                          type="submit"
                          className="raise_issue_button"
                          style={{
                            float: "right",
                            width: "150px",
                            height: "40px",
                          }}
                          onClick={() => {
                            navigate(`/rebooking/experts/${bookingId}`)
                          }}
                        >
                          Re-Book
                        </button>
                      </div>
                    )}
                </div>
              </div>
              <div>
                <span><b>Job-Category - </b> {bookingData?.booking?.booking?.jobCategory?.title}</span><br/>
                <span><b>Skills - </b> {bookingData?.booking?.booking?.skills.length>0 &&bookingData?.booking?.booking?.skills.map((skill) =><Chip label={skill?.title} variant="outlined" />) }</span><br/>
                <span><b>Job Description - </b> {bookingData?.booking?.booking?.jobDescription}</span>
              </div>
             </div>
              <div className="info-content">
                <div className="info-detail">
                  <div className="datetime-info">
                    <div>
                      <img src={Time2} alt="img" />
                    </div>
                    <div>
                      <h5>
                        Date & Time {"("}
                        {bookingData?.booking?.booking?.timeZone}
                        {")"}
                      </h5>
                      <p>
                        {getDateFromTimeStamps(
                          bookingData?.booking?.booking?.date
                        )}
                      </p>
                      <p>
                        {getTimeFromTimestamps(
                          bookingData?.booking?.booking?.startTime
                        )}{" "}
                        {/* {console.log("inputs", bookingData?.booking?.booking?.startTime,  bookingData?.booking?.booking?.timeZone)}
                        {convertDateStampToTimeZone(
                          bookingData?.booking?.booking?.startTime,
                          bookingData?.booking?.booking?.timeZone
                        )}{" "} */}
                        -{" "}
                        {getTimeFromTimestamps(
                          bookingData?.booking?.booking?.endTime
                        )}
                      </p>
                    </div>
                  </div>
                  <hr className="info-hr"></hr>
                  {/* <div className="datetime-info">
                    <div>
                      <img src={Message2} alt="img" />
                    </div>
                    <div>
                      <h5>Date & Time</h5>
                      <p>Monday 21 Aug, 2023</p>
                      <p>8:00 - 8:30 AM</p>
                    </div>
                  </div> */}
                </div>
                {bookingData?.booking?.booking?.status === "ACCEPTED" &&
                  role === "USER" && (
                    <div className="promo-card-container promocode-nader">
                      <h3>Promos & Gift Codes</h3>
                      <p>
                        <strong>Note:</strong> One discount can be redeemed per
                        order. See terms for details.
                      </p>
                      <div className="promo-input">
                        <TextInput
                          name="promoCode"
                          label="Promo Code *"
                          readonly={bookingData?.booking.promoCode}
                          value={
                            bookingData?.booking.promoCode
                              ? bookingData?.booking.promoCode.code
                              : promoCode
                          }
                          handleChange={(e) => setPromoCode(e.target.value)}
                        />
                        {!bookingData?.booking.promoCode && promoCode && (
                          <button onClick={() => applyPromoCode()}>
                            APPLY
                          </button>
                        )}
                        {bookingData?.booking.promoCode && (
                          <button
                            style={{ backgroundColor: "red", color: "white" }}
                            onClick={() => removePromoCode()}
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                <div className="payment-info">
                  <h5>Payment Info</h5>
                  <div className="pay-rate">
                    <div>Total Price</div>
                    <div>${bookingData?.booking?.totalAmount}</div>
                  </div>
                  <div className="pay-rate">
                    <div>Platform fees</div>
                    <div>${bookingData?.booking?.CommissionAmount}</div>
                  </div>
                  {bookingData?.booking?.promoCode && (
                    <div className="pay-rate">
                      <div>Discount</div>
                      <div>${bookingData?.booking?.discountAmount}</div>
                    </div>
                  )}
                  <hr className="info-hr"></hr>
                  <div className="pay-total">
                    <div>Payment Total</div>
                    <div>${bookingData?.booking?.grandTotal}</div>
                  </div>
                </div>
              </div>
              {bookingData?.booking?.status === "UNPAID" &&
                bookingData?.booking?.booking?.status === "ACCEPTED" &&
                role === "USER" && (
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "flex-end",
                      marginTop: "15px",
                    }}
                  >
                    <button
                      className="form-btn"
                      type="submit"
                      style={{ marginLeft: "auto", width: "35%" }}
                      onClick={() => {
                        // makePayment(
                        //   bookingData?.booking?.grandTotal,
                        //   bookingId
                        // );
                        if (bookingData?.booking?.grandTotal == 0) {
                          proceedWhenAmountIsZero();
                        } else {
                          setPaymentAmount(bookingData?.booking?.grandTotal);
                          setShowPaymentMethodModel(true);
                        }
                      }}
                    >
                      Pay & Proceed
                    </button>
                  </div>
                )}
            </div>
            {bookingData?.booking?.booking?.status === "CANCELLED" && (
              <div className="raise_issue_bottom_div">
                <div className="left_div_text">
                  <h5>Cancel reason</h5>
                  <span>{bookingData?.cancel?.reason?.reason}</span>
                </div>
                <div className="right_div_button">
                  <button
                    type="submit"
                    className="raise_issue_button"
                    onClick={() => {
                      setTicketRaiseBookingId(bookingId);
                      navigate("/raise/issue");
                    }}
                  >
                    {" Raise Issue"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </Container>
        <Modal
          show={showPaymentMethodModel}
          onHide={() => setShowPaymentMethodModel(false)}
          className="cancel_modal"
        >
          <Modal.Header closeButton></Modal.Header>
          <Modal.Body>
            {/* <img src={Cancelicon} alt="img" /> */}
            <Modal.Title>Select payment method</Modal.Title>
            <div>
              <FormControl>
                <RadioGroup
                  aria-labelledby="demo-radio-buttons-group-label"
                  defaultValue="female"
                  name="radio-buttons-group"
                  onChange={(e) => {
                    setPaymentMethod(e.target.value);
                  }}
                  value={paymentMethod}
                >
                  <FormControlLabel
                    value="WALLET"
                    control={<Radio />}
                    label="Wallet"
                  />
                  <FormControlLabel
                    value="STRIPE"
                    control={<Radio />}
                    label="Credit & debit cards"
                  />
                </RadioGroup>
              </FormControl>
              {paymentMethod === "WALLET" && (
                <div
                  style={{
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                    padding: "15px",
                    backgroundColor: "#f9f9f9",
                    margin: "10px 0",
                    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <div style={{ display: "flex" }}>
                      <h6 style={{ margin: "5px 0", color: "#666" }}>
                        Wallet Amount:
                      </h6>
                      <span style={{ fontWeight: "bold", color: "#333" }}>
                        ${walletAmount}
                      </span>
                    </div>
                    {parseFloat(bookingData?.booking?.grandTotal) -
                      walletAmount >=
                      0 && (
                      <div style={{ display: "flex" }}>
                        <h6 style={{ margin: "5px 0", color: "#666" }}>
                          Remaining Amount:
                        </h6>
                        <span style={{ fontWeight: "bold", color: "#333" }}>
                          $
                          {parseFloat(bookingData?.booking?.grandTotal) -
                            walletAmount}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
              {paymentMethod === "WALLET" &&
                parseFloat(bookingData?.booking?.grandTotal) - walletAmount >
                  0 && (
                  <span style={{ width: "100%" }}>
                    Note: Remaining wil be processed through Credit & Debit
                    cards
                  </span>
                )}
            </div>

            <Button className="yes-btn" onClick={() => paymentProceed()}>
              Pay{" "}
              {paymentMethod === "WALLET"
                ? `$${
                    parseFloat(bookingData?.booking?.grandTotal) -
                      walletAmount >=
                    0
                      ? parseFloat(bookingData?.booking?.grandTotal) -
                        walletAmount
                      : 0
                  }`
                : "$" + parseFloat(bookingData?.booking?.grandTotal)}
            </Button>
          </Modal.Body>
        </Modal>
      </section>
    </>
  );
};

export default BookingInfo;
