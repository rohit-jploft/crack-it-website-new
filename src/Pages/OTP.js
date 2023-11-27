import "./../style.css";
import { Link, useNavigate } from "react-router-dom";
import Logo from "./../Images/logo.png";
import RightBg from "./../Images/right_bg.jpg";
import Pot from "./../Images/pot.svg";
import Msg from "./../Images/msg.svg";
import { useFormik } from "formik";
import * as Yup from "yup"; // Import Yup for validation
import { forgotPasswordVerifyOtp } from "../data/user";
import { useContext, useEffect } from "react";
import { UserContext } from "../context/userContext";
import TextInput from "../components/InputField";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const OTP = () => {
  const { setPhoneForOtp, phoneForOtp, resetToken, setResetToken } =
    useContext(UserContext);

  const navigate = useNavigate();

  useEffect(() => {
    if (!phoneForOtp) {
      navigate("/forgotpassword");
    }
  }, []);
  const formik = useFormik({
    initialValues: {
      otp: "",
    },
    validationSchema: Yup.object().shape({
      otp: Yup.number().required("otp is required")
    }),
    onSubmit: async (values) => {
      const res = await forgotPasswordVerifyOtp(phoneForOtp, values.otp);
      console.log(res);
      if (res && res.status === 203) {
        toast.error(res.message, {
          autoClose: 800,
        });
      }
      if (res && res?.message && res?.success && res?.status === 200) {
        setResetToken(res.data.token);
        toast.success(res?.message, {
          autoClose: 700,
          onClose: () => {
            navigate("/reset-password");
          },
        });
        // props.close(false);
      }
      if (!res?.success && res?.status === 200)
        toast(res.message, { type: "error" });
    },
  });

  return (
    <>
      <ToastContainer />
      <section className="main_sect">
        <div className="content-left">
          <div className="brand-logo">
            <img src={Logo} alt="Logo" />
          </div>
          <div className="login-form form_sect">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                formik.handleSubmit();
              }}
            >
              <h2>Enter OTP</h2>
              <p>6-digits code sent to your mobile number</p>
              <div class="input-field">
                {/* <label for="exampleFormControlInput1" class="form-label">
                  Enter OTP
                </label> */}
                <TextInput
                  type="number"
                  name="otp"
                  max={6}
                  class="form-control"
                  id="exampleFormControlInput1"
                  placeholder=""
                  label="Enter Otp *"
                  value={formik.values.otp}
                  handleChange={formik.handleChange}
                  error={formik.touched.otp && Boolean(formik.errors.otp)}
                  helperText={formik.touched.otp && formik.errors.otp}
                />
              </div>
              {/* <Link to="/Resetpassword"> */}
              <button className="form-btn" type="submit">
                VERIFY
              </button>
              {/* </Link> */}
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

export default OTP;
