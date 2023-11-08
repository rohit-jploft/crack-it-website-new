import CircularProgress from "@mui/material/CircularProgress";
import { useContext, useEffect } from "react";
import { PaymentContext } from "../context/paymentContext";
import Axios from "axios";
import { BASE_URL } from "../constant";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const CheckPayment = () => {
  const { bookingIdAfterPayment, setBookingIdAfterPayment } =
    useContext(PaymentContext);
    const navigate = useNavigate()
  const checkAndVerifyPayment = async () => {
    const sessionId = localStorage.getItem("sessionId");
    const bookingIdAfterPayment = localStorage.getItem("bookingIdAfterPayment");
    const check = await Axios.put(`${BASE_URL}payment/intent/check`, {
      type: "session",
      id: sessionId,
      bookingId: bookingIdAfterPayment,
    });
    console.log(check)
    if(check.data.status === 200){
        navigate("/Mybookings")
        toast.success("Payment successfull")
    } else {
        navigate("/Mybookings")
        toast.error("Payment failed")
    }
  };
  useEffect(() => {
    checkAndVerifyPayment()
  },[])
  return (
    <div className="payment_loader">
        <ToastContainer/>
      <h5>
        {" "}
        <CircularProgress color="success" />
        <span className="text-dark">checking payment</span>
      </h5>
    </div>
  );
};
export default CheckPayment;
