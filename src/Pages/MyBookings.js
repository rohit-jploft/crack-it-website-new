import "./../style.css";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Header from "./Header";
import Container from "react-bootstrap/Container";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Time from "./../Images/time.svg";
import Bookingimg from "./../Images/booking-img.svg";
import Bookingimg2 from "./../Images/booking-img2.svg";
import Cancelicon from "./../Images/cancel-icon.svg";
import { ToastContainer, toast } from "react-toastify";
import BookingListItem from "../components/BookingListItem";
import { getAllmeetings } from "../data/booking";
import { getDayName, getTimeFromTimestamps } from "../helper/helper";
import { BASE_URL, VAPID_KEY } from "../constant";
import "react-toastify/dist/ReactToastify.css";
import Axios from "axios";
import { isExpert } from "../utils/authHelper";
import { UserContext } from "../context/userContext";
import { subscribeToNotifications } from "../helper/notification";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { messaging } from "../firebase/firebase";
import { getChatIdFromMeeting } from "../data/chat";

let tab = ["REQUESTED", "Upcoming", "Past"];
const isThisExpert = isExpert();
if (isThisExpert) {
  tab = ["New", "Upcoming", "Past", "hjg"];
}

const MyBookings = () => {
  const { isExpertVerified, setExpertVerified } = useContext(UserContext);
  const [tabArray, setTabArray] = useState(["Requested", "Upcoming", "Past"]);
  const navigate = useNavigate();
  const { tabKey } = useParams();
  const [show, setShow] = useState(false);
  const [bookingCancelId, setBookingCancelId] = useState();
  const [cancelDone, setCancelDone] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [meetingData, setMeetingData] = useState([]);

  const [key, setKey] = useState(tabKey ? tabKey : "Upcoming");
  const getData = async () => {
    const res = await getAllmeetings(key);
    console.log(res, "meetings");
    setMeetingData(res.data);
  };

  useEffect(() => {
    if (isThisExpert) {
      setTabArray(["Requested", "Upcoming", "Past"]);
    }
  }, []);
  useEffect(() => {
    setCancelDone(false);
    getData();
  }, [key, cancelDone]);

  const cancelBooking = async (bookingId) => {
    const role = localStorage.getItem('role')
    const cancel = await Axios.put(`${BASE_URL}booking/cancel/${bookingId}?role=${role}`);
    console.log(cancel);
    if (cancel && cancel?.data?.status === 200) {
      toast.success(cancel.data.message);
      setCancelDone(true);
      handleClose();
    }
    if(cancel && cancel?.data.status === 201){
      toast.error(cancel.data.message)
    }
  };
  const AcceptBooking = async (bookingId) => {
    const accept = await Axios.put(`${BASE_URL}booking/accept/${bookingId}`);
    console.log(accept);
    if (accept && accept?.data?.status === 200) {
      toast.success(accept.data.message);
      setCancelDone(true);
      handleClose();
    }
  };
  const declineBooking = async (bookingId) => {
    const accept = await Axios.put(`${BASE_URL}booking/decline/${bookingId}`);
    console.log(accept);
    if (accept && accept?.data?.status === 200) {
      toast.success(accept.data.message);
      setCancelDone(true);
      handleClose();
    }
  };

  const getDeviceToken = async () => {
    await getToken(messaging, { vapidKey: VAPID_KEY })
      .then((token) => {
        console.log(token);
      })
      .catch((err) => console.log(err));
  };
  useEffect(() => {
    getDeviceToken();
  }, []);


  const clickChatRedirect = async (bookingId) => {
    const role = localStorage.getItem("role");
    
    if (role !== "AGENCY") {
      const res = await getChatIdFromMeeting(bookingId);
      console.log(res);
      if(res && !res.success){
        toast.error(res.message)
      }
      if (res && res.data && res.data.chat) {
        console.log(res.data.chat);
        navigate(`/chat/${res.data.chat}`);
      }
      if (res && res.status === 200 && res.message) {
        toast.success(res.message);
        navigate(`/chat/${res.data.chat}`);
      }
    }
  };
  return (
    <>
      <Header />
      <ToastContainer />
      <section className="">
        <Container>
          <div className="main-content">
            <h2>My Bookings</h2>
            <p>See your scheduled meetings from your calendar</p>
            <Tabs
              defaultActiveKey="profile"
              id="uncontrolled-tab-example"
              className="bookings_tabs"
              activeKey={key}
              onSelect={(k) => setKey(k)}
            >
              {tabArray?.map((item, index) => {
                return (
                  <Tab eventKey={item} key={index} title={item}>
                    {meetingData?.map((meet) => {
                      console.log(meetingData.length, "length meeting");
                      return (
                        <div
                          onClick={() => navigate(`/bookingInfo/${meet._id}`)}
                          style={{ cursor: "pointer" }}
                          key={meet._id}
                        >
                          <BookingListItem
                            date={new Date(meet.date).getDate()}
                            JobCategory={meet.jobCategory.title}
                            day={getDayName(new Date(meet.date).getDay())}
                            expertName={`${meet?.expert?.firstName} ${meet?.expert?.lastName} `}
                            startTime={getTimeFromTimestamps(meet.startTime)}
                            endTime={getTimeFromTimestamps(meet.endTime)}
                            experience={meet?.expertData?.experience}
                            cancelled={meet.status === "CANCELLED"}
                            cancelButton={meet.status === "REQUESTED"}
                            status={meet.status}
                            expertPrimaryId={meet?.expert?._id}
                            onClickChat={() => clickChatRedirect(meet?._id)}
                            onClickCancel={() => {
                              setBookingCancelId(meet?._id);
                              handleShow();
                            }}
                            onClickDecline={() => {
                              declineBooking(meet?._id);
                              handleShow();
                            }}
                            onClickAccept={() => {
                              AcceptBooking(meet?._id);
                            }}
                            amount={meet?.PaymentData?.totalAmount}
                            meetingId={meet._id}
                          />
                        </div>
                      );
                    })}
                  </Tab>
                );
              })}
            </Tabs>
          </div>
        </Container>
      </section>
      <Modal show={show} onHide={handleClose} className="cancel_modal">
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          <img src={Cancelicon} alt="img" />
          <Modal.Title>Are you sure to cancel the booking</Modal.Title>
          <p>
            It will refund 50% amount of the booking and 50% penalty when you
            cancel it within 24 hours.<br></br>
            If the cancel before 4 hours of the meeting then you will get 25%
            amount of the booking Refund amount will be credited into your
            wallet and you can use it to booking next booking.
          </p>
          <Button className="no-btn" onClick={handleClose}>
            No
          </Button>
          <Button
            className="yes-btn"
            onClick={() => cancelBooking(bookingCancelId)}
          >
            Yes
          </Button>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default MyBookings;
