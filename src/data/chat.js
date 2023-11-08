import Axios from "axios";
import { BASE_URL } from "../constant";

export const getConversation = async () => {
  const userId = localStorage.getItem("userId");
  if (userId) {
    const res = await Axios.get(`${BASE_URL}chat/conversation/user/${userId}`);
    return res.data.data;
  }
  return [];
};
export const sendMessage = async (convoId, msg, audio) => {
  const sender = localStorage.getItem("userId");
  const newFormData = new FormData();
  if (audio) {
    newFormData.append("chat", convoId);
    newFormData.append("sender", sender);
    newFormData.append("type", "file");
    newFormData.append("content", audio ? "file" : msg);
    newFormData.append("audio", audio);
  }
  if (audio) console.log(newFormData);
  if (sender) {
    const res = await Axios.post(
      `${BASE_URL}chat/message/send`,
      audio
        ? newFormData
        : { chat: convoId, sender, content: msg, type: "text" }
    );
    return res.data.data;
  }
  return [];
};
export const getConvoMessage = async (convoId) => {
  if (convoId) {
    const res = await Axios.get(
      `${BASE_URL}chat/conversation/messages/${convoId}`
    );
    return res.data.data;
  }
  return [];
};
export const searchConvoApi = async (search) => {
  if (search) {
    const res = await Axios.get(`${BASE_URL}chat/search?search=${search}`);
    return res.data.data;
  }
  return [];
};
export const enterChatAgency = async (meetingId) => {
  const token = localStorage.getItem("token");
  const meetingData = await Axios.post(
    `${BASE_URL}chat/enter/admin?meetingId=${meetingId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return meetingData.data;
};
export const getChatIdFromMeeting = async (meetingId) => {
  const token = localStorage.getItem("token");
  const meetingData = await Axios.get(
    `${BASE_URL}chat/get/from/meeting/${meetingId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return meetingData.data;
};
