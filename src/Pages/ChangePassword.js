import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import TextInput from "../components/InputField";
import { useNavigate } from "react-router-dom";
import { changePasswordApi } from "../data/user";
import * as Yup from "yup"; // Import Yup for validation
import "react-toastify/dist/ReactToastify.css";
import { useFormik } from "formik";
import Header from "./Header";
import { Button, Container } from "react-bootstrap";

const passwordValidationSchema = Yup.object().shape({
  oldPassword: Yup.string().required("Old Password is required"),
  newPassword: Yup.string()
    .required("New Password is required")
    .min(6, "New Password must be at least 6 characters")

    .notOneOf(
      [Yup.ref("oldPassword")],
      "New Password must be different from Old Password"
    )
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

const ChangePassword = () => {
  const navigate = useNavigate();

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleToggleOldPasswordVisibility = () => {
    setShowOldPassword(!showOldPassword);
  };

  const handleToggleNewPasswordVisibility = () => {
    setShowNewPassword(!showNewPassword);
  };

  const handleToggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };


  const formik = useFormik({
    initialValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: passwordValidationSchema,
    onSubmit: async (values) => {
      console.log(values);
      const res = await changePasswordApi(values);
      console.log(res);
      if (res && res.success && res.status === 200 && res.type === "success") {
        toast.success(res.message, {
          onClose: () => {
            navigate("/mybookings");
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
      <Header />
      <section className="">
        <Container>
          <div className="main-content">
            <div className="job-categ addbank change_password_form">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  formik.handleSubmit();
                }}
              >
                <div className="addbankdetails_field">
                  <h3>Change Password</h3>
                  <div className="in_details">
                    <div class="input-field">
                      <TextInput
                        type={showOldPassword ? "text" : "password"}
                        label="Old Password *"
                        name="oldPassword"
                        handleChange={formik.handleChange}
                        value={formik.values.oldPassword}
                        showPassword={showOldPassword}
                        setShowPassword={(value) => setShowOldPassword(value)}
                        error={
                          formik.touched.oldPassword &&
                          Boolean(formik.errors.oldPassword)
                        }
                        helperText={
                          formik.touched.oldPassword &&
                          formik.errors.oldPassword
                        }
                      />
                    </div>
                    <div class="input-field">
                      <TextInput
                        type={showNewPassword ? "text" : "password"}
                        label="New Password *"
                        name="newPassword"
                        {...formik.getFieldProps("newPassword")}
                        handleChange={formik.handleChange}
                        value={formik.values.newPassword}
                        showPassword={showNewPassword}
                        setShowPassword={(value) => setShowNewPassword(value)}
                        error={
                          formik.touched.newPassword &&
                          Boolean(formik.errors.newPassword)
                        }
                        helperText={
                          formik.touched.newPassword &&
                          formik.errors.newPassword
                        }
                      />
                    </div>
                    <div class="input-field">
                      <TextInput
                        type={showNewPassword ? "text" : "password"}
                        label="Confirm Password *"
                        name="confirmPassword"
                        handleChange={formik.handleChange}
                        value={formik.values.confirmPassword}
                        showPassword={showNewPassword}
                        setShowPassword={(value) => setShowNewPassword(value)}
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
                  </div>

                  <div className="text-center">
                    <Button type="submit" className="btn-pay">
                      Save
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
};
export default ChangePassword;
