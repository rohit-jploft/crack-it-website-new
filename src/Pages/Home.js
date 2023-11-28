import Footer from "./Footer";
import "./../style.css";
import Logo from "./../Images/logo.png";
import Notification from "./../Images/notification.svg";
import Boyright from "./../Images/boy.svg";
import ArrowLeft from "./../Images/Arrow_Left.svg";
import Tech1 from "./../Images/tech1.svg";
import Tech2 from "./../Images/tech2.svg";
import { Outlet, Link, useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import { useState, Fragment } from "react";
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
import PhoneInput from "react-phone-input-2"
const Home = () => {
  const [showContactForm, setShowContactForm] = useState(false);
  const [dailCode, setDialCode] = useState(false);
  const navigate = useNavigate()
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().required("Name is required"),
      email: Yup.string().email("Invalid email").matches(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Invalid email").required("Email is required"),
      phone: Yup.string().required("Phone is required"),
      message: Yup.string()
        .min(20, "message should be more than the length of 50")
        .required("message is required"),
    }),

    onSubmit: async (values, {resetForm}) => {
      const res = await Axios.post(`${BASE_URL}contacts/create`, { ...values });

      if (res && res.data.success && res.data.status === 200) {
        toast.success(res.data.message);
        resetForm()
        setShowContactForm(false)
      }
      console.log(res);
    },
  });
  return (
    <Fragment>
        <ToastContainer/>
      <section className="landing_banner">
        <Container>
          <div className="Header_nav">
            <div className="brand-logo" style={{cursor:"pointer"}} onClick={() => navigate("/")}>
              <img src={Logo} alt="Logo" />
            </div>
            <div className="header-right">
              {/* <Link to="/">
                <img src={Notification} alt="Logo" />
              </Link> */}
              <Link to="/agency/login">
                <button className="btn_login">AGENCY LOGIN</button>
              </Link>
              <Link to="/Login">
                <button className="btn_login">LOGIN</button>
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
              <button className="btn_getstrated" onClick={() => navigate("/signup")}>
                GET STARTED <img src={ArrowLeft} alt="Logo" />
              </button>
            </div>
            <div className="col-md-6 right-img">
              <img src={Boyright} alt="boy" />
            </div>
          </div>
        </Container>
      </section>
      <section className="tech_section">
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
      </section>
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
                      console.log('phone', phone);
                      console.log('e', e);
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
                  <button type="submit" style={{ width: "100%" }} className="btn_signup contact_form_button">
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
    </Fragment>
  );
};

export default Home;
