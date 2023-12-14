import Axios from "axios";
import { BASE_URL } from "../constant";

export const deleteBank = async (bankId) => {
  try {
    const deleteBan = await Axios.put(`${BASE_URL}bank/delete/${bankId}`);
    console.log(deleteBan);
    return deleteBan?.data;
  } catch (error) {
    return error;
  }
};
