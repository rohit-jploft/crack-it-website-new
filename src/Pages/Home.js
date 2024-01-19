import Footer from "./Footer";
import "./../style.css";
import Slider from "react-slick";
import Logo from "./../Images/logo.png";
import Rstar from "./../Images/star-n.svg";
import Calendar from "./../Images/calendar.svg";
import Register from "./../Images/register.svg";
import Blog1 from "./../Images/blog-1.png";
import Client1 from "./../Images/client-1.png";
import Client2 from "./../Images/client-2.png";
import Client3 from "./../Images/client-3.png";
import Client4 from "./../Images/client-4.png";
import Client5 from "./../Images/client-5.png";
import Client6 from "./../Images/client-6.png";
import Blog2 from "./../Images/blog-2.png";
import Rimg from "./../Images/r-img-1.png";
import Rimg1 from "./../Images/r-img-2.png";
import Blog3 from "./../Images/blog-3.png";
import Aboutus from "./../Images/about-img.png";
import Videobg from "./../Images/video-bg.svg";
import Playicon from "./../Images/play-button.svg";
import Userguide1 from "./../Images/02_user_guide1.png";
import Boyright from "./../Images/boy.svg";
import ArrowLeft from "./../Images/Arrow_Left.svg";
import Tech1 from "./../Images/tech1.svg";
import Tech2 from "./../Images/tech2.svg";
import { Outlet, Link, useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import { useState, Fragment, useEffect } from "react";
import closeButton from "../Images/closeButton.svg";
import { CloseIcon } from "@mui/icons-material";
import * as Yup from "yup";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
} from "@mui/material";
import { useFormik } from "formik";
import TextInput from "../components/InputField";
import "react-toastify/dist/ReactToastify.css";
import Axios from "axios";
import { BASE_URL } from "../constant";
import { ToastContainer, toast } from "react-toastify";
import PhoneInput from "react-phone-input-2";
import { Button, Col, Modal, Row } from "react-bootstrap";
import WebTour from "../components/Webtour";
import JoyRideComponent from "../components/JoyRide";

