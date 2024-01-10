import "./../style.css";
import Logo from "./../Images/logo.png";
import RightBg from "./../Images/right_bg.jpg";
import { Link, useNavigate } from "react-router-dom";
import Pot from "./../Images/pot.svg";
import Msg from "./../Images/msg.svg";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useContext, useState } from "react";
import { FormikProvider, useFormik } from "formik";
import * as Yup from "yup"; // Import Yup for validation
import TextInput from "../components/InputField";
import { ForgotPasswordSendOtp } from "../data/user";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserContext } from "../context/userContext";
import Loader from "../components/Loader";

const phoneOrEmailSchema = Yup.string().test('phoneOrEmail', 'Invalid phone or email', (value) => {
  if (!value) return true; // Allow empty input

  // Define regular expressions for phone number and email validation
  const phoneRegex = /^[0-9]+$/;
  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;

  // if (phoneRegex.test(value) || emailRegex.test(value)) {
  if (value.length >= 12) {
    return true; // Valid phone number or email
  } else {
    return false; // Invalid input
  }
});

const Forgotpassword = () => {
  const navigate = useNavigate();
  const [dailCode, setDialCode] = useState("+91");
  const [isLoading, setIsLoading] = useState(false)
  const [disableButton, setDisableButton]= useState(false)
  const { setPhoneForOtp, phoneForOtp, emailForOtp, setEmailForOtp } = useContext(UserContext);
  const formik = useFormik({
    initialValues: {
      // phone: "",
      email:""
    },
    validationSchema: Yup.object().shape({
      // phone: Yup.string()
      //   // .matches(
      //   //   /^[0-9]{10}$/, // You can adjust the regular expression to match your desired format
      //   //   "Phone number must be exactly 10 digits"
      //   // )
      //   .required("Phone number is required"),
      email: Yup.string()
      .matches(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Invalid email")
      .email("Invalid email format")
      .required("Email is required"),
    }),
    onSubmit: async (values) => {
      // const { phone } = values;
      setIsLoading(true)
      const { email } = values;
      const res = await ForgotPasswordSendOtp(email, "EMAIL");
      console.log(res, "response signup");
      if (res.response && res.response.data.data) {
        setIsLoading(false)
        toast.error(res.response.data.data.message, {
          autoClose: 800,
        });
      }
      if (res && res?.message && res?.success) {
        setEmailForOtp(email);
        setDisableButton(true)
        setIsLoading(false)

        setTimeout(() => {
          setDisableButton(false)

        },3500 )
        toast.success("OTP Sent successfully")
        navigate('/otp')
      
        // props.close(false);
      }
      if (!res?.success && res?.status === 200)
        toast(res.message, { type: "error" , autoClose:500});
        setDisableButton(true)
        setIsLoading(false)
        
        setTimeout(() => {
          setDisableButton(false)
        },1500 )
    },
  });
  return (
    <>
      <ToastContainer />
      <section className="main_sect">
        <div className="content-left">
          <Loader open={isLoading} title={"Sending OTP ..."}/>
          <div className="brand-logo" onClick={() => navigate("/")} style={{cursor:"pointer"}}>
            <img src={Logo} alt="Logo" />
          </div>
          <div className="login-form form_sect">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                formik.handleSubmit();
              }}
            >
              <h2>Forgot Password?</h2>
              <p>Enter your details below</p>
              <div class="hellos">
                {/* <PhoneInput
                  country={"in"}
                  className="country-selector"
                  enableSearch
                  name="phone"
                  inputProps={{
                    name: "phone",
                  }}
                  inputStyle={{
                    height:"45px",
                    width:"100%"
                  }}
                  value={`+${dailCode}`}
                  onKeyDown={(e) => e.preventDefault()}
                  onChange={(phone, e) => {
                    console.log("phone", phone);
                    console.log("e", e);
                    setDialCode(e.dialCode);
                    // setMobileNumberCountryCode(phone)

                    // setFieldValue("mobilenumberCountryCode", phone);
                  }}
                />
                    <div className="phone-number-fils"> */}
                <div>
                  <TextInput
                    name="email"
                    type="text"
                    handleChange={(e) => {
                      const inputValue = e.target.value;
                            // Custom validation: Allow only numbers and limit to 10 digits.
                          // const regex = /^\d{0,10}$/;
                          // if (regex.test(inputValue)) {
                            formik.setFieldValue("email", inputValue);
                          // }
                    }}
                    label="Email *"
                    value={formik.values.email}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                  />
                  {/* <PhoneInput
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
                  /> */}
                </div>
              </div>
              <button type="submit" disabled={disableButton} className="form-btn">
                CONTINUE
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

export default Forgotpassword;
