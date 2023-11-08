import Axios from "axios";
import { BASE_URL } from "../constant";

export const getExpertProfile = async (userId) => {
  try {
    const data = await Axios.get(`${BASE_URL}expert/get/profile/${userId}`);
    return data.data;
  } catch (error) {
    return error.message;
  }
};
export const getAgencyProfile = async (userId) => {
  try {
    const data = await Axios.get(`${BASE_URL}agency/profile/${userId}`);
    return data.data;
  } catch (error) {
    return error.message;
  }
};

export const updateExpertProfile = async (userId, data) => {
  try {
    const resp = await Axios.put(`${BASE_URL}expert/profile/update/${userId}`, data)
    console.log(data," response dataaaaaaaa")
    return resp?.data;
  } catch (error) {
    return error.message;
  }
}

