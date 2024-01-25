import "./../style.css";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Header from "./Header";
import Container from "react-bootstrap/Container";
import { getAllmeetings, getUserDashboardData } from "../data/booking";
import Axios from "axios"
import Rstar from "./../Images/star-n.svg";
import Manicon from "./../Images/man-icon.svg";
import { isExpert } from "../utils/authHelper";

import { ToastContainer, toast } from "react-toastify";

import { Col, Row } from "react-bootstrap";

import MyChartComponent from "../components/MyChartComponent";
import { BASE_URL } from "../constant";

const UserDashboard = () => {
  const [expertList, setExpertList] = useState([]);
  const [dashboardData, setdaahboardData] = useState({
    totalUser: 0,
    totalMeeting: 0,
    totalExperts: 0,
    monthlyMeetings: [],
  });
  const getRatedExpert = async () => {
    const res = await Axios.get(
      `${BASE_URL}expert/rating/get/all?limit=5&page=0`
    );
    console.log("rated expert", res);
    setExpertList(res?.data?.data);
  };
  useEffect(() => {
   
    (async () => {
      const res = await getUserDashboardData();
      await getRatedExpert();
      setdaahboardData(res.data);
    })();
  }, []);
  const isThisUser = localStorage.getItem("role");
  const isThisExpert = isExpert();
  return (
    <>
      <Header />

      <ToastContainer />
      <section className="">
        <Container>
          <div className="main-content">
            {isThisUser === "USER" && <h2>Dashboard</h2>}
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
            )}
          </div>
        </Container>
      </section>
    </>
  );
};

export default UserDashboard;
