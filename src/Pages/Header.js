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
import Chats from "./../Images/message.svg";
import Logout from "./../Images/logout.svg";
import ProfileH from "./../Images/profile.png";
import DownArrow from "./../Images/down_Arrow.svg";
import Axios from "axios";
import { AVATAR_BASE_URL, BASE_URL } from "../constant";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/userContext";
import { isUser } from "../utils/authHelper";
import { format } from "timeago.js";
const Header = () => {
  const navigate = useNavigate();
  const { profileData, setProfileData } = useContext(UserContext);
  const [userNotificationData, setuserNotificationData] = useState();
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

  const redirectThroughNotification = async (notiId, data, isRead) => {
    console.log(notiId, "noti id");
    if (!isRead) {
      const res = await Axios.put(`${BASE_URL}notification/read/${notiId}`);
    }
    navigate(`/bookingInfo/${data.targetId}`);
  };
  return (
    <>
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
                  <button className="btn_login">BOOK NOW</button>
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
                              noti?.isRead
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
                  <img src={WalletIcon} alt="" />
                  Wallet
                </NavDropdown.Item>
                <NavDropdown.Item href="/Chat">
                  <img src={Chats} alt="" />
                  Chats
                </NavDropdown.Item>
                <NavDropdown.Item href="/change-password">
                  <img src={Chats} alt="" />
                  Change Password
                </NavDropdown.Item>
                <NavDropdown.Item href="/refer/earn">
                  <img src={Chats} alt="" />
                  Refer & Earn
                </NavDropdown.Item>
                <NavDropdown.Item
                  onClick={() => {
                    localStorage.removeItem("token");
                    localStorage.removeItem("userId");
                    navigate("/login");
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
    </>
  );
};

export default Header;
