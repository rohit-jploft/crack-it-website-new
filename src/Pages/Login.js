import "./../style.css";
import Logo from "./../Images/logo.png";
import RightBg from "./../Images/right_bg.jpg";
import { Link, Navigate, useNavigate } from "react-router-dom";
import Pot from "./../Images/pot.svg";
import Msg from "./../Images/msg.svg";
import Visible from "./../Images/visible.svg";
import { useContext, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Axios from "axios";

// @mui
import * as Yup from "yup"; // Import Yup for validation
import { useFormik } from "formik";
import { BASE_URL } from "../constant";
import TextInput from "../components/InputField";
import { UserContext } from "../context/userContext";

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email")
    .matches(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Invalid email")
    .required("Email is required"),
  password: Yup.string().required("Password is required"),
});

const Login = () => {
  const [created, setCreated] = useState(false);
  const { isExpertVerified, setExpertVerified } = useContext(UserContext);
  const [disableButton, setDisableButton] = useState(false);
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      setCreated(true);
      // alert(JSON.stringify(values, null, 2));
      const res = await Axios.post(`${BASE_URL}auth/user/login`, {
        email: formik.values.email,
        password: formik.values.password,
      });
      if (res?.data && res.data?.data?.token) {
        if (
          res.data.data.user.role === "EXPERT" ||
          res.data.data.user.role === "USER" ||
          res.data.data.user.role === "AGENCY"
        ) {
          localStorage.setItem("token", res.data.data.token);
          localStorage.setItem("userId", res.data.data.user._id);
          localStorage.setItem("role", res.data.data.user.role);
          console.log(res.data.data.user, "logged usrer");
          setExpertVerified(res.data.data.user.isExpertProfileVerified);
          toast.success(res?.data?.message, {
            onClose: () => {
              if (
                res.data.data.user.role === "EXPERT" &&
                !res.data.data.user.isExpertProfileVerified
              ) {
                navigate("/setup-profile");
              } else {
                if (res.data.data.user.role === "AGENCY") {
                  if (!res.data.data.user.isExpertProfileVerified) {
                    navigate("/agency/setup-profile");
                  } else {
                    navigate("/agency/experts/all");
                  }
                } else {
                  navigate("/mybookings");
                  window.location.reload();
                }
                // return <Navigate to="/mybookings"/>
              }
            },
            autoClose: 500,
          });
          setDisableButton(true);
          setTimeout(() => {
            setDisableButton(false);
          }, 1500);
          setCreated(false);
        } else {
          toast.error("User not found", { autoClose: 500 });
          setDisableButton(true);
          setTimeout(() => {
            setDisableButton(false);
          }, 1500);
        }
      }
      if (res?.data && res?.data?.type === "error") {
        toast(res.data.message, { type: "error" });
        setCreated(false);
      }
    },
  });
  return (
    <>
      <ToastContainer />
      <section className="main_sect">
        <div className="content-left">
          <div
            className="brand-logo"
            onClick={() => navigate("/")}
            style={{ cursor: "pointer" }}
          >
            <img src={Logo} alt="Logo" />
          </div>
          <div className="login-form form_sect">
            <form onSubmit={formik.handleSubmit}>
              <h2>Hello Again</h2>
              <p>Welcome back, you've been missed</p>

              <TextInput
                type="email"
                name="email"
                value={formik.values.email}
                handleChange={formik.handleChange}
                label="Email *"
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
              />

              <TextInput
                type={showPassword ? "text" : "password"}
                name="password"
                value={formik.values.password}
                handleChange={formik.handleChange}
                showPassword={showPassword}
                label="Password *"
                setShowPassword={(value) => setShowPassword(value)}
                error={
                  formik.touched.password && Boolean(formik.errors.password)
                }
                helperText={formik.touched.password && formik.errors.password}
              />
              <div
                className="forgot-pass"
                style={{ cursor: "pointer" }}
                onClick={() => navigate("/forgotpassword")}
              >
                Forgot password?
              </div>

              <button
                className="form-btn"
                type="submit"
                disabled={disableButton}
              >
                LOGIN
              </button>

              <p className="para-btm">
                Don't have an account? <Link to="/Signup">Sign Up</Link>
              </p>
            </form>
          </div>
          <img className="img-pot" src={Pot} alt="" />
          <img className="img-msg" src={Msg} alt="" />
        </div>
        <div className="right_img">
          <img src={RightBg} alt="bg" />
        </div>
      </section>
    </>
  );
};

export default Login;
