import { BASE_URL } from "../constant"
import Axios from "axios";
export const getAllTimeZones = async () => {
    try {
        const timeZones = await Axios.get(`${BASE_URL}timezone/get/all`)
        return timeZones.data.data
    } catch (error) {
        return error.message;
    }
}