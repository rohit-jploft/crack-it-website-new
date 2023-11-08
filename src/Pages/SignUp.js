import "./../style.css";
import Logo from "./../Images/logo.png";
import RightBg from "./../Images/right_bg.jpg";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Checkbox, FormControlLabel } from "react-dom";
import Pot from "./../Images/pot.svg";
import Msg from "./../Images/msg.svg";
import Google from "./../Images/Google.svg";
import Visible from "./../Images/visible.svg";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup"; // Import Yup for validation
import { createUser } from "../data/user";
import { TextField } from "@mui/material";
import TextInput from "../components/InputField";
import PhoneInput from "react-phone-input-2";

const validationSchema = Yup.object().shape({
  firstName: Yup.string()
    .matches(/^[A-Za-z]+$/, "First Name can only contain letters")
    .required("First Name is required"),
  lastName: Yup.string()
    .matches(/^[A-Za-z]+$/, "Last Name can only contain letters")
    .required("Last Name is required"),
  email: Yup.string()
    .matches(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Invalid email")
    .email("Invalid email format")
    .required("Email is required"),
  phone: Yup.string()
    .matches(
      /^[0-9]{10}$/, // You can adjust the regular expression to match your desired format
      "Phone number must be exactly 10 digits"
    )
    .required("Phone number is required"),
  password: Yup.string()
    .required("Password is required")
    .matches(
      /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/,
      "Password must contain at least 8 characters, one uppercase letter, one number, and one special character"
    ),
  confirmPassword: Yup.string()
    .required("Confirm Password is required")

    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .matches(
      /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/,
      "Password must contain at least 8 characters, one uppercase letter, one number, and one special character"
    ),
  termAndConditions: Yup.boolean()
    .oneOf([true], "You must agree to the Terms and Conditions") // Ensure it's true
    .required("You must agree to the Terms and Conditions"),
});

const Signup = (props) => {
  const [created, setCreated] = useState(false);
  const { referedBy } = useParams();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [dailCode, setDialCode] = useState();

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      termAndConditions: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      console.log(values);
      setCreated(true);
      // alert(JSON.stringify(values, null, 2));
      const { firstName, lastName, email, password, phone, termAndConditions } =
        values;
      let bodyObj = {
        firstName,
        lastName,
        email,
        password,
        phone,
        termAndConditions,
      };
      if (referedBy) {
        bodyObj.referBy = referedBy.toString();
      }
      const res = await createUser(bodyObj, dailCode, props.isAdmin);
      console.log(res, "response signup");
      if (res.response && res.response.data) {
        toast.error(res.response.data.message, {
          autoClose: 800,
        });
      }
      if (res && res?.data && res.data?.userId) {
        toast.success(res.message, {
          onClose: () => {
            setCreated(false);
            navigate("/login");
          },
          autoClose: 800,
        });
        // props.close(false);
      }
      if (res?.type === "error" && res?.status === 200)
        toast(res.message, { type: "error" });
      setCreated(false);
    },
  });
  const handleKeyPress = (e) => {
    // Get the pressed key
    const pressedKey = e.key;

    // Check if the pressed key is "e" or "i"
    if (pressedKey === 'e' || pressedKey === 'i') {
      // Prevent the keypress from being added to the input value
      e.preventDefault();
    }
  };
  return (
    <>
      <ToastContainer />
      <section className="main_sect">
        <div className="content-left">
          <div className="brand-logo">
            <img src={Logo} alt="Logo" />
          </div>
          <div className="signup-form form_sect">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                formik.handleSubmit();
              }}
            >
              <h2>Register</h2>
              <p>Create your account</p>
              <div className="row">
                <div className="col-md-6">
                  <TextInput
                    type="text"
                    name="firstName"
                    value={formik.values.firstName}
                    handleChange={(e) => {
                      const inputValue = e.target.value;
                            // Custom validation: Allow only numbers and limit to 10 digits.
                            if(inputValue === ""){
                              formik.setFieldValue('firstName',inputValue )
                            }
                          const regex = /^[A-Za-z]+$/;
                          if (regex.test(inputValue)) {
                            formik.setFieldValue("firstName", inputValue);
                          }
                    }}
                    label="First Name *"
                    error={
                      formik.touched.firstName &&
                      Boolean(formik.errors.firstName)
                    }
                    helperText={
                      formik.touched.firstName && formik.errors.firstName
                    }
                  />
                </div>
                <div className="col-md-6">
                  <TextInput
                    type="number"
                    name="phone"
                    label="Phone Number *"
                    
                    value={formik.values.phone}
                    handleChange={(e) => {
                      const inputValue = e.target.value;
                            // Custom validation: Allow only numbers and limit to 10 digits.
                          const regex = /^\d{0,10}$/;
                          if (regex.test(inputValue)) {
                            formik.setFieldValue("phone", inputValue);
                          }
                    }}
                    error={formik.touched.phone && Boolean(formik.errors.phone)}
                    helperText={formik.touched.phone && formik.errors.phone}
                  />
                  {/* <PhoneInput
                  country={'in'}
                  className="country-selector"
                  
                  enableSearch
                  name="phone"
                  inputProps={{
                    name: 'phone',
                  }}
                  value={`+${dailCode}`}
                  onKeyDown={(e) => e.preventDefault()}
                  onChange={(phone, e) => {
                    console.log('phone', phone);
                    console.log('e', e);
                    setDialCode(e.dialCode);
                    // setMobileNumberCountryCode(phone)

                    // setFieldValue("mobilenumberCountryCode", phone);
                  }}
                />
                <div className="phone-number-fils">
                  <TextInput
                    name="phone"
                    type="number"
                  
                   
                    {...formik.getFieldProps('phone')}
                    onChange={(e)=>{
                      if (e.target.value.toString().length <= 10) {
                        formik.handleChange(e)
                      }
                      
                    }}
                    value={formik.values.phone}
                    error={formik.touched.phone && Boolean(formik.errors.phone)}
                    helperText={formik.touched.phone && formik.errors.phone}
                  />
                </div> */}
                </div>
                <div className="col-md-6">
                  <TextInput
                    type="text"
                    name="lastName"
                    value={formik.values.lastName}
                    handleChange={(e) => {
                      const inputValue = e.target.value;
                            // Custom validation: Allow only numbers and limit to 10 digits.
                            if(inputValue === ""){
                              formik.setFieldValue('lastName',inputValue )
                            }
                          const regex = /^[A-Za-z]+$/;
                          if (regex.test(inputValue)) {
                            formik.setFieldValue("lastName", inputValue);
                          }
                    }}
                    label="Last Name *"
                    error={
                      formik.touched.lastName && Boolean(formik.errors.lastName)
                    }
                    helperText={
                      formik.touched.lastName && formik.errors.lastName
                    }
                  />
                </div>
                <div className="col-md-6">
                  <TextInput
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formik.values.password}
                    handleChange={formik.handleChange}
                    label="Password *"
                    showPassword={showPassword}
                    setShowPassword={(value) => setShowPassword(value)}
                    error={
                      formik.touched.password && Boolean(formik.errors.password)
                    }
                    helperText={
                      formik.touched.password && formik.errors.password
                    }
                  />
                </div>
                <div className="col-md-6">
                  <TextInput
                    type="email"
                    label="Email *"
                    name="email"
                    value={formik.values.email}
                    handleChange={formik.handleChange}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                  />
                </div>
                <div className="col-md-6">
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

                  {/* <span style={{ color: "red", fontSize: "10px", marginTop:'-7px' }}>error</span> */}
                </div>
                <div class="checkbox_div">
                  <input
                    type="checkbox"
                    name="termAndConditions"
                    id="3"
                    value={formik.values.termAndConditions}
                    onChange={formik.handleChange}
                  />
                  <label for="">
                    {" "}
                    By signing up, you're agree to our{" "}
                    <span>Terms & Conditions</span> and{" "}
                    <span>Privacy Policy</span>
                  </label>
                  {formik.touched.termAndConditions &&
                    Boolean(formik.errors.termAndConditions) && (
                      <div
                        style={{
                          color: "red",
                          textAlign: "left",
                          marginLeft: "9px",
                          fontSize: "13px",
                          marginBottom: "-4px",
                          marginTop: "3px",
                        }}
                      >
                        <span>
                          {formik.touched.termAndConditions &&
                            formik.errors.termAndConditions}
                        </span>
                      </div>
                    )}
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <button type="submit" className="form-btn">
                      SIGN UP
                    </button>
                  </div>
                  {/* <div className="col-md-6">
                    <button className="signup-btn">
                      <img src={Google} alt="" /> SIGN UP WITH GOOGLE
                    </button>
                  </div> */}
                </div>
              </div>

              <p className="para-btm">
                I have an account? <Link to="/Login">Login</Link>
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

export default Signup;
