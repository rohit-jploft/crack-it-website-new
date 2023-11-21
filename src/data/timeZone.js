import { BASE_URL, geoapify_key } from "../constant";
import Axios from "axios";
export const getAllTimeZones = async () => {
  try {
    const timeZones = await Axios.get(`${BASE_URL}timezone/get/all`);
    return timeZones.data.data;
  } catch (error) {
    return error.message;
  }
};
export const getTimeZoneFromLatLong = async () => {
  let lat, long;
  const userId = localStorage.getItem("userId")
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      console.log(latitude, "lat")
      console.log(longitude, "long")
      lat = latitude;
      long = longitude;
      const data = await Axios.get(
        `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&format=json&apiKey=${geoapify_key}`
      );
      console.log(data.data.results[0].timezone.abbreviation_STD, "timeZone response");
    });
  }
 
};
