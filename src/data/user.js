import Axios from "axios";
import { BASE_URL } from "../constant";

// ----------------------------------------------------------------------
export const getUsers = async (role, search, limit, page, isAdmin) => {
  const users = await Axios.get(
    `${BASE_URL}auth/users/all?role=${role}&search=${search}&limit=${limit}&page=${page}&isAdmin=${isAdmin}`
  );
  return users.data;
};
export const changePasswordApi = async (data) => {
  const token = localStorage.getItem("token");
  console.log(token);
  if (token) {
    const res = await Axios.post(
      `${BASE_URL}auth/user/change-password`,
      { oldPassword: data.oldPassword, password: data.newPassword },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  }
  return { message: "Token is missing" };
};
export const createUser = async (data, dailCode) => {
  const body = { ...data, countryCode: `+${dailCode}` };
  //   if (isAdmin) body.role = 'USER';
  //   else body.role = "EXPERT"

  try {
    const createUser = await Axios.post(`${BASE_URL}auth/user/signup`, body);
    return createUser.data;
  } catch (error) {
    return error;
  }
};

// FORGOT PASSWORD STEP 1
export const ForgotPasswordSendOtp = async (phone) => {
  try {
    const res = await Axios.post(
      `${BASE_URL}auth/user/forgot-password/send-otp`,
      { mobile: phone, countryCode: "+91" }
    );
    console.log(res);
    return res.data;
  } catch (error) {
    return error;
  }
};
// step 2
export const forgotPasswordVerifyOtp = async (phone, otp) => {
  try {
    const res = await Axios.post(
      `${BASE_URL}auth/user/forgot-password/verify-otp`,
      { mobile: phone, countryCode: "+91", otp: otp }
    );
    console.log(res);
    return res.data;
  } catch (error) {
    return error;
  }
};
export const isUser = async () => {
  const role = localStorage.getItem("role");
  if (role) {
    if (role === "USER") {
      return true;
    }
    return false;
  }
  return false;
};
export const isExpert = async () => {
  const role = localStorage.getItem("role");
  if (role) {
    if (role === "EXPERT") {
      return true;
    }
    return false;
  }
  return false;
};
export const suspendAccount = async (userId, isDeleted) => {
  try {
    console.log("isDleted", isDeleted);
    const suspendAccount = await Axios.put(
      `${BASE_URL}auth/user/delete/${userId}`,
      {
        isDeleted: !isDeleted,
      }
    );
    return suspendAccount.data;
  } catch (error) {
    return error;
  }
};

export const resetPasswordApi = async (password, token) => {
  if (token) {
    const res = await Axios.post(
      `${BASE_URL}auth/user/forgot-password/set-password`,
      { password: password },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  }
  return { message: "Token is missing" };
};

export const setProfilePicture = async (userId, profilePic) => {
  const newFormData = new FormData();
  if (profilePic) {
    newFormData.append("profilePic", profilePic);
    try {
      const res = await Axios.put(`${BASE_URL}auth/user/set/profile/${userId}`,newFormData );
      return res.data
    } catch (error) {
      return error;
    }
  }
};
