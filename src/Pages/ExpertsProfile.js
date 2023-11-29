import "./../style.css";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import Header from "./Header";
import Container from "react-bootstrap/Container";
import ExpertImg from "./../Images/default_avatar.png";
import Star from "./../Images/star.svg";
import { getAgencyProfile, getExpertProfile } from "../data/experts";
import { BookingContext } from "../context/bookingContext";
import { createBooking } from "../data/booking";
import { convertTimeToJsDate } from "../helper/helper";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import RightArrow from "./../Images/Right_Arrow.svg";
import Logout2 from "./../Images/logout2.svg";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Edit from "./../Images/edit.svg";
import Cancelicon from "./../Images/cancel-icon.svg";
import { AVATAR_BASE_URL, BASE_URL } from "../constant";
import LogoutModal from "../components/LogoutModal";
const ExpertsProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [showLogOutModal, setShowLogoutModal] = useState(false);
  const handleClose1 = () => setShow(false);
  const handleShow1 = () => setShow(true);
  const loggedUserId = localStorage.getItem("userId");
  const role = localStorage.getItem("role");

  const { getReqData, time } = useContext(BookingContext);
  const [profileData, setProfileData] = useState();

  const getExpertData = async () => {
    const data =
      role === "EXPERT"
        ? await getExpertProfile(userId ? userId : loggedUserId)
        : await getAgencyProfile(userId ? userId : loggedUserId);
    setProfileData(data.data);
    console.log(data, "profile data");
  };
  const onBookingExperts = async (e) => {
    e.preventDefault();

    const loggedUserId = localStorage.getItem("userId");
    await createBooking({
      ...getReqData,
      startTime: time + ":00",
      user: loggedUserId,
      expert: userId,
    })
      .then((result) => {
        if (result && result.status === 200 && result.message) {
          toast(result.message, { type: "success" });
        }
        if (result && result.status === 203 && result.type === "error") {
          toast(result.message, { type: "error" });
        }
        console.log(result);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    getExpertData();
  }, []);
  return (
    <>
      <Header />
      <ToastContainer />
      <section className="">
        <Container>
          <div className="main-content">
            <div className="job-categ">
              <div className="expertprofile_field">
                <h3>Profile</h3>
                <div className="expertprofile-detail">
                  <div className="expert-image">
                    <img
                      src={
                        role === "AGENCY" ? profileData && profileData?.expert && profileData?.expert?.agency && profileData?.expert?.agency?.profilePhoto
                        ? `${AVATAR_BASE_URL}${profileData?.expert?.agency?.profilePhoto}`
                        : ExpertImg : profileData && profileData?.expert && profileData?.expert?.user && profileData?.expert?.user?.profilePhoto
                        ? `${AVATAR_BASE_URL}${profileData?.expert?.user?.profilePhoto}`
                        : ExpertImg
                      }
                      alt="Img"
                    />
                  </div>
                  <h2>
                    {role === "EXPERT" && profileData?.expert.user.firstName}{" "}
                    {role === "EXPERT" && profileData?.expert?.user?.lastName}
                    {role === "AGENCY" &&
                      profileData?.expert?.agency?.agencyName}
                    {/* {role === 'AGENCY' && profileData?.} */}
                  </h2>
                  <p>{profileData?.expert?.jobCategory?.title}</p>
                </div>
                <div className="expertise">
                  <div>
                    <h3>
                      <img className="star-img" src={Star} alt="img" />
                      {profileData?.rating}
                    </h3>
                    <p>Star Level</p>
                  </div>
                  <div>
                    <h3>{profileData?.expert?.jobCategory?.title}</h3>
                    <p>Expertise</p>
                  </div>
                  <div>
                    <h3>{profileData?.expert?.experience}yrs</h3>
                    <p>Experience</p>
                  </div>
                </div>
                <div className="expert-descrip">
                  <h2>Description</h2>
                  <p>{profileData?.expert?.description}</p>
                </div>
                <div className="expert-expertise">
                  <div className="row">
                    <div className="col-md-7">
                      <h2>Expertise</h2>
                      <div className="expert-tech">
                        {profileData?.expert?.expertise.length > 0 &&
                          profileData?.expert?.expertise.map((skill) => {
                            return (
                              <div className="tech-sub">{skill?.title}</div>
                            );
                          })}
                      </div>
                    </div>
                    <div className="col-md-5">
                      <h2>Language</h2>
                      <div className="expert-tech">
                        {profileData?.expert?.languages?.length > 0 &&
                          profileData?.expert?.languages.map((language) => {
                            return <div className="tech-sub">{language}</div>;
                          })}
                      </div>
                    </div>
                  </div>
                </div>
                {role !== "AGENCY" && (
                  <div className="expert-price">
                    <h4>
                      ${profileData?.expert?.price}
                      <span>/ hr</span>
                    </h4>
                  </div>
                )}
                {role === "AGENCY" &&
                  profileData?.expert.agency._id.toString() ===
                    loggedUserId?.toString() && (
                    <div className="text-center">
                      {/* <Link to="/Wallet"> */}

                      <button
                        onClick={() => navigate("/edit/agency/Myprofile")}
                        className="btn_continue"
                        style={{ width: "300px", height: "40px" }}
                      >
                        EDIT
                      </button>

                      {/* </Link> */}
                    </div>
                  )}
                {role === "EXPERT" &&
                  profileData?.expert.user._id.toString() ===
                    loggedUserId?.toString() && (
                    <div className="text-center">
                      {/* <Link to="/Wallet"> */}

                      <button
                        onClick={() => navigate("/edit/Myprofile")}
                        className="btn_continue"
                        style={{ width: "300px", height: "40px" }}
                      >
                        EDIT
                      </button>

                      {/* </Link> */}
                    </div>
                  )}
                {userId && (
                  <div className="text-center">
                    {/* <Link to="/Wallet"> */}

                    <button
                      onClick={(e) => onBookingExperts(e)}
                      className="btn_continue"
                    >
                      REQUEST
                    </button>

                    {/* </Link> */}
                  </div>
                )}
                {!userId && (
                  <div className="expert-actions">
                    <Button
                      className="profile-action"
                      onClick={() => navigate("/mybookings/Past")}
                    >
                      Booking History <img src={RightArrow} alt="img" />
                    </Button>
                    <Button className="profile-action" onClick={handleShow1}>
                      Delete Account <img src={RightArrow} alt="img" />
                    </Button>
                  </div>
                )}
                {!userId && (
                  <div
                    className="text-center logout"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setShowLogoutModal(true)
                    }}
                  >
                    <img src={Logout2} alt="img" /> Logout
                  </div>
                )}
              </div>
            </div>
          </div>
        </Container>
      </section>
      <LogoutModal
        open={showLogOutModal}
        handleClose={() => setShowLogoutModal(false)}
        logOut={() => {
          localStorage.removeItem("token");
          localStorage.removeItem("userId");
          localStorage.removeItem("role");
          navigate("/login");
        }}
      />
      <Modal show={show} onHide={handleClose1} className="cancel_modal">
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          <img src={Cancelicon} alt="img" />
          <Modal.Title>
            Are you sure you want to delete this account?
          </Modal.Title>
          <Button className="no-btn" onClick={handleClose1}>
            No
          </Button>
          <Button className="yes-btn" onClick={handleClose1}>
            Yes
          </Button>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ExpertsProfile;
