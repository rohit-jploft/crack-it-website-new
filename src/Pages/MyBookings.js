import "./../style.css";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Header from "./Header";
import Container from "react-bootstrap/Container";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Register from "./../Images/register.svg";
import Rstar from "./../Images/star-n.svg";
import Manicon from "./../Images/man-icon.svg";
import Femaleicon from "./../Images/female-icon.svg";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Time from "./../Images/time.svg";
import Bookingimg from "./../Images/booking-img.svg";
import Bookingimg2 from "./../Images/booking-img2.svg";
import Cancelicon from "./../Images/cancel-icon.svg";
import { ToastContainer, toast } from "react-toastify";
import BookingListItem from "../components/BookingListItem";
import { getAllmeetings, getUserDashboardData } from "../data/booking";
import {
  convertDateStampToTimeZone,
  getDayName,
  getTimeFromTimestamps,
} from "../helper/helper";
import { BASE_URL, VAPID_KEY } from "../constant";
import "react-toastify/dist/ReactToastify.css";
import Axios from "axios";
import { isExpert } from "../utils/authHelper";
import { UserContext } from "../context/userContext";
import { subscribeToNotifications } from "../helper/notification";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { messaging } from "../firebase/firebase";
import { getChatIdFromMeeting } from "../data/chat";
import { Col, Row } from "react-bootstrap";

import MyChartComponent from "../components/MyChartComponent";
import CancelPopUp from "../components/CancelPopUp";
import JoyRideComponent from "../components/JoyRide";
import Loader from "../components/Loader";

let tab = ["REQUESTED", "Upcoming", "Past"];
const isThisExpert = isExpert();
if (isThisExpert) {
  tab = ["New", "Upcoming", "Past", "hjg"];
}

