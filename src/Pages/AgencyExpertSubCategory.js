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
import { isExpert } from "../utils/authHelper";
import { UserContext } from "../context/userContext";
import Axios from "axios";
import { BASE_URL } from "../constant";
import { AgencyContext } from "../context/agencyContext";
const AgencyExpertSubCategory = () => {
  const navigate = useNavigate();
  const [key, setKey] = useState();
  const {
    subCategory,
    setSubCategory,
  } = useContext(BookingContext);
  const {
    newAgencyExpert,
    setNewAgencyExpert,
    AgencyExpertJobCategory,
    setAgencyExpertJobCategory,
    agencyExpertSubCategory,
    setAgencyExpertSubCategory,
    agencyExpertSkills,
    setAgencyExpertSkills,
  } = useContext(AgencyContext);
  const [subCategoryData, setSubCategoryData] = useState();
  const [skills, setSkills] = useState();
  const [search, setSearch] = useState("");
  console.log(AgencyExpertJobCategory);
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

  useEffect(() => {
    getSubCatData(AgencyExpertJobCategory);
  }, [AgencyExpertJobCategory]);
  useEffect(() => {
    getSkillsData(agencyExpertSubCategory, search);
  }, [agencyExpertSubCategory, search]);
  useEffect(() => {
    if (!setAgencyExpertJobCategory) {
      navigate("/agency/add/expert/jobCategory");
    }
    if (
      !setNewAgencyExpert?.description ||
      !setNewAgencyExpert?.languages ||
      !setNewAgencyExpert?.price ||
      !setNewAgencyExpert?.experience
    ) {
      if (isThisExpert) {
        navigate("/agency/add/expert");
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
      setAgencyExpertSkills(newArr);
    } else {
      // String already exists in the array, so remove it
      newArr.splice(index, 1);
      setAgencyExpertSkills(newArr);
    }
  }
  console.log(setNewAgencyExpert, "setNewAgencyExpert");
  console.log("data", agencyExpertSkills);

//   const setupExpertProfileData = async () => {
//     const user = localStorage.getItem("userId");
//     const data = {
//       user,
//       description: setNewAgencyExpert?.description,
//       price: setNewAgencyExpert?.price,
//       languages: setNewAgencyExpert?.languages,
//       jobCategory: jobCategory,
//       expertise: storeSkills,
//       experience: setNewAgencyExpert.experience,
//     };
//     const res = await Axios.post(`${BASE_URL}expert/profile/setup`, {
//       ...data,
//     });
//     if (res && res.data && res.data.message) {
//       toast.success(res.data.message, { autoClose: 500 });
//       setTimeout(() => {
//         navigate("/mybookings");
//       }, 1000);
//     }
//     if (res?.data?.success) {
//       console.log("hello in");
//       toast.success("Profile setup successfully", { autoClose: 500 });
//       setTimeout(() => {
//         navigate("/mybookings");
//       }, 1000);
//     }
//     console.log(res);
//   };
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
                    activeKey={agencyExpertSubCategory}
                    onSelect={(k) => setAgencyExpertSubCategory(k)}
                  >
                    {subCategoryData?.map((item) => {
                      return (
                        <Tab eventKey={item?._id} title={item?.title}>
                          <div className="categ-technology">
                            {skills?.map((skil) => {
                              return (
                                <div
                                  class={`techno ${
                                    agencyExpertSkills.includes(skil?._id)
                                      ? "active"
                                      : ""
                                  }`}
                                  onClick={() =>
                                    toggleSkillInArray(agencyExpertSkills, skil._id)
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
                      console.log({...newAgencyExpert, AgencyExpertJobCategory, agencyExpertSubCategory})
                    //   if (storeSkills.length > 0 && !isThisExpert) {
                    //     navigate("/RequestCateg");
                    //   }
                    //   if (storeSkills.length === 0) {
                    //     toast.error("please select atleast one skill");
                    //   }
                    //   if (isThisExpert) {
                    //     setupExpertProfileData();
                    //   }
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

export default AgencyExpertSubCategory;
