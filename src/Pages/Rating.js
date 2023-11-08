import "./../style.css";
import Header from "./Header";
import { Link, useNavigate, useParams } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import ExpertImg from "./../Images/expert-img.svg";
import Star from "./../Images/star.svg";
import Star2 from "./../Images/star2.svg";
import Ex1 from "./../Images/ex1.svg";
import Ex2 from "./../Images/ex2.svg";
import Ex3 from "./../Images/ex3.svg";
import Ex4 from "./../Images/ex4.svg";
import Axios from "axios";
import { Rating as RatingComponent } from "@mui/material";
import { BASE_URL } from "../constant";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Rating = () => {
  const { expertId } = useParams();
  const navigate = useNavigate();
  const [expertData, setExpertData] = useState();
  const [rateValue, setRateValue] = useState(0);
  const [comment, setComment] = useState("");

  const getRatingProfileData = async () => {
    try {
      const data = await Axios.get(
        `${BASE_URL}auth/user/profile/get/${expertId}`
      );
      setExpertData(data.data.data);
      console.log(data, "rating expert data");
    } catch (error) {
      console.log(error);
      return toast.error(error.message);
    }
  };
  useEffect(() => {
    getRatingProfileData();
  }, []);

  const submitReview = async () => {
    const loggedUserId = localStorage.getItem("userId");
    try {
      const data = await Axios.post(`${BASE_URL}rating/create`, {
        expert: expertId,
        ratedBy: loggedUserId,
        rating: rateValue,
        comment: comment,
      });
      if (
        data &&
        data.data &&
        data.data.data &&
        data.data.data &&
        data.data.success &&
        data.data.status === 200
      ) {
        toast.success("Expert rated successfully", { autoClose: 600 });
        navigate("/myBookings");
      }
      console.log(data, "rating response");
    } catch (error) {
      console.log(error);
      return toast.error(error.message);
    }
  };
  return (
    <>
      <ToastContainer />
      <Header />
      <section className="">
        <Container>
          <div className="main-content">
            <div className="job-categ">
              <div className="rating_field">
                <h3>Rating</h3>
                <div className="expertprofile-detail">
                  <div className="expert-image">
                    <img src={ExpertImg} alt="Img" />
                  </div>
                  <h2>
                    {expertData?.user?.firstName} {expertData?.user?.lastName}
                  </h2>
                  <p>{expertData?.jobCategory?.title}</p>
                </div>
                <div className="give_rating">
                  <h3>Give Rate</h3>
                  <RatingComponent
                    name="rate"
                    value={rateValue}
                    onChange={(event, newValue) => {
                      setRateValue(newValue);
                    }}
                    size="large"
                  />
                </div>
                <div class="input-field">
                  <label for="exampleFormControlInput1" class="form-label">
                    Give Review
                  </label>
                  <textarea
                    type="email"
                    name="comment"
                    rows="4"
                    value={comment}
                    onChange={(e) => {
                      setComment(e.target.value);
                    }}
                    class="form-control"
                    id="exampleFormControlInput1"
                    placeholder=""
                  />
                </div>
                {/* <div className="give_rating">
                  <h3>How was experience</h3>
                  <div>
                    <img className="experience-img" src={Ex1} alt="img" />
                    <img className="experience-img" src={Ex2} alt="img" />
                    <img
                      className="experience-img active"
                      src={Ex3}
                      alt="img"
                    />
                    <img className="experience-img" src={Ex4} alt="img" />
                  </div>
                </div> */}
                <div className="text-center">
                  <Button
                    className="btn_continue"
                    onClick={() => submitReview()}
                  >
                    SUBMIT REVIEW
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
};

export default Rating;
