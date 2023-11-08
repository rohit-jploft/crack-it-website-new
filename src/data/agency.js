import Axios from "axios";
import { BASE_URL } from "../constant";
import { objectToFormData } from "../helper/helper";

export const addNewAgencyExpert = async (data, profilePhoto) => {
  const userId = localStorage.getItem("userId");
  try {
    let formData = new FormData();
    if (profilePhoto) {
      formData.append("firstName", data.firstName);
      formData.append("lastName", data.lastName);
      formData.append("email", data.email);
      formData.append("phone", data.phone);
      formData.append("password", data.password);
      formData.append("description", data.description);
      formData.append("jobCategory", data.jobCategory);
      formData.append("price", data.price);
    //   formData.append("expertise", data.expertise);
    //   formData.append("languages", data.languages);
      formData.append("experience", data.experience);
      formData.append("profilePic", profilePhoto);
      formData.append("agency", userId);
      data.languages.forEach((language, index) => {
        formData.append(`languages[${index}]`, language);
      });
      data.expertise.forEach((skill, index) => {
        formData.append(`expertise[${index}]`, skill);
      });
      
    }
    const res = await Axios.post(
      `${BASE_URL}agency/add/expert`,
      profilePhoto ? formData : { ...data, agency: userId.toString() }
    );
    console.log(res, "response --------");
    return res?.data;
  } catch (error) {
    return error;
  }
};

export const getAllAgencyExpert = async () => {
  const userId = localStorage.getItem("userId");
  try {
    const getData = await Axios.get(`${BASE_URL}agency/experts/all/${userId}`);
    return getData.data;
  } catch (error) {
    return error;
  }
};

export const deleteAgencyExpert = async (userId) => {
  try {
    const res = await Axios.delete(`${BASE_URL}agency/expert/delete/${userId}`);
    return res;
  } catch (error) {
    return error;
  }
};
export const updateAgencyProfile = async (userId, data) => {
  try {
    const resp = await Axios.put(
      `${BASE_URL}agency/expert/update/${userId}`,
      data
    );
    console.log(data, " response dataaaaaaaa");
    return resp?.data;
  } catch (error) {
    return error.message;
  }
};