const Home = () => {
  const [showtour, setShowTour] = useState(true);
  const [showContactForm, setShowContactForm] = useState(false);
  const [dailCode, setDialCode] = useState(false);
  const [categoriesData, setCategoriesdata] = useState([]);
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().required("Name is required"),
      email: Yup.string()
        .email("Invalid email")
        .matches(
          /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
          "Invalid email"
        )
        .required("Email is required"),
      phone: Yup.string().required("Phone is required"),
      message: Yup.string()
        .min(20, "message should be more than the length of 50")
        .required("message is required"),
    }),

    onSubmit: async (values, { resetForm }) => {
      const res = await Axios.post(`${BASE_URL}contacts/create`, { ...values });

      if (res && res.data.success && res.data.status === 200) {
        toast.success(res.data.message);
        resetForm();
        setShowContactForm(false);
      }
      console.log(res);
    },
  });

  const settings = {
    dots: false,
    arrow: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 575,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const review = {
    dots: false,
    arrow: true,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1400,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 1,
        },
      },
      {
        breakpoint: 575,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  // useEffect(() => {
  //   document.body.style.overflow = showtour ? "hidden" : "visible";
  //   if (showtour) {
  //     window.scrollTo({ top: 0, behavior: "smooth" });
  //   }
  //   // Optionally, clean up the style when the component unmounts
  //   return () => {
  //     document.body.style.overflow = "visible";
  //   };
  // }, [showtour]);

  const getAllCatDataWithExpert = async () => {
    const res = await Axios.get(`${BASE_URL}category/home/get/all`);
    console.log(res, "cate");
    setCategoriesdata(res?.data?.data);
  };
  useEffect(() => {
    getAllCatDataWithExpert();
  }, []);

 
  return (
    <Fragment>
      <ToastContainer />
      <section className="landing_banner">
        <Container>
          <div className="Header_nav">
            <div
              className="brand-logo"
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/")}
            >
              <img src={Logo} alt="Logo" />
            </div>
            <div className="header-right">
              {/* <Link to="/">
                <img src={Notification} alt="Logo" />
              </Link> */}
              {/* <Link to="/agency/login">
                <button className="btn_login">AGENCY LOGIN</button>
              </Link> */}
              <Link to="/Login">
                <button className="btn_login login-bbtn">LOGIN</button>
              </Link>
              <Link to="/Signup">
                <button className="btn_signup">SIGN UP</button>
              </Link>
            </div>
          </div>
          <div className="row top-content">
            <div className="col-md-6">
              <h1>
                Interview Proxy for <span>AWS</span>
              </h1>
              <p>
                If you are a fresher or experienced, struggling to CRACK the
                interview, No Worries. we have a team of experienced
                professionals who can help you to get the JOB.
              </p>
              <button
                className="btn_getstrated"
                onClick={() => navigate("/signup")}
              >
                GET STARTED <img src={ArrowLeft} alt="Logo" />
              </button>
            </div>
            <div className="col-md-6 ">
              <div className="slider-img">
                <img className="img-fluid" src={Boyright} alt="boy" />
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="categories-section">
        <Container>
          <div className="section-heading text-center">
            <h2>Categories</h2>
          </div>
          <Row className="">
            {categoriesData.length > 0 &&
              categoriesData.map((cat) => {
                return (
                  <Col lg={3} md={4} sm={6}>
                    <div className="categorie-box">
                      <h3>{cat.category.title}</h3>
                      <div className="d-flex justify-content-between gap-3">
                        <p>
                          <i>
                            <img src={Rstar} />
                          </i>{" "}
                          {cat.averageRating}/5
                        </p>
                        <p>{cat.noOfExpert} Experts</p>
                      </div>
                    </div>
                  </Col>
                );
              })}
            {categoriesData.length > 8 && (
              <Col lg={12} md={12}>
                <div className="view-all-btn text-center">
                  <button class="btn_signup w-auto px-4">
                    View All Categories
                  </button>
                </div>
              </Col>
            )}
          </Row>
        </Container>
      </section>

      <section className="rate-section">
        <Container>
          <Row className="justify-content-center">
            <Col md={4} sm={6}>
              <div className="rate-box">
                <h2>80%</h2>
                <p>Advanced to Final Rounds </p>
              </div>
            </Col>
            <Col md={4} sm={6}>
              <div className="rate-box">
                <h2>90%</h2>
                <p>Interview Success Rate </p>
              </div>
            </Col>
            <Col md={4} sm={6}>
              <div className="rate-box">
                <h2>72%</h2>
                <p>Job Offer Rate </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="how-its-works">
        <div className="section-heading text-center">
          <h2>How Its Works</h2>
          <p>
            Contrary to popular belief, Lorem Ipsum is not simply random text.{" "}
            <br /> It has roots in a piece of classical Latin literature
          </p>
        </div>
        <Container>
          <Row>
            <Col md={12}>
              <div className="video-mang">
                <img src={Videobg} className="img-fluid" />
                <button className="ply-vdo">
                  <img src={Playicon} className="img-fluid" />
                </button>
              </div>
            </Col>
          </Row>
          <div className="box-steps">
            <div className="step-box">
              <img className="img-fluid" src={Register} />
              <h3>Register</h3>
              <p>01</p>
            </div>
            <div className="step-box">
              <img className="img-fluid" src={Register} />
              <h3>Find an Expert</h3>
              <p>02</p>
            </div>
            <div className="step-box">
              <img className="img-fluid" src={Register} />
              <h3>Book the Meeting</h3>
              <p>03</p>
            </div>
            <div className="step-box">
              <img className="img-fluid" src={Register} />
              <h3>Talk with Expert</h3>
              <p>04</p>
            </div>
            <div className="step-box">
              <img className="img-fluid" src={Register} />
              <h3>Give Feedback</h3>
              <p>05</p>
            </div>
          </div>
        </Container>
      </section>

      <section className="about-us">
        <Container>
          <Row className="align-items-center">
            <Col md={6}>
              <div className="about-img">
                <img className="img-fluid" src={Aboutus} />
              </div>
            </Col>
            <Col md={6}>
              <div className="about-dtl">
                <h2>About Us</h2>
                <p>
                  If you are a fresher or experienced, struggling to CRACK the
                  interview, No Worries. we have a team of experienced
                  professionals who can help you to get the JOB.
                </p>
                <p>
                  If you are a fresher or experienced, struggling to CRACK the
                  interview, No Worries. we have a team of experienced
                  professionals who can help you to get the JOB.
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="blog-section">
        <div className="section-heading text-center">
          <h2>Blogs</h2>
        </div>
        <Container>
          <Slider {...settings}>
            <div>
              <div className="blog-box">
                <div className="blog-img">
                  <img src={Blog1} />
                </div>
                <div className="blg-dtl-shrt">
                  <h2>Lorem ipsum is dummy</h2>
                  <p>
                    It is a long established fact that a reader will be
                    distracted by the readable content of a page when looking at
                    its layout ...
                  </p>
                  <span>
                    <i>
                      <img src={Calendar} />
                    </i>{" "}
                    May 15, 2023
                  </span>
                </div>
              </div>
            </div>
            <div>
              <div className="blog-box">
                <div className="blog-img">
                  <img src={Blog2} />
                </div>
                <div className="blg-dtl-shrt">
                  <h2>Lorem ipsum is dummy</h2>
                  <p>
                    It is a long established fact that a reader will be
                    distracted by the readable content of a page when looking at
                    its layout ...
                  </p>
                  <span>
                    <i>
                      <img src={Calendar} />
                    </i>{" "}
                    May 15, 2023
                  </span>
                </div>
              </div>
            </div>
            <div>
              <div className="blog-box">
                <div className="blog-img">
                  <img src={Blog3} />
                </div>
                <div className="blg-dtl-shrt">
                  <h2>Lorem ipsum is dummy</h2>
                  <p>
                    It is a long established fact that a reader will be
                    distracted by the readable content of a page when looking at
                    its layout ...
                  </p>
                  <span>
                    <i>
                      <img src={Calendar} />
                    </i>{" "}
                    May 15, 2023
                  </span>
                </div>
              </div>
            </div>
            <div>
              <div className="blog-box">
                <div className="blog-img">
                  <img src={Blog2} />
                </div>
                <div className="blg-dtl-shrt">
                  <h2>Lorem ipsum is dummy</h2>
                  <p>
                    It is a long established fact that a reader will be
                    distracted by the readable content of a page when looking at
                    its layout ...
                  </p>
                  <span>
                    <i>
                      <img src={Calendar} />
                    </i>{" "}
                    May 15, 2023
                  </span>
                </div>
              </div>
            </div>
            <div>
              <div className="blog-box">
                <div className="blog-img">
                  <img src={Blog1} />
                </div>
                <div className="blg-dtl-shrt">
                  <h2>Lorem ipsum is dummy</h2>
                  <p>
                    It is a long established fact that a reader will be
                    distracted by the readable content of a page when looking at
                    its layout ...
                  </p>
                  <span>
                    <i>
                      <img src={Calendar} />
                    </i>{" "}
                    May 15, 2023
                  </span>
                </div>
              </div>
            </div>
            <div></div>
          </Slider>
        </Container>
      </section>
      <section className="review-section">
        <Container>
          <Row className="align-items-center">
            <Col md={4}>
              <div className="section-heading">
                <h2>User Reviews</h2>
                <p>
                  Contrary to popular belief, Lorem Ipsum is not simply random
                  text. It has roots in a piece of classical Latin literature...
                </p>
              </div>
            </Col>
            <Col md={8}>
              <Slider {...review}>
                <div>
                  <div className="review-box">
                    <div className="review-pr-hdr">
                      <div className="img-review">
                        <img src={Rimg} />
                      </div>
                      <div>
                        <h3>Jane Doe</h3>
                        <p>Chief marketing officer</p>
                        <ul className="rating-star">
                          <li>
                            <img className="img-fluid" src={Rstar} />
                          </li>
                          <li>
                            <img className="img-fluid" src={Rstar} />
                          </li>
                          <li>
                            <img className="img-fluid" src={Rstar} />
                          </li>
                          <li>
                            <img className="img-fluid" src={Rstar} />
                          </li>
                          <li>
                            <img className="img-fluid" src={Rstar} />
                          </li>
                        </ul>
                      </div>
                    </div>
                    <p>
                      Contrary to popular belief, Lorem Ipsum is not simply
                      random text. It has roots in a piece of classical Latin
                      literature...
                    </p>
                  </div>
                </div>
                <div>
                  <div className="review-box">
                    <div className="review-pr-hdr">
                      <div className="img-review">
                        <img src={Rimg1} />
                      </div>
                      <div>
                        <h3>Jane Doe</h3>
                        <p>Chief marketing officer</p>
                        <ul className="rating-star">
                          <li>
                            <img className="img-fluid" src={Rstar} />
                          </li>
                          <li>
                            <img className="img-fluid" src={Rstar} />
                          </li>
                          <li>
                            <img className="img-fluid" src={Rstar} />
                          </li>
                          <li>
                            <img className="img-fluid" src={Rstar} />
                          </li>
                          <li>
                            <img className="img-fluid" src={Rstar} />
                          </li>
                        </ul>
                      </div>
                    </div>
                    <p>
                      Contrary to popular belief, Lorem Ipsum is not simply
                      random text. It has roots in a piece of classical Latin
                      literature...
                    </p>
                  </div>
                </div>
                <div>
                  <div className="review-box">
                    <div className="review-pr-hdr">
                      <div className="img-review">
                        <img src={Rimg} />
                      </div>
                      <div>
                        <h3>Jane Doe</h3>
                        <p>Chief marketing officer</p>
                        <ul className="rating-star">
                          <li>
                            <img className="img-fluid" src={Rstar} />
                          </li>
                          <li>
                            <img className="img-fluid" src={Rstar} />
                          </li>
                          <li>
                            <img className="img-fluid" src={Rstar} />
                          </li>
                          <li>
                            <img className="img-fluid" src={Rstar} />
                          </li>
                          <li>
                            <img className="img-fluid" src={Rstar} />
                          </li>
                        </ul>
                      </div>
                    </div>
                    <p>
                      Contrary to popular belief, Lorem Ipsum is not simply
                      random text. It has roots in a piece of classical Latin
                      literature...
                    </p>
                  </div>
                </div>
                <div>
                  <div className="review-box">
                    <div className="review-pr-hdr">
                      <div className="img-review">
                        <img src={Rimg1} />
                      </div>
                      <div>
                        <h3>Jane Doe</h3>
                        <p>Chief marketing officer</p>
                        <ul className="rating-star">
                          <li>
                            <img className="img-fluid" src={Rstar} />
                          </li>
                          <li>
                            <img className="img-fluid" src={Rstar} />
                          </li>
                          <li>
                            <img className="img-fluid" src={Rstar} />
                          </li>
                          <li>
                            <img className="img-fluid" src={Rstar} />
                          </li>
                          <li>
                            <img className="img-fluid" src={Rstar} />
                          </li>
                        </ul>
                      </div>
                    </div>
                    <p>
                      Contrary to popular belief, Lorem Ipsum is not simply
                      random text. It has roots in a piece of classical Latin
                      literature...
                    </p>
                  </div>
                </div>

                <div></div>
              </Slider>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="client-logos">
        <div className="section-heading text-center">
          <h2>As Featured On</h2>
        </div>
        <Container>
          <Row className="justify-content-center">
            <Col lg={2} md={3} sm={4}>
              <img className="img-fluid" src={Client1} />
            </Col>
            <Col lg={2} md={3} sm={4}>
              <img className="img-fluid" src={Client2} />
            </Col>
            <Col lg={2} md={3} sm={4}>
              <img className="img-fluid" src={Client3} />
            </Col>
            <Col lg={2} md={3} sm={4}>
              <img className="img-fluid" src={Client4} />
            </Col>
            <Col lg={2} md={3} sm={4}>
              <img className="img-fluid" src={Client5} />
            </Col>
            <Col lg={2} md={3} sm={4}>
              <img className="img-fluid" src={Client6} />
            </Col>
          </Row>
        </Container>
      </section>
      {/* <section className="tech_section">
        <Container>
          <div className="technologies">
            <div className="tech_box">
              <h3>DevOps</h3>
              <p>
                10+ year DevOps professional will help you the CRACK the
                interview.
              </p>
              <img src={Tech1} alt="boy" />
            </div>
            <div className="tech_box">
              <h3>Java, Python</h3>
              <p>7+ year professional will help you the CRACK the interview.</p>
              <img src={Tech2} alt="boy" />
            </div>
          </div>
        </Container>
      </section> */}

      <Dialog
        open={showContactForm}
        onClose={() => setShowContactForm(false)}
        sx={{ width: "100%" }}
        className="outer_contact_form_div"
      >
        <DialogTitle className="contact_form_h2">Contact Us</DialogTitle>
        <IconButton
          aria-label="close"
          onClick={() => setShowContactForm(false)}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <img src={closeButton} />
        </IconButton>
        <DialogContent>
          <Container>
            <Grid container className="contact_form">
              <form onSubmit={formik.handleSubmit}>
                <Grid item sm={12}>
                  {" "}
                  <TextInput
                    type="text"
                    name="name"
                    value={formik.values.name}
                    handleChange={(e) => {
                      const inputValue = e.target.value;
                      //       // Custom validation: Allow only numbers and limit to 10 digits.
                      //     const regex = /^[A-Za-z]+$/;
                      //     if (regex.test(inputValue)) {
                      formik.setFieldValue("name", inputValue);
                      // }
                    }}
                    label="name *"
                    error={formik.touched.name && Boolean(formik.errors.name)}
                    helperText={formik.touched.name && formik.errors.email}
                  />
                </Grid>
                <Grid item sm={12}>
                  <TextInput
                    type="email"
                    name="email"
                    value={formik.values.email}
                    handleChange={formik.handleChange}
                    label="Email *"
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                  />
                </Grid>
                <Grid item sm={12}>
                  {/* <TextInput
                    type="text"
                    name="phone"
                    value={formik.values.phone}
                    handleChange={formik.handleChange}
                    label="phone *"
                    error={formik.touched.phone && Boolean(formik.errors.phone)}
                    helperText={formik.touched.phone && formik.errors.phone}
                  /> */}
                  <PhoneInput
                    name="phone"
                    label="Phone Number *"
                    autoCorrect="off"
                    placeholder="Enter a Valid Phone Number"
                    country={"in"}
                    value={`+${dailCode}`}
                    // value={formik.values.phone}
                    onChange={(phone, e) => {
                      console.log("phone", phone);
                      console.log("e", e);
                      setDialCode(e.dialCode);
                      formik.setFieldValue("phone", phone);
                      // setMobileNumberCountryCode(phone)

                      // setFieldValue("mobilenumberCountryCode", phone);
                    }}
                    error={formik.touched.phone && Boolean(formik.errors.phone)}
                    helperText={formik.touched.phone && formik.errors.phone}
                  />
                </Grid>
                <Grid item sm={12}>
                  <TextInput
                    type="text"
                    name="message"
                    value={formik.values.message}
                    handleChange={formik.handleChange}
                    label="Message"
                    error={
                      formik.touched.message && Boolean(formik.errors.message)
                    }
                    helperText={formik.touched.message && formik.errors.message}
                  />
                </Grid>
                <Grid item sm={12}>
                  <button
                    type="submit"
                    style={{ width: "100%" }}
                    className="btn_signup contact_form_button"
                  >
                    Submit
                  </button>
                </Grid>
              </form>
            </Grid>
          </Container>
        </DialogContent>
        <DialogActions></DialogActions>
      </Dialog>
      <Footer setModal={(value) => setShowContactForm(value)} />
      {/* {showContactForm && ( */}

      {/* )} */}
      {/* {showtour && (
        <WebTour
          setShowTour={setShowTour}
          title={"Login For User"}
          body={
            "If you are a fresher or experienced, struggling to CRACK the interview, <br />No Worries. we have a team of experienced professionals."
          }
        />
      )} */}
      {
        <JoyRideComponent steps={[{disableBeacon:true,target:".btn_login", content:"If you are a fresher or experienced, struggling to CRACK the interview, No Worries. we have a team of experienced professionals."}]}/>
      }
    </Fragment>
  );
};

export default Home;
