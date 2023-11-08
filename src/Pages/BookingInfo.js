import "./../style.css";
import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Header from "./Header";
import Container from "react-bootstrap/Container";
import Bookingimg2 from "./../Images/booking-img2.svg";
import Time2 from "./../Images/time2.svg";
import Message2 from "./../Images/message2.svg";
import { getSingleBookingDetail } from "../data/booking";
import { getDateFromTimeStamps, getTimeFromTimestamps } from "../helper/helper";
import TextInput from "../components/InputField";
import Axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import { BASE_URL, STRIPE_PUBLIC_KEY } from "../constant";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { PaymentContext } from "../context/paymentContext";

const BookingInfo = () => {
  const { bookingId } = useParams();
  const {bookingIdAfterPayment, setBookingIdAfterPayment} = useContext(PaymentContext)
  const [bookingData, setBookingData] = useState();
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoRemoved, setPromoRemoved] = useState(false);
  const [lastTriedPromo, setLastTriedPromo] = useState("");
  const getBookingData = async () => {
    const data = await getSingleBookingDetail(bookingId);
    console.log(data);
    setBookingData(data.data);
  };
  useEffect(() => {
    getBookingData();
    setPromoApplied(false);
    setPromoRemoved(false);
  }, [promoApplied, promoRemoved, bookingId]);

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
      console.log(session, "payment session")
      setBookingIdAfterPayment(meetingId)
      localStorage.setItem("bookingIdAfterPayment", meetingId)
      localStorage.setItem("sessionId", session.id)

      const result = stripe.redirectToCheckout({
        sessionId: session.id,
      });

      if (result.error) {
        console.log(result.error);
      }
    } catch (error) {
      return error;
    }
  };
  const role = localStorage.getItem("role");
  return (
    <>
      <Header />
      <ToastContainer />
      <section className="">
        <Container>
          <div className="main-content">
            <div class="content-head">
              <div>
                <h2>Booking info</h2>
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
              <div className="info-header">
                <h6>Service Provider Info</h6>
                <div className="profile-detail">
                  <div>
                    <img src={Bookingimg2} alt="img" />
                  </div>
                  <div>
                    <h4>
                      {bookingData?.booking?.booking?.expert?.firstName}{" "}
                      {bookingData?.booking?.booking?.expert?.lastName}
                    </h4>
                    <p>
                      {bookingData?.expertProfile?.jobCategory?.title} |{" "}
                      {bookingData?.expertProfile?.experience} year
                    </p>
                  </div>
                </div>
              </div>
              <div className="info-content">
                <div className="info-detail">
                  <div className="datetime-info">
                    <div>
                      <img src={Time2} alt="img" />
                    </div>
                    <div>
                      <h5>Date & Time</h5>
                      <p>
                        {getDateFromTimeStamps(
                          bookingData?.booking?.booking?.date
                        )}
                      </p>
                      <p>
                        {getTimeFromTimestamps(
                          bookingData?.booking?.booking?.startTime
                        )}{" "}
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
                {bookingData?.booking?.status === "UNPAID" &&
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
                    <div>${bookingData?.booking.totalAmount}</div>
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
                    <div>${bookingData?.booking.grandTotal}</div>
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
                        makePayment(
                          bookingData?.booking?.grandTotal,
                          bookingId
                        );
                      }}
                    >
                      Pay & Proceed
                    </button>
                  </div>
                )}
            </div>
          </div>
        </Container>
      </section>
    </>
  );
};

export default BookingInfo;
