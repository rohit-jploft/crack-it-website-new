import Axios from "axios";
import { BASE_URL } from "../constant";
import { objectToFormData } from "../helper/helper";

export const addNewAgencyExpert = async (data) => {
  const userId = localStorage.getItem("userId");
  try {

    const res = await Axios.post(`${BASE_URL}agency/add/expert`, {
      ...data,
      agency: userId.toString(),
    });
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
