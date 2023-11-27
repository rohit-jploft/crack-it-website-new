import "./../style.css";
import Logo from "./../Images/logo.png";
import RightBg from "./../Images/right_bg.jpg";
import { Link, useNavigate } from "react-router-dom";
import { Checkbox, FormControlLabel } from "react-dom";

import Pot from "./../Images/pot.svg";
import Msg from "./../Images/msg.svg";
import Google from "./../Images/Google.svg";
import Visible from "./../Images/visible.svg";
import TextInput from "../components/InputField";
import { useFormik } from "formik";
import defaultProfileImage from "../Images/default_avatar.png";
import * as Yup from "yup"; // Import Yup for validation
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/userContext";
import Axios from "axios";
import { AVATAR_BASE_URL, BASE_URL } from "../constant";
import PhoneInput from "react-phone-input-2";
import { ModelContext } from "../context/ModelContext";
import AvatarModel from "../components/AvatarModel";
const validationSchema = Yup.object().shape({
  firstName: Yup.string().required("First Name is required"),
  lastName: Yup.string().required("Last Name is required"),
  email: Yup.string()
    .matches(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Invalid email")
    .email("Invalid email format")
    .required("Email is required"),
  phone: Yup.string().required("Phone is required"),
  // .matches(
  //   /^[0-9]{10}$/, // You can adjust the regular expression to match your desired format
  //   "Phone number must be exactly 10 digits"
  // ),
  experience: Yup.number().required("experience is required"),
  description: Yup.string()
    .min(100, "Description should minimum length of 100")
    .required("Description is required"),
  price: Yup.number().required("price is required"),
  languages: Yup.array(
    Yup.string().required("Atleast one language is required")
  ),
});
const SetupExpertProfile = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState();
  const { profileSetupData, setProfileSetupData } = useContext(UserContext);
  const { open, setOpen } = useContext(ModelContext);
  const [dailCode, setDialCode] = useState();
  const [avatarSvg, setAvatarSvg] = useState("");
  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      description: "",
      experience: "",
      price: "",
      languages: [],
    },
    onSubmit: (values) => {
      // Handle form submission here
      setProfileSetupData(values);
      navigate("/JobCategory");
      console.log(values);
    },
    validationSchema,
  });
  const expertUserId = localStorage.getItem("userId");
  const handleCheckboxChange = (event, value) => {
    const { name, checked } = event.target;
    const { languages } = formik.values;

    if (checked) {
      // If checkbox is checked, add the value to the array
      formik.setFieldValue(name, [...languages, value]);
    } else {
      // If checkbox is unchecked, remove the value from the array
      formik.setFieldValue(
        name,
        languages.filter((language) => language !== value)
      );
    }
  };
  const getUserData = async () => {
    const token = localStorage.getItem("token");
    const res = await Axios.get(`${BASE_URL}auth/user/detail`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (res.data.data) {
      setUserData(res.data.data);
      formik.setFieldValue("firstName", res.data.data?.firstName);
      formik.setFieldValue("lastName", res.data.data?.lastName);
      formik.setFieldValue("email", res.data.data?.email);
      formik.setFieldValue("phone", res.data.data?.phone);
    }
  };
  useEffect(() => {
    getUserData();
  }, []);
  return (
    <>
      <section className="main_sect">
        <div className="content-left">
          <div className="brand-logo">
            <img src={Logo} alt="Logo" />
          </div>
          <AvatarModel
            show={open}
            handleClose={() => setOpen(false)}
            id={expertUserId}
            onlySet={expertUserId ? false : true}
            setAvatarSvg={(value) => setAvatarSvg(value)}
          />
          <div className="signup-form form_sect">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                formik.handleSubmit();
              }}
            >
              <div class="profileSetup">
                <h2>Profile Setup</h2>
                <div class="expert-image">
                  <img
                    src={
                      userData && userData.profilePhoto
                        ? `${AVATAR_BASE_URL}${userData.profilePhoto}`
                        : defaultProfileImage
                    }
                    alt="Img"
                  />
                  <button
                    type="button"
                    class="profile-img-edit btn btn-primary"
                    onClick={() => setOpen(true)}
                  >
                    <img
                      src="/static/media/edit.0543f4f52dca0cf68ddf82ec128fb432.svg"
                      alt="img"
                    />
                  </button>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <TextInput
                    name="firstName"
                    type="text"
                    label="First Name *"
                    readonly={true}
                    value={formik.values.firstName}
                    handleChange={formik.handleChange}
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
                    name="lastName"
                    type="text"
                    label="Last Name *"
                    readonly={true}
                    value={formik.values.lastName}
                    handleChange={formik.handleChange}
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
                    name="email"
                    type="email"
                    label="Email *"
                    readonly={true}
                    value={formik.values.email}
                    handleChange={formik.handleChange}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                  />
                </div>
                <div className="col-md-6">
                  {/* <TextInput
                    name="phone"
                    type="number"
                    label="Phone *"
                    readonly={true}
                    value={formik.values.phone}
                    handleChange={formik.handleChange}
                    error={formik.touched.phone && Boolean(formik.errors.phone)}
                    helperText={formik.touched.phone && formik.errors.phone}
                  /> */}
                  <PhoneInput
                    name="phone"
                    label="Phone Number *"
                    autoCorrect="off"
                    placeholder="Enter a Valid Phone Number"
                    country={"in"}
                    style={{ outerWidth: "100%" }}
                    value={`+${userData?.phone}`}
                    // value={formik.values.phone}
                    onChange={(phone, e) => {
                      console.log("phone", phone);
                      console.log("e", e);
                      setDialCode(e.dialCode);
                      formik.setFieldValue("phone", phone);
                      // setMobileNumberCountryCode(phone)

                      // setFieldValue("mobilenumberCountryCode", phone);
                    }}
                    disabled={true}
                    error={formik.touched.phone && Boolean(formik.errors.phone)}
                    helperText={formik.touched.phone && formik.errors.phone}
                  />
                      {formik.touched.phone && Boolean(formik.errors.phone) && <span style={{color:"red", fontSize:"14px"}}>{formik.touched.phone && formik.errors.phone}</span>}
                </div>

                <div className="col-md-12">
                  <div class="input-field">
                    <label for="exampleFormControlInput1" class="form-label">
                      Description
                    </label>
                    <textarea
                      name="description"
                      type="text"
                      class="form-control"
                      id="exampleFormControlInput1"
                      onChange={formik.handleChange}
                      value={formik.values.description}
                      placeholder=""
                      rows={3}
                    />
                    {formik.touched.description &&
                      Boolean(formik.errors.description) && (
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
                          {formik.touched.description && (
                            <span>{formik.errors.description}</span>
                          )}
                        </div>
                      )}
                  </div>
                </div>
                <div className="col-md-6">
                  <div class="input-field price">
                    <TextInput
                      label="Price *"
                      name="price"
                      type="number"
                      value={formik.values.price}
                      handleChange={(e) => {
                        const inputValue = e.target.value;
                        // Custom validation: Allow only numbers and limit to 10 digits.
                        const regex = /^(?!.*e)\d{0,5}$/;
                        if (regex.test(inputValue)) {
                          formik.setFieldValue("price", inputValue);
                        }
                      }}
                      error={
                        formik.touched.price && Boolean(formik.errors.price)
                      }
                      helperText={formik.touched.price && formik.errors.price}
                    />
                    <div class="price-icon">$</div>
                  </div>
                </div>
                <div className="col-md-6">
                  <TextInput
                    name="experience"
                    type="number"
                    label="Experience *"
                    value={formik.values.experience}
                    handleChange={formik.handleChange}
                    error={
                      formik.touched.experience &&
                      Boolean(formik.errors.experience)
                    }
                    helperText={
                      formik.touched.experience && formik.errors.experience
                    }
                  />
                </div>
                <div className="col-md-6">
                  <div class="input-field language-field">
                    <h6>Language</h6>
                    <div class="language-checkbox">
                      {["US English", "German", "Italian", "French"].map(
                        (lang, index) => {
                          return (
                            <div key={index}>
                              <input
                                type="checkbox"
                                id=""
                                name="languages"
                                checked={formik.values.languages.includes(lang)}
                                onChange={(e) => handleCheckboxChange(e, lang)}
                              />
                              <label for="">{lang}</label>
                            </div>
                          );
                        }
                      )}
                      {formik.touched.languages &&
                        Boolean(formik.errors.languages) && (
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
                            {formik.touched.languages && (
                              <span>{formik.errors.languages}</span>
                            )}
                          </div>
                        )}
                      {/* <div>
                        <input type="checkbox" id="" name="" value="" />
                        <label for=""> US English</label>
                      </div>
                      <div>
                        <input type="checkbox" id="" name="" value="" />
                        <label for=""> German</label>
                      </div>
                      <div>
                        <input type="checkbox" id="" name="" value="" />
                        <label for=""> Italian</label>
                      </div>
                      <div>
                        <input type="checkbox" id="" name="" value="" />
                        <label for=""> French</label>
                      </div> */}
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <button type="submit" className="form-btn setuprofile-btn">
                  CONTINUE
                </button>
              </div>
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

export default SetupExpertProfile;
