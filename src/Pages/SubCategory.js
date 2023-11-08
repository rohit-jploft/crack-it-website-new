import "./../style.css";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "./Header";
import Container from "react-bootstrap/Container";
import Searchicon from "./../Images/searchicon.svg";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { getCategoryList } from "../data/booking";
import { BookingContext } from "../context/bookingContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { isAgency, isExpert } from "../utils/authHelper";
import { UserContext } from "../context/userContext";
import Axios from "axios";
import { BASE_URL } from "../constant";
const SubCategory = () => {
  const navigate = useNavigate();
  const [key, setKey] = useState();
  const {
    jobCategory,
    subCategory,
    setSubCategory,
    storeSkills,
    setStoreSkills,
  } = useContext(BookingContext);
  const { profileSetupData, setProfileSetupData } = useContext(UserContext);
  const [subCategoryData, setSubCategoryData] = useState();
  const [skills, setSkills] = useState();
  const [search, setSearch] = useState("");
  console.log(jobCategory);
  const getSubCatData = async (parent) => {
    const data = await getCategoryList(parent);
    console.log(data);
    setSubCategoryData(data.data);
  };
  const getSkillsData = async (parent, search) => {
    const data = await getCategoryList(parent, search);
    console.log(data);
    setSkills(data.data);
  };

  // is the expert
  const isThisExpert = isExpert();
  const isThisAgency = isAgency();

  useEffect(() => {
    getSubCatData(jobCategory);
  }, [jobCategory]);
  useEffect(() => {
    getSkillsData(subCategory, search);
  }, [subCategory, search]);
  useEffect(() => {
    if (!jobCategory) {
      navigate("/jobCategory");
    }
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
  }, []);
  function toggleSkillInArray(array, str) {
    let newArr = [...array];
    const index = array.indexOf(str);

    console.log("array, str", array, str);
    if (index === -1) {
      // String doesn't exist in the array, so add it
      newArr.push(str);
      setStoreSkills(newArr);
    } else {
      // String already exists in the array, so remove it
      newArr.splice(index, 1);
      setStoreSkills(newArr);
    }
  }
  console.log(profileSetupData, "profilesetupdata");
  console.log("data", storeSkills);

  const setupExpertProfileData = async () => {
    const user = localStorage.getItem("userId");
    const role = localStorage.getItem("role");
    const data = {
      user,
      description: profileSetupData?.description,
      price: profileSetupData?.price,
      languages: profileSetupData?.languages,
      jobCategory: jobCategory,
      expertise: storeSkills,
      experience: profileSetupData.experience,
    };

    const res = await Axios.post(`${BASE_URL}expert/profile/setup`, {
      ...data,
    });
    if (res && res.data && res.data.message) {
      toast.success(res.data.message, { autoClose: 500 });
      setTimeout(() => {
        navigate(role === "EXPERT" ? "/mybookings" : "/agency/experts/all");
      }, 1000);
    }
    if (res?.data?.success) {
      console.log("hello in");
      toast.success("Profile setup successfully", { autoClose: 500 });
      setTimeout(() => {
        navigate(role === "EXPERT" ? "/mybookings" : "/agency/experts/all");
      }, 1000);
    }
    console.log(res);
  };
  const setupAgencyprofileData = async () => {
    const user = localStorage.getItem("userId");
    const role = localStorage.getItem("role");
    const data = {
      agency:user,
      description: profileSetupData?.description,

      languages: profileSetupData?.languages,
      jobCategory: jobCategory,
      expertise: storeSkills,
      experience: profileSetupData.experience,
    };

    const res = await Axios.post(`${BASE_URL}agency/profile/setup`, {
      ...data,
    });
    if (res && res.data && res.data.message) {
      toast.success(res.data.message, { autoClose: 500 });
      setTimeout(() => {
        navigate(role === "EXPERT" ? "/mybookings" : "/agency/experts/all");
      }, 1000);
    }
    if (res?.data?.success) {
      console.log("hello in");
      toast.success("Profile setup successfully", { autoClose: 500 });
      setTimeout(() => {
        navigate(role === "EXPERT" ? "/mybookings" : "/agency/experts/all");
      }, 1000);
    }
    console.log(res);
  };
  return (
    <>
      <Header />
      <ToastContainer />
      <section className="">
        <Container>
          <div className="main-content">
            <div className="job-categ">
              <div>
                <h3>Categories</h3>
                <div className="search-box">
                  <input
                    type="text"
                    placeholder="Search here..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <img className="search-i" src={Searchicon} alt="Img" />
                </div>
                <div>
                  <Tabs
                    defaultActiveKey="profile"
                    id="uncontrolled-tab-example"
                    className="categ_tabs"
                    activeKey={subCategory}
                    onSelect={(k) => setSubCategory(k)}
                  >
                    {subCategoryData?.map((item) => {
                      return (
                        <Tab eventKey={item?._id} title={item?.title}>
                          <div className="categ-technology">
                            {skills?.map((skil) => {
                              return (
                                <div
                                  class={`techno ${
                                    storeSkills.includes(skil?._id)
                                      ? "active"
                                      : ""
                                  }`}
                                  onClick={() =>
                                    toggleSkillInArray(storeSkills, skil._id)
                                  }
                                  style={{ cursor: "pointer" }}
                                >
                                  {skil?.title}
                                </div>
                              );
                            })}
                          </div>
                        </Tab>
                      );
                    })}
                    {/* <Tab eventKey="Front-end" title="Front-end">
                      <div className="categ-technology">
                        <div class="techno">HTML</div>
                        <div class="techno">CSS</div>
                        <div class="techno">JavaScript</div>
                        <div class="techno">React</div>
                        <div class="techno active">Angular</div>
                        <div class="techno">Vue.js</div>
                        <div class="techno">Bootstrap</div>
                        <div class="techno">Material Design</div>
                        <div class="techno">Sass</div>
                        <div class="techno">Less</div>
                        <div class="techno">TypeScript</div>
                      </div>
                    </Tab>
                    <Tab eventKey="Back-end" title="Back-end">
                      Tab content for Profile
                    </Tab>
                    <Tab eventKey="Databases" title="Databases">
                      Tab content for Contact
                    </Tab>
                    <Tab eventKey="Version control" title="Version control">
                      Tab content for Contact
                    </Tab> */}
                  </Tabs>
                </div>
                <div className="text-center">
                  <button
                    className="btn_continue"
                    onClick={() => {
                      const isThisExpert = isExpert();
                      if (storeSkills.length > 0 && !isThisExpert && !isThisAgency) {
                        navigate("/RequestCateg");
                      }
                      if (storeSkills.length === 0) {
                        toast.error("please select atleast one skill");
                      }
                      if (isThisExpert) {
                        setupExpertProfileData();
                      }
                      if (isThisAgency) {
                        setupAgencyprofileData();
                      }
                    }}
                  >
                    CONTINUE
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
      <ToastContainer />
    </>
  );
};

export default SubCategory;