const MyBookings = () => {
  const { isExpertVerified, setExpertVerified, setIsFirstBookingDone } =
    useContext(UserContext);
  const [showtour, setShowTour] = useState(true);
  const [cancelReason, setReason] = useState("");
  const [comment, setComment] = useState("");

  const userRole = localStorage.getItem("role");
  const [tabArray, setTabArray] = useState(
    userRole === "USER"
      ? ["Requested", "Upcoming", "Past"]
      : ["New", "Upcoming", "Past"]
  );
  const navigate = useNavigate();
  const { tabKey } = useParams();
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showDecline, setShowDecline] = useState(false);
  const [disableButton, setDisableButton] = useState(false);
  const [bookingCancelId, setBookingCancelId] = useState();
  const [bookingDeclineId, setBookingDeclineId] = useState();
  const [cancelDone, setCancelDone] = useState(false);
  const [limit, setLimit] = useState(10);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [meetingData, setMeetingData] = useState([]);
  const [totalCount, setTotalCount] = useState([]);
  const [showCancelReasonPopUp, setShowCancelReasonPopUp] = useState(false);
  const [dashboardData, setdaahboardData] = useState({
    totalUser: 0,
    totalMeeting: 0,
    totalExperts: 0,
    monthlyMeetings: [],
  });
  const [expertList, setExpertList] = useState([]);

  const [key, setKey] = useState(tabKey ? tabKey : "Upcoming");
  const getData = async () => {
    const res = await getAllmeetings(key === "New" ? "Requested" : key, limit);
    console.log(res, "meetings");
    setMeetingData(res.data);
    setTotalCount(res?.pagination?.totalCount);
  };

  useEffect(() => {
    if (isThisExpert) {
      setTabArray(["New", "Upcoming", "Past"]);
    }
  }, []);
  const showBookingGuide = localStorage.getItem("showBookingGuide");
  useEffect(() => {
    console.log("Key", key);
    setCancelDone(false);
    getData();
  }, [key, cancelDone, limit]);

  const cancelBooking = async (bookingId, reason, comment) => {
    const role = localStorage.getItem("role");
    console.log(reason, "reason");
    const cancel = await Axios.put(
      `${BASE_URL}booking/cancel/${bookingId}?role=${role}`,
      { reason, comment }
    );
    console.log(cancel);
    if (cancel && cancel?.data?.status === 200) {
      if (!cancel.data.success) {
        toast.error(cancel.data.message);
      } else {
        toast.success(cancel.data.message);
        setCancelDone(true);
        handleClose();
      }
    }
    if (cancel && cancel?.data.status === 201) {
      toast.error(cancel.data.message);
      handleClose();
    }
  };
  const AcceptBooking = async (bookingId) => {
    setIsLoading(true);
    const accept = await Axios.put(`${BASE_URL}booking/accept/${bookingId}`);
    console.log(accept);
    if (accept && accept?.data?.status === 200) {
      if (!accept?.data?.success) {
        toast.error(accept?.data?.message);
        setCancelDone(true);
        handleClose();
        setIsLoading(false);
      } else {
        toast.success(accept.data.message);
        setCancelDone(true);
        handleClose();
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  };
  const declineBooking = async (bookingId) => {
    const accept = await Axios.put(`${BASE_URL}booking/decline/${bookingId}`);
    console.log(accept);
    if (accept && accept?.data?.status === 200) {
      toast.success(accept.data.message);
      setCancelDone(true);
      setShowDecline(false);
    } else {
      toast.error("Something went wrong");
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

      if (res && res.data && res.data.chat) {
        console.log(res.data.chat);
        navigate(`/chat/${res.data.chat}`);
      }
      if (res && res.status === 200 && res.message) {
        if (res.success) {
          toast.success(res.message, { autoClose: 1500 });
          setDisableButton(true);
          setTimeout(() => {
            setDisableButton(false);
          }, 2000);
        } else {
          toast.error(res.message, { autoClose: 1500 });
          setDisableButton(true);
          setTimeout(() => {
            setDisableButton(false);
          }, 2000);
        }
        if (res && res?.data && res?.data?.chat) {
          navigate(`/chat/${res?.data?.chat}`);
        }
      }
    }
  };
  console.log(typeof dashboardData?.monthlyMeetings, "arrType");
  const isThisUser = localStorage.getItem("role");
  console.log(meetingData, "meeting");

  return (
    <>
      <Header />

      <ToastContainer />
      <Loader
        open={isLoading}
        title={"Accepting Request....."}
        handleClose={() => setIsLoading(false)}
      />
      <section className="">
        <Container>
          <div className="main-content">
            {/* {isThisUser === "USER" && <h2>Dashboard</h2>}
            {isThisUser === "USER" && (
              <Row>
                <Col md={8}>
                  <div className="graf">
                    <MyChartComponent data={dashboardData?.monthlyMeetings} />
                  </div>
                </Col>
                <Col md={4}>
                  <div className="dash-box">
                    <h2>{dashboardData?.totalUser}</h2>
                    <p>Total Users this Month</p>
                  </div>
                  <div className="dash-box">
                    <h2>{dashboardData?.totalMeeting}</h2>
                    <p>Total Meeting this Month</p>
                  </div>
                  <div className="dash-box">
                    <h2>{dashboardData?.totalExperts}</h2>
                    <p>Total Experts</p>
                  </div>
                </Col>
              </Row>
            )}
            {isThisUser === "USER" && (
              <h2 className="section-title">
                Our Top Experts{" "}
                <Link to="/view/all/experts">View all Experts</Link>
              </h2>
            )}
            {isThisUser === "USER" && (
              <div className="box-experts mb-5">
                {expertList.length > 0 &&
                  expertList.map((exp) => {
                    return (
                      <div className="experts-box">
                        <img className="img-fluid" src={Manicon} />
                        <h3>{`${exp.user.firstName} ${exp.user.lastName}`}</h3>
                        <p>{exp.jobCategory.title}</p>
                        <span>
                          <img src={Rstar} /> {exp.rating}/5
                        </span>
                      </div>
                    );
                  })}
              </div>
            )} */}

            <h2>My Bookings</h2>
            <p>See your scheduled meetings from your calendar</p>
            <Tabs
              defaultActiveKey="profile"
              id="uncontrolled-tab-example"
              className="bookings_tabs"
              activeKey={key}
              onSelect={(k) => {
                console.log("setKey(k)", k);
                setKey(k);
              }}
            >
              {tabArray?.map((item, index) => {
                return (
                  <Tab eventKey={item} key={index} title={item}>
                    {meetingData?.map((meet) => {
                      console.log(meet, "meet");
                      return (
                        <div
                          onClick={() => navigate(`/bookingInfo/${meet._id}`)}
                          style={{ cursor: "pointer" }}
                          key={meet._id}
                        >
                          {console.log(meet, "meet")}

                          <BookingListItem
                            date={new Date(meet.date).getDate()}
                            JobCategory={meet.jobCategory.title}
                            day={getDayName(new Date(meet.date).getDay())}
                            expertName={`${meet?.expert?.firstName} ${meet?.expert?.lastName} `}
                            userName={`${meet?.user?.firstName} ${meet?.user?.lastName} `}
                            expertPic={meet?.expert?.profilePhoto}
                            userPic={meet?.user?.profilePhoto}
                            startTime={getTimeFromTimestamps(meet.startTime)}
                            endTime={getTimeFromTimestamps(meet.endTime)}
                            timeZone={meet.timeZone}
                            experience={meet?.expertData?.experience}
                            cancelled={meet.status === "CANCELLED"}
                            bookingUniqueId={meet?.bookingId}
                            cancelButton={
                              meet.status === "REQUESTED" ||
                              meet.status === "CONFIRMED"
                            }
                            status={meet.status}
                            expertPrimaryId={meet?.expert?._id}
                            onClickChat={() => clickChatRedirect(meet?._id)}
                            chatButtonDisabled={disableButton}
                            onClickCancel={() => {
                              setBookingCancelId(meet?._id);
                              handleShow();
                            }}
                            onClickDecline={() => {
                              // declineBooking(meet?._id);
                              setBookingDeclineId(meet?._id);
                              setShowDecline(true);
                            }}
                            isExpertRated={meet?.isExpertRated}
                            onClickAccept={() => {
                              AcceptBooking(meet?._id);
                            }}
                            amount={meet?.PaymentData?.totalAmount}
                            meetingId={meet._id}
                          />
                        </div>
                      );
                    })}
                    {meetingData?.length === 0 && (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                        className="no_chat"
                      >
                        You have no meetings
                      </div>
                    )}
                    {limit < totalCount && (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          cursor: "pointer",
                        }}
                        onClick={() => setLimit(limit + 10)}
                      >
                        <span
                          style={{ textDecoration: "underline", color: "grey" }}
                        >
                          Load more
                        </span>
                      </div>
                    )}
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
          <Modal.Title>Are you sure to Cancel the booking</Modal.Title>
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
            onClick={() => {
              setShowCancelReasonPopUp(true);
              handleClose();
            }}
          >
            Yes
          </Button>
        </Modal.Body>
      </Modal>
      <Modal
        show={showDecline}
        onHide={() => setShowDecline(false)}
        className="cancel_modal"
      >
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          <img src={Cancelicon} alt="img" />
          <Modal.Title>Are you sure to Decline the booking</Modal.Title>
          {/* <p>
            It will refund 50% amount of the booking and 50% penalty when you
            cancel it within 24 hours.<br></br>
            If the cancel before 4 hours of the meeting then you will get 25%
            amount of the booking Refund amount will be credited into your
            wallet and you can use it to booking next booking.
          </p> */}
          <Button className="no-btn" onClick={() => setShowDecline(false)}>
            No
          </Button>
          <Button
            className="yes-btn"
            onClick={() => declineBooking(bookingDeclineId)}
          >
            Yes
          </Button>
        </Modal.Body>
      </Modal>
      <CancelPopUp
        show={showCancelReasonPopUp}
        cancelBooking={(reason, comment) =>
          cancelBooking(bookingCancelId, reason, comment)
        }
        setReason={(value) => setReason(value)}
        handleClose={() => setShowCancelReasonPopUp(false)}
        setComment={(value) => setComment(value)}
      />

      {isThisUser === "USER" && showBookingGuide == "true" && (
        <JoyRideComponent
          steps={[
            {
              disableBeacon: true,
              target: ".btn_login",
              content: "Book Meeting With Expert",
            },
          ]}
        />
      )}
    </>
  );
};

export default MyBookings;
