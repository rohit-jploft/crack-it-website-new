import "./../style.css";
import { useEffect, useState, useRef, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "./Header";
import Container from "react-bootstrap/Container";
import ExpertImg from "./../Images/default_avatar.png";
import Email from "./../Images/email.svg";
import Phone from "./../Images/phone-call.svg";
import RightArrow from "./../Images/Right_Arrow.svg";
import Logout2 from "./../Images/logout2.svg";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Edit from "./../Images/edit.svg";
import Cancelicon from "./../Images/cancel-icon.svg";
import Axios from "axios";
import { AVATAR_BASE_URL, BASE_URL } from "../constant";
import { setProfilePicture } from "../data/user";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ModelContext } from "../context/ModelContext";
import AvatarModel from "../components/AvatarModel";
import LogoutModal from "../components/LogoutModal";

const MyProfile = () => {
  const navigate = useNavigate();
  const { open, setOpen } = useContext(ModelContext);
  const [show, setShow] = useState(false);
  const [userdata, setUserData] = useState(false);
  const [profilePic, setProfilePic] = useState();
  const [isDone, setIsDone] = useState(false)
  const [showLogOutModal, setShowLogoutModal] = useState(false);
  const [recievedPic, setRecievedPic] = useState();
  const [profilePicUploadDone, setProfilePicUploadDone] = useState(false);
  const handleClose1 = () => setShow(false);
  const handleShow1 = () => setShow(true);
  const getUserData = async () => {
    const token = localStorage.getItem("token");
    const res = await Axios.get(`${BASE_URL}auth/user/detail`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(res, "userData response");

    if (res.data.data) {
      setUserData(res.data.data);
    }
  };
  const handleFileInputChange = async (e) => {
    const selectedFile = e.target.files[0];
    const userId = localStorage.getItem("userId");
    if (selectedFile) {
      const fileType = selectedFile.type;
      const acceptedTypes = ["image/*"];
      if (acceptedTypes.some((type) => fileType.match(type))) {
        // File type is valid, you can handle the file here
        console.log("Selected file:", selectedFile);
        setProfilePic(selectedFile);
        if (userId) {
          await setProfilePicture(userId, selectedFile)
            .then((res) => {
              console.log(res, "profile set response");
              if (res && res.status === 200 && res.success) {
                toast.success(res?.message);
                setProfilePicUploadDone(true);
              }
            })
            .catch((err) => console.log(err));
        }
      } else {
        // alert("Invalid file type. Please select an audio, PDF, or image file.");
        toast.error(
          "Invalid file type. Please select an audio, PDF, or image file."
        );
        // Clear the input to prevent further submission
        setProfilePic();
        fileInputRef.current.value = "";
      }
    }
  };
  useEffect(() => {
    getUserData();
    setIsDone(false)
  }, [profilePicUploadDone, isDone]);
  // set profile pic functions
  const fileInputRef = useRef(null);
  const handleIconClick = () => {
    // Trigger the file input when the icon is clicked
    fileInputRef.current.click();
  };

  return (
    <>
      <Header />
      <ToastContainer />
      <section className="">
        <AvatarModel show={open} handleClose={() => setOpen(false)} setIsDone={(value) => setIsDone(value)}/>
        <Container>
          <div className="main-content">
            <div className="job-categ">
              <div className="myprofile_field">
                <h3>My Profile</h3>
                <div className="expertprofile-detail">
                  <div className="expert-image">
                    <img
                      src={
                        userdata && userdata.profilePhoto
                          ? `${AVATAR_BASE_URL}${userdata.profilePhoto}`
                          : ExpertImg
                      }
                      alt="Img"
                    />
                    {/* <Button className='profile-img-edit' onClick=''><img src={Edit} alt="img" /></Button> */}
                    <button
                      type="button"
                      class="profile-img-edit btn btn-primary"
                      // onClick={handleIconClick}
                      onClick={() => setOpen(true)}
                    >
                      {/* <input
                      type="file"
                      // ref={fileInputRef}
                      // onChange={handleFileInputChange}
                      style={{ display: "none" }}
                    /> */}
                      <img
                        src="/static/media/edit.0543f4f52dca0cf68ddf82ec128fb432.svg"
                        alt="img"
                      />
                    </button>
                  </div>
                  <h2>
                    {userdata.firstName} {userdata.lastName}
                  </h2>
                  <p>User Experience & Motion Design</p>
                </div>
                <div className="user-details">
                  <div className="row">
                    <div className="col-md-6 text-center">
                      <div
                        className="usersubdetail b-rgt"
                        onClick={() =>
                          (window.location.href = `mailto:${userdata?.email}`)
                        }
                        style={{ cursor: "pointer" }}
                      >
                        <img src={Email} alt="img" />
                        <p>{userdata.email}</p>
                      </div>
                    </div>
                    <div className="col-md-6 text-center">
                      <div
                        className="usersubdetail"
                        onClick={() =>
                          (window.location.href = `tel:${userdata?.phone}`)
                        }
                        style={{ cursor: "pointer" }}
                      >
                        <img src={Phone} alt="img" />
                        <p>
                          {userdata.countryCode} {userdata?.phone}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="expert-descrip">
                  <h2>Description</h2>
                  <p>
                    It is a long established fact that a reader will be
                    distracted by the readable content of a page when looking at
                    its layout. The point of using Lorem Ipsum is that it has a
                    more-or-less normal distribution of letters,
                  </p>
                </div>
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
                <div
                  className="text-center logout"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setShowLogoutModal(true)
                  }}
                >
                  <img src={Logout2} alt="img" /> Logout
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
      <LogoutModal
        open={showLogOutModal}
        handleClose={() => setShowLogoutModal(false)}
        logOut={() => {
          const role = localStorage.getItem("role")
          localStorage.removeItem("token");
          localStorage.removeItem("userId");
          localStorage.removeItem("role");
          if(role==='AGENCY'){
            navigate("/agency/login");
          } else {
            navigate("/login");
          }
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

export default MyProfile;
