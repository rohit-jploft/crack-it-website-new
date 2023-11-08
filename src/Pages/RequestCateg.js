import "./../style.css";
import { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "./Header";
import Container from "react-bootstrap/Container";
import Searchicon from "./../Images/searchicon.svg";
import Date from "./../Images/date.svg";
import Time3 from "./../Images/time3.svg";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { BookingContext } from "../context/bookingContext";
import { getCategoryList } from "../data/booking";
import { durationList } from "../helper/duration";
import { getAllTimeZones } from "../data/timeZone";
const RequestCateg = () => {
  const [key, setKey] = useState();
  const navigate = useNavigate();
  const {
    jobCategory,
    subCategory,
    setSubCategory,
    storeSkills,
    setStoreSkills,
    duration,
    setDuration,
    date,
    setDate,
    time,
    setTime,
    timeZone,
    setTimeZone,
    jobDescription,
    setJobDescription,
    getReqData,
  } = useContext(BookingContext);
  const [subCategoryData, setSubCategoryData] = useState();
  const [skills, setSkills] = useState();
  const [timeZoneData, setTimeZoneData] = useState();
  const [error, setErrors] = useState({
    skills: storeSkills.length > 0 ? false : true,
    subCategory: subCategory ? false : true,
    date: date ? false : true,
    time: time ? false : true,
    timeZone: timeZone ? false : true,
    jobDescription: jobDescription ? false : true,
    duration: duration ? false : true,
  });
  useEffect(() => {
    setErrors({
      skills: storeSkills.length > 0 ? false : true,
      subCategory: subCategory ? false : true,
      date: date ? false : true,
      time: time ? false : true,
      timeZone: timeZone ? false : true,
      jobDescription: jobDescription ? false : true,
      duration: duration ? false : true,
    });
  }, [
    storeSkills,
    subCategory,
    date,
    time,
    timeZone,
    jobDescription,
    duration,
  ]);
  const [search, setSearch] = useState("");

  /// subCategory data
  const getSubCatData = async (parent) => {
    const data = await getCategoryList(parent);
    setSubCategoryData(data.data);
    setKey(data.data[0]._id);
  };
  const getTimeZones = async () => {
    const data = await getAllTimeZones();
    console.log(data);
    setTimeZoneData(data);
  };
  useEffect(() => {
    if (!jobCategory) {
      navigate("/jobCategory");
    }
    getTimeZones();
  }, []);
  // skills data
  const getSkillsData = async (parent, search) => {
    const data = await getCategoryList(parent, search);
    setSkills(data.data);
  };
  useEffect(() => {
    getSubCatData(jobCategory);
  }, [jobCategory]);

  useEffect(() => {
    getSkillsData(subCategory, search);
  }, [subCategory, search]);

  function toggleSkillInArray(array, str) {
    let newArr = [...array];
    const index = array.indexOf(str);

    if (index === -1) {
      // String doesn't exist in the array, so add it
      newArr.push(str);
      setStoreSkills(newArr);
    } else {
      // String already exists in the array, so remove it
      newArr.splice(index, 1);
      setStoreSkills(newArr);
    }
  }

  return (
    <>
      <Header />
      <section className="">
        <Container>
          <div className="main-content">
            <div className="job-categ">
              <div>
                <h3>Request</h3>
                <div className="search-box">
                  <input type="text" placeholder="Search here..." />
                  <img className="search-i" src={Searchicon} alt="Img" />
                </div>
                <div>
                  <Tabs
                    defaultActiveKey="profile"
                    id="uncontrolled-tab-example"
                    className="categ_tabs"
                    activeKey={subCategory}
                    onSelect={(k) => setSubCategory(k)}
                  >
                    {subCategoryData?.map((item) => {
                      return (
                        <Tab eventKey={item?._id} title={item?.title}>
                          <div className="categ-technology">
                            {skills?.map((skil) => {
                              return (
                                <div
                                  style={{ cursor: "pointer" }}
                                  class={`techno ${
                                    storeSkills.includes(skil?._id)
                                      ? "active"
                                      : ""
                                  }`}
                                  onClick={() =>
                                    toggleSkillInArray(storeSkills, skil._id)
                                  }
                                >
                                  {skil?.title}
                                </div>
                              );
                            })}
                          </div>
                        </Tab>
                      );
                    })}
                  </Tabs>
                  {error.skills && (
                    <div
                      style={{
                        color: "red",
                        textAlign: "left",
                        marginLeft: "9px",
                        fontSize: "13px",
                        marginTop: "-20px",
                      }}
                    >
                      <span>Please select atleast one skill</span>
                    </div>
                  )}
                </div>
                <div className="categ-form">
                  <div className="input-field">
                    <label
                      for="exampleFormControlInput1"
                      className="form-label"
                    >
                      Job Description
                    </label>
                    <textarea
                      type="email"
                      rows="5"
                      value={jobDescription}
                      onChange={(e) => {
                        setJobDescription(e.target.value);
                      }}
                      className="form-control"
                      id="exampleFormControlInput1"
                      placeholder=""
                    />
                  </div>
                  {error.jobDescription && (
                    <div
                      style={{
                        color: "red",
                        textAlign: "left",
                        marginLeft: "9px",
                        fontSize: "13px",
                        // marginTop: "0px",
                      }}
                    >
                      <span>Job Description is required</span>
                    </div>
                  )}
                  <div className="row">
                    <div className="col-md-3">
                      <div className="input-field">
                        <label
                          for="exampleFormControlInput1"
                          className="form-label"
                        >
                          Date
                        </label>
                        <input
                          type="date"
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          className="form-control"
                          id="exampleFormControlInput1"
                          placeholder=""
                        />
                        {error.date && (
                          <div
                            style={{
                              color: "red",
                              textAlign: "left",
                              marginLeft: "9px",
                              fontSize: "13px",
                              // marginTop: "0px",
                            }}
                          >
                            <span>date is required</span>
                          </div>
                        )}
                        {/* <img class="visible-icon" src={Date} alt=""></img> */}
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="input-field">
                        <label
                          for="exampleFormControlInput1"
                          className="form-label"
                        >
                          Time
                        </label>
                        <input
                          type="time"
                          value={time}
                          onChange={(e) => setTime(e.target.value)}
                          className="form-control"
                          id="exampleFormControlInput1"
                          placeholder=""
                        />
                        {/* <img class="visible-icon" src={Time3} alt=""></img> */}
                      </div>
                      {error.time && (
                        <div
                          style={{
                            color: "red",
                            textAlign: "left",
                            marginLeft: "9px",
                            fontSize: "13px",
                            // marginTop: "0px",
                          }}
                        >
                          <span>time is required</span>
                        </div>
                      )}
                    </div>
                    <div className="col-md-6">
                      <div className="input-field">
                        <label
                          for="exampleFormControlInput1"
                          className="form-label"
                        >
                          Select Time Zone
                        </label>
                        <select
                          value={timeZone}
                          onChange={(e) => setTimeZone(e.target.value)}
                          className="form-control"
                          id=""
                        >
                          {timeZoneData?.map((tz) => {
                            return (
                              <option defaultValue="IST" value={tz?.symbol}>
                                {tz?.name}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                      {error.timeZone && (
                        <div
                          style={{
                            color: "red",
                            textAlign: "left",
                            marginLeft: "9px",
                            fontSize: "13px",
                            // marginTop: "0px",
                          }}
                        >
                          <span>time Zone is required</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="duration-field">
                  <h3>Duration</h3>
                  <div className="dur_time">
                    {durationList.map((k) => {
                      return (
                        <div
                          className={`subtime ${
                            duration === k.duration ? "active" : ""
                          }`}
                          onClick={() => setDuration(k.duration)}
                          style={{ cursor: "pointer" }}
                        >
                          {k.hour} hour
                        </div>
                      );
                    })}
                  </div>
                  {error.duration && (
                    <div
                      style={{
                        color: "red",
                        textAlign: "left",
                        marginLeft: "9px",
                        fontSize: "13px",
                        // marginTop: "0px",
                      }}
                    >
                      <span>Duration is required</span>
                    </div>
                  )}
                </div>
                <div className="text-center">
                  {/* <Link to="/Experts"> */}
                  <button
                    className="btn_continue"
                    disabled={
                      error.date ||
                      error.duration ||
                      error.jobDescription ||
                      error.skills ||
                      error.subCategory ||
                      error.time ||
                      error.timeZone
                    }
                    onClick={() => {
                      navigate("/Experts")
                    }}
                  >
                    SUBMIT
                  </button>
                  {/* </Link> */}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
};

export default RequestCateg;
