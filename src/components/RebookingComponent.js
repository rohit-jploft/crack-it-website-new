import "./../style.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import Table from "react-bootstrap/Table";
import Container from "react-bootstrap/Container";
import Bookingimg from "./../Images/booking-img.svg";
import Star from "./../Images/star.svg";
import { useContext, useEffect, useState } from "react";
import {
  getSingleBookingDetail,
} from "../data/booking";
import { BookingContext } from "../context/bookingContext";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Chip from "@mui/material/Chip";

import Loader from "../components/Loader";
import { AVATAR_BASE_URL, BASE_URL } from "../constant";

import Header from "../Pages/Header";
import Axios from "axios";

const ReBookingComponent = () => {
  const { listExpertRequested, setListExpertRequested } =
    useContext(BookingContext);
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [bookingData, setBookingData] = useState();
  const [jobCategoryId, setJobCategoryId] = useState("");
  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const getBookingData = async () => {
    const data = await getSingleBookingDetail(bookingId);
    console.log(data, "bookingData");
    setBookingData(data.data);
    setJobCategoryId(data?.data?.booking?.booking?.jobCategory?._id);
  };

  const getListOfExpert = async () => {
    if (jobCategoryId) {
      const expertsData = await Axios.get(
        `${BASE_URL}expert/get/all?jobCategory=${jobCategoryId}`
      );

      console.log(expertsData, "expertsData");
      setData(expertsData?.data?.data);
    }
  };
  useEffect(() => {
    getBookingData();
  }, []);
  useEffect(() => {
    if (jobCategoryId) {
      getListOfExpert();
    }
  }, [jobCategoryId]);

  function isExpertRequested(expertId) {
    const expert = listExpertRequested.find(
      (item) => item.expertId === expertId
    );

    return expert && expert.requested === true;
  }

  const onBookingExperts = async (expertId) => {
    setIsLoading(true);
    try {
      const reBooking = await Axios.post(
        `${BASE_URL}booking/re-booking/${bookingId}`,
        { expertId: expertId }
      );
      if (reBooking && reBooking.data && reBooking?.data?.data) {
        toast.success(reBooking?.data?.message);
        setListExpertRequested([
          ...listExpertRequested,
          {
            expertId: expertId.toString(),
            requested: true,
          },
        ]);
        setIsLoading(false);
      } else {
        setIsLoading(false);
        toast.error(reBooking?.data?.message);
      }
      console.log(reBooking, "rebooking");
    } catch (error) {
      toast.error(error.message);
      setIsLoading(false);
    }
  };
  return (
    <>
      <ToastContainer />
      <Header />
      <section className="">
        <Container>
          {/* <Loader open={isLoading} title={"Searching experts"} /> */}
          <Loader open={isLoading} title={"Sending Booking Request"} />
          <div className="main-content">
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
                    <th width="15%">Request Action</th>
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
                            <Chip label="Agency" variant="outlined" />
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
                          <button
                            className={`btn_request forGuide${index}`}
                            // disabled={
                            //   disableButton ||
                            //   isExpertRequested(expert?.user?._id)
                            // }
                            onClick={(e) => {
                              e.stopPropagation();
                              onBookingExperts(expert?.user?._id);
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
        </Container>
      </section>
    </>
  );
};
export default ReBookingComponent;
