import "./../style.css";
import { Link, useNavigate } from "react-router-dom";
import Header from "./Header";
import Container from "react-bootstrap/Container";
import Devops from "./../Images/devops.svg";
import Fullstack from "./../Images/full-stack.svg";
import Dataeng from "./../Images/data-eng.svg";
import { getCategoryList } from "../data/booking";
import { useContext, useEffect, useState } from "react";
import { BookingContext } from "../context/bookingContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { isAgency, isExpert } from "../utils/authHelper";
import { UserContext } from "../context/userContext";
const JobCategory = () => {
  const navigate = useNavigate();
  const [categoryData, setCategoryData] = useState([]);
  const { jobCategory, setJobCategory } = useContext(BookingContext);
  const { profileSetupData } = useContext(UserContext);
  const getData = async () => {
    const data = await getCategoryList();
    console.log(data);
    setCategoryData(data.data);
  };
  useEffect(() => {
    getData();
  }, []);
  const isThisExpert = isExpert();
  const isThisAgency = isAgency();

  useEffect(() => {
    if (
      !profileSetupData?.description ||
      !profileSetupData?.languages ||
      !profileSetupData?.price ||
      !profileSetupData?.experience
    ) {
      if (isThisExpert) {
        navigate("/setup-profile");
      }
     
    }
    if (
      !profileSetupData?.description ||
      !profileSetupData?.languages ||
      !profileSetupData?.experience
    ) {
      if (isThisAgency) {
        navigate("/agency/setup-profile");
      }
     
    }
  });
  return (
    <>
      <ToastContainer />
      <Header />
      <section className="">
        <Container>
          <div className="main-content">
            <div className="job-categ">
              <div>
                <h3>Select Your Job Category</h3>
                <div className="categories">
                  {categoryData?.map((item) => {
                    return (
                      <div
                        className={`categ-detail ${
                          jobCategory === item._id ? "active" : ""
                        }`}
                        style={{ cursor: "pointer" }}
                        onClick={() => setJobCategory(item._id)}
                      >
                        <div className="categ-img">
                          <img src={Dataeng} alt="img" />
                        </div>
                        <p>{item.title}</p>
                      </div>
                    );
                  })}
                </div>
                <div className="text-center">
                  {/* <Link to="/subCategory"> */}
                  <button
                    className="btn_continue"
                    onClick={() => {
                      if (!jobCategory) {
                        toast.error("Select Job category", { autoClose: 400 });
                      }
                      navigate("/subCategory");
                    }}
                  >
                    CONTINUE
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

export default JobCategory;
