import { Outlet, Link, useNavigate, redirect } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Badge from "@mui/material/Badge";

import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Logo from "./../Images/logo.png";
import Notification from "./../Images/notification.svg";
import Profile from "./../Images/profile.svg";
import Bookings from "./../Images/booking.svg";
import WalletIcon from "./../Images/wallet.svg";
import WalletIcon1 from "./../Images/wallet-1.svg";
import Message1 from "./../Images/message.svg";
import Changepassword from "./../Images/password.svg";
import Money from "./../Images/money.svg";
import Chats from "./../Images/message.svg";
import Logout from "./../Images/logout.svg";
import ProfileH from "./../Images/default_avatar.png";
import DownArrow from "./../Images/down_Arrow.svg";
import Axios from "axios";
import { AVATAR_BASE_URL, BASE_URL } from "../constant";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/userContext";
import { isUser } from "../utils/authHelper";
import { format } from "timeago.js";
import { NotificationType } from "../utils/NotificationType";
import { getChatIdFromMeeting } from "../data/chat";
import { ToastContainer, toast } from "react-toastify";
import { Avatar } from "@mui/material";
import LogoutModal from "../components/LogoutModal";
const Header = () => {
  const navigate = useNavigate();
  const { profileData, setProfileData } = useContext(UserContext);
  const [userNotificationData, setuserNotificationData] = useState();
  const [showLogOutModal, setShowLogoutModal] = useState();
  const [pageNo, setPageNo] = useState(10);
  const [totalCount, setTotalCount] = useState();
  const [unReadCount, setUnReadCount] = useState();
  const getUserData = async () => {
    const token = localStorage.getItem("token");
    const res = await Axios.get(`${BASE_URL}auth/user/detail`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (res && res.data.data) {
      setProfileData(res.data.data);
    }
  };

  const getAllNotificationOfUser = async () => {
    const userId = localStorage.getItem("userId");
    try {
      const res = await Axios.get(
        `${BASE_URL}notification/get-all/${userId}?limit=${pageNo}`
      );
      console.log(res?.data, "noti adtaata");
      setuserNotificationData(res?.data?.data?.data);
      setTotalCount(res?.data?.pagination?.totalCount);
      setUnReadCount(res?.data?.data?.unReadCount);
      return res;
    } catch (error) {
      return error;
    }
  };
  useEffect(() => {
    getUserData();
    getAllNotificationOfUser();
  }, [pageNo]);
  const loadMoreNotication = () => {
    console.log("inittal page count", pageNo);
    setPageNo(pageNo + 5);
  };
  const isTheUser = isUser();
  const role = localStorage.getItem("role");
  console.log(isTheUser, " isTheUser");
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
          toast.success(res.message);
        } else {
          toast.error(res.message);
        }
        if (res && res?.data && res?.data?.chat) {
          navigate(`/chat/${res?.data?.chat}`);
        }
      }
    }
  };
  const redirectThroughNotification = async (
    notiId,
    data,
    isRead,
    type,
    title
  ) => {
    console.log(notiId, "noti id");
    if (!isRead) {
      const res = await Axios.put(`${BASE_URL}notification/read/${notiId}`);
    }
    if (type === NotificationType.Booking) {
      navigate(`/bookingInfo/${data.targetId}`);
    }
    if (type === NotificationType.Chat && title === "New Message") {
      navigate(`/chat/${data.targetId}`);
    }
    if (type === NotificationType.Chat && title !== "New Message") {
      await clickChatRedirect(data.targetId);
      // navigate(`/chat/${data.targetId}`);
    }
    if (type === NotificationType.Withdrawal) {
      navigate(`/wallet`);
    }
    // if(type)
  };
  const logoutFun = async () => {
    const userId = localStorage.getItem("userId");
    const log = await Axios.put(`${BASE_URL}auth/user/logout/${userId}`);

  };

  return (
    <>
      <ToastContainer />
      <Navbar
        expand="lg"
        className={`nav_sect ${isTheUser ? "nav_wrapper_user" : ""}`}
      >
        <Container>
          <Navbar.Brand href="/mybookings">
            <div className="brand-logo">
              <img src={Logo} alt="Logo" />
            </div>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              {isTheUser && (
                <Nav.Link href="/JobCategory" className="button_user">
                  <button
                    className="btn_login"
                    style={{ zIndex: 999, position: "relative" }}
                  >
                    BOOK NOW
                  </button>
                </Nav.Link>
              )}
              <NavDropdown
                title={
                  <Badge badgeContent={unReadCount} color="error">
                    <img src={Notification} alt="Logo" />
                  </Badge>
                }
                id="notifiaction-dropdown"
                className="notification-menu"
              >
                {userNotificationData &&
                  userNotificationData.map((noti) => {
                    return (
                      <NavDropdown.Item
                        style={{
                          backgroundColor: noti?.isRead ? "white" : "#D3D3D3",
                          overflowY: "auto",
                          height: "40%",
                        }}
                      >
                        <div
                          className="notif_msg"
                          onClick={() =>
                            redirectThroughNotification(
                              noti?._id,
                              noti?.data,
                              noti?.isRead,
                              noti?.type,
                              noti?.title
                            )
                          }
                        >
                          <div>
                            <h3>{noti?.title}</h3>
                            <p>{noti?.message}</p>
                          </div>
                          <div>
                            <h6>{format(noti?.createdAt)}</h6>
                          </div>
                        </div>
                      </NavDropdown.Item>
                    );
                  })}
                {userNotificationData && userNotificationData.length === 0 && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {" "}
                    <span style={{ textAlign: "center" }}>
                      No notification{" "}
                    </span>
                  </div>
                )}
                {totalCount > pageNo && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{ textAlign: "center", cursor: "pointer" }}
                      onClick={() => loadMoreNotication()}
                    >
                      Load more
                    </span>
                  </div>
                )}
              </NavDropdown>
              <NavDropdown
                title={
                  <div className="pull-left">
                    {profileData?.firstName} {profileData?.lastName}
                    {role === "AGENCY" && profileData?.agencyName}
                    {/* {profileData?.role} */}
                    <img
                      className="profile-drop-img"
                      src={
                        profileData && profileData.profilePhoto
                          ? `${AVATAR_BASE_URL}${profileData.profilePhoto}`
                          : ProfileH
                      }
                      alt="user pic"
                    />
                    <img className="arrow-drop-img" src={DownArrow} alt="" />
                  </div>
                }
                id="basic-nav-dropdown"
                className="profile_menu"
              >
                {role === "AGENCY" && (
                  <NavDropdown.Item href="/agency/Myprofile">
                    <img src={Profile} alt="" />
                    Profile
                  </NavDropdown.Item>
                )}
                {role === "EXPERT" && (
                  <NavDropdown.Item href="/Myprofile">
                    <img src={Profile} alt="" />
                    Profile
                  </NavDropdown.Item>
                )}
                {role === "USER" && (
                  <NavDropdown.Item href="/Myprofile">
                    <img src={Profile} alt="" />
                    Profile
                  </NavDropdown.Item>
                )}
                {role === "USER" && (
                  <NavDropdown.Item href="/user/dashboard">
                    <img src={Bookings} alt="" />
                    Dashboard
                  </NavDropdown.Item>
                )}
                {role === "AGENCY" && (
                  <NavDropdown.Item href="/agency/experts/all">
                    <img src={Profile} alt="" />
                    All Experts
                  </NavDropdown.Item>
                )}
                {role !== "AGENCY" && (
                  <NavDropdown.Item href="/Mybookings">
                    <img src={Bookings} alt="" />
                    Bookings
                  </NavDropdown.Item>
                )}
                <NavDropdown.Item href="/wallet">
                  <img src={WalletIcon1} alt="" />
                  Wallet
                </NavDropdown.Item>
                <NavDropdown.Item href="/Chat">
                  <img src={Message1} alt="" />
                  Chats
                </NavDropdown.Item>
                <NavDropdown.Item href="/ticket/view/all">
                  <img src={Message1} alt="" />
                  All Tickets
                </NavDropdown.Item>
                <NavDropdown.Item href="/change-password">
                  <img src={Changepassword} alt="" />
                  Change Password
                </NavDropdown.Item>
                <NavDropdown.Item href="/refer/earn">
                  <img src={Money} alt="" />
                  Refer & Earn
                </NavDropdown.Item>
                <NavDropdown.Item
                  onClick={() => {
                    setShowLogoutModal(true);
                    // localStorage.removeItem("token");
                    // localStorage.removeItem("userId");
                    // navigate("/login");
                  }}
                >
                  <img src={Logout} alt="" />
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Outlet />
      <LogoutModal
        open={showLogOutModal}
        handleClose={() => setShowLogoutModal(false)}
        logOut={() => {
          const role = localStorage.getItem("role");
          localStorage.removeItem("token");
          localStorage.removeItem("userId");
          localStorage.removeItem("role");
          localStorage.removeItem("isFirstBookingDone");
          // if(role==='AGENCY'){
            logoutFun()
          // navigate("/agency/login");
          // } else {
          navigate("/login");
          // }
        }}
      />
    </>
  );
};

export default Header;
