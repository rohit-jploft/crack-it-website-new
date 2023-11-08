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

import { Button, Modal } from "react-bootstrap";
import MultiRangeSlider from "../components/MultiRangeSlider";
const Experts = () => {
  const { jobCategory, getReqData, time } = useContext(BookingContext);
  const navigate = useNavigate();
  const [data, setData] = useState();
  const [search, setSearch] = useState();

  // filter states
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(250);
  const [minExperience, setMinExperience] = useState(0);
  const [maxExperience, setMaxExperience] = useState(50);
  const [rating, setRating] = useState(0);
  const [typeOfExpert, setTypeOfExpert] = useState("EXPERT,AGENCY");
  const [filterSubmitted, setFilterSubmitted] = useState(false);
  const getDataList = async () => {
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
    setFilterSubmitted(false)
    getDataList();
  }, [
    search,
    jobCategory,
    filterSubmitted
  ]);
  console.log(getReqData);
  const onBookingExperts = async (e, ExuserId) => {
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
    setFilterSubmitted(true)
    handleClose()
  };
  return (
    <>
      <ToastContainer />
      <Header />
      <section className="">
        <Container>
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
                              setMinPrice(min);
                              setMaxPrice(max);
                            }}
                          />
                        </div>

                        {/* <div class="star-rating mb-5">
                                      <input type="radio" id="5-stars" name="rating" value="5" />
                                      <label for="5-stars" class="star">&#9733;</label>
                                      <input type="radio" id="4-stars" name="rating" value="4" />
                                      <label for="4-stars" class="star">&#9733;</label>
                                      <input type="radio" id="3-stars" name="rating" value="3" />
                                      <label for="3-stars" class="star">&#9733;</label>
                                      <input type="radio" id="2-stars" name="rating" value="2" />
                                      <label for="2-stars" class="star">&#9733;</label>
                                      <input type="radio" id="1-star" name="rating" value="1" />
                                      <label for="1-star" class="star">&#9733;</label>
                                    </div> */}
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
                          <MultiRangeSlider
                            min={0}
                            max={50}
                            onChange={({ min, max }) => {
                              setMinExperience(min);
                              setMaxExperience(max);
                            }}
                          />
                        </div>
                        <div className="d-flex justify-content-between my-4">
                          <div>
                            <label>
                              <input
                                type="radio"
                                className="me-2"
                                name="1"
                                onChange={() => {
                                  setTypeOfExpert("AGENCY");
                                }}
                              />
                              Agency
                            </label>
                          </div>
                          <div>
                            <label>
                              <input
                                type="radio"
                                className="me-2"
                                name="1"
                                onChange={() => {
                                  setTypeOfExpert("EXPERT");
                                }}
                              />
                              Expert
                            </label>
                          </div>
                          <div>
                            <label>
                              <input
                                type="radio"
                                className="me-2"
                                name="1"
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
                        <th width="15%">Experience</th>
                        <th width="15%">Price</th>
                        <th width="15%">Rating</th>
                        <th width="15%"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {data?.map((expert) => {
                        return (
                          <tr
                            // onClick={() =>
                            //   navigate(`/ExpertsProfile/${expert?.user?._id}`)
                            // }
                          >
                            <td>
                              <img
                                className="prof-img"
                                src={Bookingimg}
                                alt="img"
                              />
                            </td>
                            <td>
                              {expert?.user?.firstName} {expert?.user?.lastName}
                            </td>
                            <td>{expert?.jobCategory?.title}</td>
                            <td>{expert?.experience} year</td>
                            <td>${expert?.price}</td>
                            <td>
                             
                                <img
                                  className="star-img"
                                  src={Star}
                                  alt="img"
                                />{" "}
                                {expert?.rating}
                            </td>
                            <td>
                              {/* <Link to={`/ExpertsProfile/${expert?.user?._id}`}> */}
                              <button
                                className="btn_request"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onBookingExperts(e, expert?.user?._id);
                                }}
                              >
                                Request
                              </button>
                              {/* </Link> */}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
};

export default Experts;
