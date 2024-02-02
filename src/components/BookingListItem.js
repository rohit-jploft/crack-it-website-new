import Time from "./../Images/time.svg";
import Bookingimg from "./../Images/booking-img.svg";
import { useNavigate } from "react-router-dom";
import { isAgency, isExpert, isUser } from "../utils/authHelper";
import { loadStripe } from "@stripe/stripe-js";
import { AVATAR_BASE_URL, BASE_URL, STRIPE_PUBLIC_KEY } from "../constant";
import { useContext } from "react";
import { BookingContext } from "../context/bookingContext";
const BookingListItem = ({
  startTime,
  endTime,
  day,
  date,
  JobCategory,
  expertName,
  experience,
  cancelled,
  cancelButton,
  onClickChat,
  onClickCancel,
  onClickAccept,
  onClickDecline,
  isExpertRated,
  status,
  timeZone,
  amount,
  meetingId,
  expertPrimaryId,
  chatButtonDisabled,
  userName,
  userPic,
  expertPic,
  bookingUniqueId
}) => {
  const navigate = useNavigate();
  const { ratingBookingId, setRatingBookingId } = useContext(BookingContext);
  const isThisExpert = isExpert();
  const isThisAgency = isAgency();
  const isThisUser = isUser();
  
 
  console.log(startTime, "startTime");
  console.log(bookingUniqueId, "bookingUniqueId")

  return (
    <div className="booking_field active">
      <div className="daydate">
        <p>{day}</p>
        <h3>{date}</h3>
      </div>
      <div className="time">
        <img src={Time} alt="time" />
        {timeZone}
        <br />
        {startTime} - {endTime}
      </div>
     <div style={{display:"flex", flexDirection:"column"}}>
     <span style={{fontSize:"13px"}}>Booking Id</span>
     
      <span>{bookingUniqueId}</span>
     </div>
      {!isThisExpert && !isThisAgency && (
        <div className="profile-detail">
          <div>
            {expertPic && (
              <img src={`${AVATAR_BASE_URL}${expertPic}`} alt="img" />
            )}
            {!expertPic && <img src={Bookingimg} alt="img" />}
          </div>
          <div>
            <h4>{expertName}</h4>
            <p>{JobCategory}</p>
          </div>
        </div>
      )}
      {isThisExpert && (
        <div className="profile-detail">
          <div>
            {userPic && <img src={`${AVATAR_BASE_URL}${userPic}`} alt="img" />}
            {!userPic && <img src={Bookingimg} alt="img" />}
          </div>
          <div>
            <h4>{userName}</h4>
            {/* <p>{JobCategory}</p> */}
          </div>
        </div>
      )}
      {isThisAgency && (
        <div className="profile-detail">
          <div>
            {userPic && <img src={`${AVATAR_BASE_URL}${userPic}`} alt="img" />}
            {!userPic && <img src={Bookingimg} alt="img" />}
          </div>
          <div>
            <h4>{userName}</h4>
            {/* <p>{JobCategory}</p> */}
          </div>
        </div>
      )}
     {isThisUser &&  <div className="experience">
        <p>Experience</p>
        <h4>{experience} year</h4>
      </div>}
      <div className="action">
        {cancelButton && status !== "REQUESTED" && (
          <button
            className="btn_border"
            onClick={(e) => {
              e.stopPropagation();
              onClickCancel();
            }}
            variant="primary"
          >
            Cancel
          </button>
        )}
        {cancelButton && status === "REQUESTED" && isThisUser && (
          <button
            className="btn_border"
            onClick={(e) => {
              e.stopPropagation();
              onClickCancel();
            }}
            variant="primary"
          >
            Cancel
          </button>
        )}

        {isThisUser &&
          !isThisExpert & !isThisAgency &&
          status === "ACCEPTED" && (
            <button
              className="btn_bg"
              onClick={(e) => {
                //   e.stopPropagation();
                // //   onClickCancel();
                // makePayment(amount,meetingId)
                // navigate('/payment')
              }}
              variant="primary"
            >
              Pay
            </button>
          )}
        {isThisExpert && status === "ACCEPTED" && (
          <button className="btn_pending">{"Accepted"}</button>
        )}
        {isThisUser && status === "COMPLETED" && !isExpertRated && (
          <button
            className="btn_bg"
            onClick={(e) => {
              e.stopPropagation();
              setRatingBookingId(meetingId);
              navigate(`/rate/expert/${expertPrimaryId}`);
            }}
          >
            Rate
          </button>
        )}
        {isExpertRated && isThisUser && status === "COMPLETED" && (
          <button className="btn_success">{status}</button>
        )}
        {isThisAgency && status === "COMPLETED" && (
          <button className="btn_success">{status}</button>
        )}
        {isThisExpert && status === "COMPLETED" && (
          <button className="btn_success">{status}</button>
        )}
        {!isThisExpert && status === "ACCEPTED" && (
          <button
            className="btn_border"
            onClick={(e) => {
              e.stopPropagation();
              onClickCancel();
            }}
            variant="primary"
          >
            Cancel
          </button>
        )}
        {isThisExpert && status === "REQUESTED" && (
          <button
            className="btn_bg"
            onClick={(e) => {
              e.stopPropagation();
              onClickAccept();
            }}
          >
            Accept
          </button>
        )}
        {isThisAgency && status === "REQUESTED" && (
          <button
            className="btn_bg"
            onClick={(e) => {
              e.stopPropagation();
              onClickAccept();
            }}
          >
            Accept
          </button>
        )}
        {isThisExpert && status === "REQUESTED" && (
          <button
            className="btn_border"
            onClick={(e) => {
              e.stopPropagation();
              onClickDecline();
            }}
          >
            Decline
          </button>
        )}
        {isThisAgency && status === "REQUESTED" && (
          <button
            className="btn_border"
            onClick={(e) => {
              e.stopPropagation();
              onClickDecline();
            }}
          >
            Decline
          </button>
        )}
        {!cancelled && status === "CONFIRMED" && (
          <button
            className="btn_bg"
            disabled={chatButtonDisabled}
            onClick={(e) => {
              e.stopPropagation();
              onClickChat();
            }}
          >
            Chat
          </button>
        )}
        {status == "CANCELLED" && (
          <button className="btn_cancelled">{status}</button>
        )}
        {status == "DECLINED" && (
          <button className="btn_cancelled">{status}</button>
        )}
      </div>
    </div>
  );
};

export default BookingListItem;
