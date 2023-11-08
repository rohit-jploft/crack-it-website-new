import "./../style.css";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Header from "./Header";
import Container from "react-bootstrap/Container";
import ExpertImg from "./../Images/expert-img.svg";
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
import { BASE_URL } from "../constant";
const AgencyExpertProfile = () => {
  const { agencyExpertUserId } = useParams();
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const handleClose1 = () => setShow(false);
  const handleShow1 = () => setShow(true);
  const role = localStorage.getItem("role");

  const { getReqData, time } = useContext(BookingContext);
  const [profileData, setProfileData] = useState();

  const getExpertData = async () => {
    const data = await getExpertProfile(agencyExpertUserId)
  
    setProfileData(data.data);
    console.log(data, "profile data");
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
                    <img src={profileData?.expert.user.profilePhoto ? `${BASE_URL}${profileData?.expert.user.profilePhoto}`: ExpertImg} alt="Img" />
                  </div>
                  <h2>
                    { profileData?.expert.user.firstName}{" "}
                    { profileData?.expert?.user?.lastName}
                   
                  </h2>
                  <p>{profileData?.expert.jobCategory.title}</p>
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
                    <h3>{profileData?.expert.jobCategory.title}</h3>
                    <p>Expertise</p>
                  </div>
                  <div>
                    <h3>{profileData?.expert.experience}yrs</h3>
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
                        {profileData?.expert?.languages.length > 0 &&
                          profileData?.expert?.languages.map((language) => {
                            return <div className="tech-sub">{language}</div>;
                          })}
                      </div>
                    </div>
                  </div>
                </div>
                
                  <div className="expert-price">
                    <h4>
                      ${profileData?.expert?.price}
                      <span>/ hr</span>
                    </h4>
                  </div>
     
                
              </div>
            </div>
          </div>
        </Container>
      </section>
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

export default AgencyExpertProfile;
