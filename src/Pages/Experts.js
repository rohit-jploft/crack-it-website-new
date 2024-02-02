import "./../style.css";
import Header from "./Header";
import { Link, useNavigate } from "react-router-dom";
import Table from "react-bootstrap/Table";
import Container from "react-bootstrap/Container";
import Searchicon from "./../Images/searchicon.svg";
import Bookingimg from "./../Images/booking-img.svg";
import Filter from "./../Images/filter.svg";
import Star from "./../Images/star.svg";
import { useContext, useEffect, useState } from "react";
import { createBooking, listExpert } from "../data/booking";
import { BookingContext } from "../context/bookingContext";
import { Rating as RatingComponent } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Chip from "@mui/material/Chip";
import { Button, Modal } from "react-bootstrap";
import MultiRangeSlider from "../components/MultiRangeSlider";
import MultiRangeSliderExp from "../components/MultiRangeSliderExp";
import Loader from "../components/Loader";
import { AVATAR_BASE_URL } from "../constant";
import JoyRideComponent from "../components/JoyRide";
import { isAgency, isExpert } from "../utils/authHelper";
const Experts = () => {
  const {
    jobCategory,
    getReqData,
    time,
    listExpertRequested,
    setListExpertRequested,
  } = useContext(BookingContext);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isReqLoadingDone, setIsReqLoadingDone] = useState(false);
  const [priceminFilter1, setPriceMinFilter1] = useState(0);
  const [pricemaxFilter1, setPriceMaxFilter1] = useState(50);
  const [priceminFilter, setPriceMinFilter] = useState(0);
  const [pricemaxFilter, setPriceMaxFilter] = useState(250);

  const [data, setData] = useState();
  const [search, setSearch] = useState();

  // filter states
  const [minPrice, setMinPrice] = useState();
  const [disableButton, setDisableButton] = useState(false);
  const [reqSent, setReqSent] = useState(false);
  const [maxPrice, setMaxPrice] = useState();
  const [minExperience, setMinExperience] = useState(0);
  const [maxExperience, setMaxExperience] = useState(50);
  const [rating, setRating] = useState(0);
  const [typeOfExpert, setTypeOfExpert] = useState("EXPERT,AGENCY");
  const [filterSubmitted, setFilterSubmitted] = useState(false);
  const getDataList = async () => {
    console.log(
      {
        search,
        jobCategory,
        minExperience,
        maxExperience,
        minPrice,
        maxPrice,
        rating,
        typeOfExpert,
      },
      "query parameter"
    );
    const data = await listExpert(
      search,
      jobCategory ? jobCategory : "",
      minExperience,
      maxExperience,
      minPrice,
      maxPrice,
      rating,
      typeOfExpert
    );

    setData(data.data);
  };
  useEffect(() => {
    if (!jobCategory) {
      navigate("/jobCategory");
    }
  }, [search, jobCategory]);
  useEffect(() => {
    setIsLoading(true);
    setFilterSubmitted(false);
    // setImmediate(() => {
    getDataList();
    // })
    setTimeout(() => {
      setIsLoading(false);
    }, 300);
  }, [search, jobCategory, filterSubmitted]);
  console.log(getReqData);

  const isThisExpert = isExpert();
  const isThisAgency = isAgency();
  const showBookingGuide = localStorage.getItem("showBookingGuide");

  const onBookingExperts = async (e, ExuserId) => {
    setIsReqLoadingDone(true);
    e.preventDefault();

    const loggedUserId = localStorage.getItem("userId");
    await createBooking({
      ...getReqData,
      startTime: time + ":00",
      user: loggedUserId,
      expert: ExuserId,
    })
      .then((result) => {
        if (result && result.status === 200 && result.message) {
          toast(result.message, { type: "success", autoClose: 1500 });
          setDisableButton(true);
          setTimeout(() => {
            setDisableButton(false);
          }, 2000);
          setReqSent(true);
          setIsReqLoadingDone(false);
          setListExpertRequested([
            ...listExpertRequested,
            {
              expertId: ExuserId.toString(),
              requested: true,
            },
          ]);
          localStorage.removeItem("showBookingGuide")
          localStorage.setItem("showBookingGuide", false)
        }
        if (result && result.status === 203 && result.type === "error") {
          toast(result.message, { type: "error", autoClose: 1500 });
          setDisableButton(true);
          setTimeout(() => {
            setDisableButton(false);
          }, 2000);
          setIsReqLoadingDone(false);
        }
        console.log(result);
      })
      .catch((err) => {
        console.log(err);
        setIsReqLoadingDone(false);
      });
  };

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const submitFilter = async () => {
    console.log({
      minExperience,
      maxExperience,
      minPrice,
      maxPrice,
      rating,
      typeOfExpert,
    });
    setFilterSubmitted(true);
    handleClose();
  };

  console.log("pricemaxFilter", pricemaxFilter, priceminFilter);
  console.log(typeOfExpert, "typeOfExpert");
  function isExpertRequested(expertId) {
    const expert = listExpertRequested.find(
      (item) => item.expertId === expertId
    );

    // Check if expert is found and requested is true
    return expert && expert.requested === true;
  }
  return (
    <>
      <ToastContainer />
      <Header />
      <section className="">
        <Container>
          <Loader open={isLoading} title={"Searching experts"} />
          <Loader open={isReqLoadingDone} title={"Sending Booking Request"} />
          <div className="main-content">
            <div className="">
              <div>
                <h3>Experts</h3>
                <div className="d-flex gap-3">
                  <div className="search-box">
                    <input
                      type="text"
                      placeholder="Search here..."
                      value={search}
                      onChange={(e) => {
                        setSearch(e.target.value);
                      }}
                    />
                    <img className="search-i" src={Searchicon} alt="Img" />
                  </div>
                  <img
                    onClick={handleShow}
                    className="img-fluid"
                    src={Filter}
                    style={{ cursor: "pointer" }}
                  />
                  <Modal
                    className="filter-mddl"
                    show={show}
                    onHide={handleClose}
                  >
                    <Modal.Header closeButton></Modal.Header>
                    <Modal.Body>
                      <div className="search-filter">
                        <h2>Filter</h2>
                        <h4>Price</h4>
                        <div className="price-rang-slider">
                          <MultiRangeSlider
                            min={0}
                            max={250}
                            onChange={({ min, max }) => {
                              console.log(min, "min")
                              console.log(max, "max")
                              setMinPrice(min);
                              setMaxPrice(max);
                              setPriceMinFilter(min);
                              setPriceMaxFilter(max);
                            }}
                            // setPriceMaxFilter={setPriceMaxFilter}
                            // setMinExperience={setMinExperience}
                            pricemaxFilter={pricemaxFilter}
                            priceminFilter={priceminFilter}
                          />
                        </div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            flexDirection: "column",
                          }}
                        >
                          <h4 className="mt-4">Star Rating</h4>
                          <RatingComponent
                            name="rate"
                            value={rating}
                            onChange={(event, newValue) => {
                              setRating(newValue);
                            }}
                            size="large"
                          />
                        </div>

                        <h4>Experience</h4>
                        <div className="price-rang-slider mt-3">
                          <MultiRangeSliderExp
                            min={0}
                            max={50}
                            onChange={({ min, max }) => {
                              setMinExperience(min);
                              setMaxExperience(max);
                              setPriceMinFilter1(min);
                              setPriceMaxFilter1(max);
                            }}
                            pricemaxFilter={pricemaxFilter1}
                            priceminFilter={priceminFilter1}
                          />
                        </div>
                        <div className="d-flex justify-content-between my-4">
                          <div style={{ cursor: "pointer" }}>
                            <label>
                              <input
                                type="radio"
                                className="me-2"
                                name="1"
                                checked={typeOfExpert === "AGENCY"}
                                onChange={() => {
                                  setTypeOfExpert("AGENCY");
                                }}
                              />
                              Agency
                            </label>
                          </div>
                          <div style={{ cursor: "pointer" }}>
                            <label>
                              <input
                                type="radio"
                                className="me-2"
                                name="1"
                                checked={typeOfExpert === "EXPERT"}
                                onChange={() => {
                                  setTypeOfExpert("EXPERT");
                                }}
                              />
                              Expert
                            </label>
                          </div>
                          <div style={{ cursor: "pointer" }}>
                            <label>
                              <input
                                type="radio"
                                className="me-2"
                                name="1"
                                checked={typeOfExpert === "AGENCY,EXPERT"}
                                onChange={() => {
                                  setTypeOfExpert("AGENCY,EXPERT");
                                }}
                              />
                              Both
                            </label>
                          </div>
                        </div>
                        <button
                          class="btn_request w-100"
                          onClick={() => submitFilter()}
                        >
                          Submit
                        </button>
                      </div>
                    </Modal.Body>
                  </Modal>
                </div>
                <div className="row table-responsive experts-table">
                  <Table width="100%">
                    <thead>
                      <tr width="100%">
                        <th width="1%"></th>
                        <th width="15%">Name</th>
                        <th width="24%">Expertise</th>
                        <th width="24%">Expert Type</th>
                        <th width="15%">Experience</th>
                        <th width="15%">Price/hr</th>
                        <th width="15%">Rating</th>
                        <th width="15%"></th>
                      </tr>
                    </thead>
                    <tbody className="showGuide">
                      {data?.map((expert, index) => {
                        return (
                          <tr
                            style={{ cursor: "pointer" }}
                            onClick={() =>
                              navigate(`/expert/profile/${expert?.user?._id}`)
                            }
                            className="row-expert"
                          >
                            <td>
                              <img
                                className="prof-img"
                                src={
                                  expert &&
                                  expert?.user &&
                                  expert?.user?.profilePhoto
                                    ? `${AVATAR_BASE_URL}${expert?.user?.profilePhoto}`
                                    : Bookingimg
                                }
                                alt="img"
                              />
                            </td>
                            <td>
                              {expert?.user?.firstName} {expert?.user?.lastName}
                            </td>
                            <td>{expert?.jobCategory?.title}</td>
                            <td>
                              {expert && expert.user && expert?.user?.agency ? (
                                <Chip label={`${expert?.agency?.agencyName}(Agency)`} variant="outlined" />
                              ) : (
                                <Chip label="Individual" variant="outlined" />
                              )}
                            </td>
                            <td>{expert?.experience} year</td>
                            <td>${expert?.price}/hr</td>
                            <td>
                              <img className="star-img" src={Star} alt="img" />{" "}
                              {expert?.rating}
                            </td>
                            <td>
                              {/* <Link to={`/ExpertsProfile/${expert?.user?._id}`}> */}
                              <button
                                className={`btn_request forGuide${index}`}
                                disabled={disableButton || isExpertRequested(expert?.user?._id)}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onBookingExperts(e, expert?.user?._id);
                                }}
                                style={{
                                  backgroundColor: isExpertRequested(
                                    expert?.user?._id
                                  )
                                    ? "grey"
                                    : "#01d866",
                                }}
                              >
                                {isExpertRequested(expert?.user?._id)
                                  ? "Requested"
                                  : "Request"}
                              </button>
                              {/* </Link> */}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                  {data && data.length === 0 && (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "200px",
                      }}
                      className="no_chat"
                    >
                      No Experts found
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
      {!isThisAgency && !isThisExpert && showBookingGuide=='true' && (
        <JoyRideComponent
          steps={[
            {
              disableBeacon: true,
              target: ".showGuide",
              content: "Request For Call",
            },
          ]}
        />
      )}
    </>
  );
};

export default Experts;
