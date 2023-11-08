import Axios from "axios";
import { BASE_URL } from "../constant";

export const getAllmeetings = async (tabStatus) => {
  const userId = localStorage.getItem("userId");
  const role = localStorage.getItem("role");
  try {
    const res = await Axios.get(
      `${BASE_URL}booking/get-all?tabStatus=${tabStatus}&userId=${userId}&role=${role}`
    );
    return res.data;
  } catch (error) {
    return error;
  }
};
export const getAllAgencymeetings = async (tabStatus, uid) => {
  try {
    const res = await Axios.get(
      `${BASE_URL}booking/get-all?tabStatus=${tabStatus}&userId=${uid}&role=EXPERT`
    );
    return res.data;
  } catch (error) {
    return error;
  }
};
export const getSingleBookingDetail = async (bookingId) => {
  try {
    const res = await Axios.get(`${BASE_URL}booking/single/${bookingId}`);
    return res.data;
  } catch (error) {
    return error;
  }
};
export const getCategoryList = async (parent, search = null) => {
  console.log("parent", parent);

  try {
    let res;
    if (parent && !search) {
      res = await Axios.get(`${BASE_URL}category/get-all?parent=${parent}`);
    }
    if (!parent && search) {
      res = await Axios.get(`${BASE_URL}category/get-all?parent=${parent}`);
    }
    if (parent && search) {
      res = await Axios.get(
        `${BASE_URL}category/get-all?parent=${parent}&search=${search}`
      );
    }
    if (!parent && !search) {
      res = await Axios.get(`${BASE_URL}category/get-all`);
    }
    return res.data;
  } catch (error) {
    return error;
  }
};

export const listExpert = async (search, jobCategory, minExperience, maxExperience, minPrice, maxPrice, rating, typeOfExpert) => {
  try {
    let url = `${BASE_URL}expert/get/all?`;

    const queryParams = {};

    if (search) {
      queryParams.search = search;
    }
    if (jobCategory) {
      queryParams.jobCategory = jobCategory;
    }
    if (rating) {
      queryParams.rating = rating;
    }
    if (typeOfExpert) {
      queryParams.typeOfExpert = typeOfExpert;
    }
    if(minPrice && maxPrice){
      queryParams.startPrice = minPrice;
      queryParams.endPrice = maxPrice;
    }
    if(minExperience && maxExperience){
      queryParams.minExperience = minExperience;
      queryParams.maxExperience = maxExperience;
    }

    const queryString = new URLSearchParams(queryParams).toString();
    console.log(url+queryString, "url+ query")
    const experts = await Axios.get(url+queryString);
    return experts.data;
  } catch (error) {
    return error.message;
  }
};

export const createBooking = async (data) => {
  try {
    const res = await Axios.post(`${BASE_URL}booking/create`, { ...data });
    console.log(res);
    return res.data;
  } catch (error) {
    return error.message;
  }
};
