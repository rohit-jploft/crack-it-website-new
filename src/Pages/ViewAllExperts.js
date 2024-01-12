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
import { AVATAR_BASE_URL, BASE_URL } from "../constant";
import Axios from "axios";
const ViewAllExperts = () => {
  const { jobCategory, getReqData, time } = useContext(BookingContext);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [priceminFilter1, setPriceMinFilter1] = useState(0);
  const [pricemaxFilter1, setPriceMaxFilter1] = useState(50);
  const [priceminFilter, setPriceMinFilter] = useState(0);
  const [pricemaxFilter, setPriceMaxFilter] = useState(250);
  const [data, setData] = useState();
  const [search, setSearch] = useState("");
  const [filterSubmitted, setFilterSubmitted] = useState(false);
  const [limit, setLimit] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    setIsLoading(true);
    setFilterSubmitted(false);
    // setImmediate(() => {
    // })
    setTimeout(() => {
      setIsLoading(false);
    }, 300);
  }, [search, jobCategory, filterSubmitted]);
  console.log(getReqData);

  const getRatedExpert = async () => {
    setIsLoading(true);
    const res = await Axios.get(
      `${BASE_URL}expert/rating/get/all?limit=${limit}&page=0`
    );
    if (res && res?.data && res?.data?.data) {
      setData(res?.data?.data);
      setTotalCount(res?.data?.pagination?.totalCount);
      setIsLoading(false);
    }
    console.log("rated expert", res);
  };
  useEffect(() => {
    (async () => {
      await getRatedExpert();
    })();
  }, [limit, search]);
  return (
    <>
      <ToastContainer />
      <Header />
      <section className="">
        <Container>
          <Loader open={isLoading} title={"Searching experts"} />
          <div className="main-content">
            <div className="">
              <div>
                <h3>Experts</h3>

                <div className="row table-responsive experts-table">
                  <Table width="100%">
                    <thead>
                      <tr width="100%">
                        <th width="1%"></th>
                        <th width="15%">Name</th>
                        <th width="24%">Expertise</th>
                        {/* <th width="24%">Expert Type</th> */}
                        <th width="15%">Experience</th>
                        <th width="15%">Price/hr</th>
                        <th width="15%">Rating</th>
                        {/* <th width="15%"></th> */}
                      </tr>
                    </thead>
                    <tbody>
                      {data?.map((expert) => {
                        return (
                          <tr
                            style={{ cursor: "pointer" }}
                            onClick={() =>
                              navigate(`/expert/profile/${expert?.user?._id}`)
                            }
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
                            {/* <td>
                              {expert && expert.user && expert?.user?.agency ? (
                                <Chip label="Agency" variant="outlined" />
                              ) : (
                                <Chip label="Individual" variant="outlined" />
                              )}
                            </td> */}
                            <td>{expert?.experience} year</td>
                            <td>${expert?.price}/hr</td>
                            <td>
                              <img className="star-img" src={Star} alt="img" />{" "}
                              {expert?.rating}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                  {totalCount < limit && (
                    <div
                      onClick={() => setLimit(limit + 10)}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <span
                        style={{
                          cursor: "pointer",
                          textDecoration: "underline",
                        }}
                      >
                        Load more
                      </span>
                    </div>
                  )}
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
    </>
  );
};

export default ViewAllExperts;
