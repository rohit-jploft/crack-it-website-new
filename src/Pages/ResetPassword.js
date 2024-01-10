import "./../style.css";
import Logo from "./../Images/logo.png";
import RightBg from "./../Images/right_bg.jpg";
import { Link, useNavigate } from "react-router-dom";
import Pot from "./../Images/pot.svg";
import Msg from "./../Images/msg.svg";
import Visible from "./../Images/visible.svg";
import { ToastContainer, toast } from "react-toastify";
import * as Yup from "yup"; // Import Yup for validation
import { useFormik } from "formik";
import TextInput from "../components/InputField";
import { useContext, useState } from "react";
import { resetPasswordApi } from "../data/user";
import { UserContext } from "../context/userContext";

const passwordValidationSchema = Yup.object().shape({
  newPassword: Yup.string()
    .required("New Password is required")
    .matches(
      /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/,
      "Password must contain at least 8 characters, one uppercase letter, one number, and one special character"
    ),
  confirmPassword: Yup.string()
    .required("Confirm Password is required")
    .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
    .matches(
      /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/,
      "Password must contain at least 8 characters, one uppercase letter, one number, and one special character"
    ),
});
const Resetpassword = () => {
  const { resetToken, setResetToken } = useContext(UserContext);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState();
  const [showConfirmPassword, setShowConfirmPassword] = useState();
  const formik = useFormik({
    initialValues: {
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: passwordValidationSchema,
    onSubmit: async (values) => {
      console.log(values);
      const res = await resetPasswordApi(values.newPassword, resetToken);
      console.log(res, "forgot response");
      if (res && res.success && res.status === 200 ) {
        toast.success(res.message, {
          onClose: () => {
            navigate("/login");
          },
          autoClose: 400,
        });
      }
      if (res && !res.success && res.status === 406 && res.type === "error") {
        toast.error(res.message);
      }
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
                formik.handleSubmit()
              }}
            >
              <h2>Reset Password</h2>
              <p>Create new password</p>
              <div class="input-field">
                <TextInput
                  type={showPassword ? "text" : "password"}
                  name="newPassword"
                  value={formik.values.newPassword}
                  handleChange={formik.handleChange}
                  label="Password *"
                  showPassword={showPassword}
                  setShowPassword={(value) => setShowPassword(value)}
                  error={
                    formik.touched.newPassword &&
                    Boolean(formik.errors.newPassword)
                  }
                  helperText={
                    formik.touched.newPassword && formik.errors.newPassword
                  }
                />
              </div>
              <div class="input-field">
                <TextInput
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formik.values.confirmPassword}
                  handleChange={formik.handleChange}
                  label="Confirm Password *"
                  showPassword={showConfirmPassword}
                  setShowPassword={(value) => setShowConfirmPassword(value)}
                  error={
                    formik.touched.confirmPassword &&
                    Boolean(formik.errors.confirmPassword)
                  }
                  helperText={
                    formik.touched.confirmPassword &&
                    formik.errors.confirmPassword
                  }
                />
              </div>

              <button type="submit" className="form-btn">
                SUBMIT
              </button>
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

export default Resetpassword;
