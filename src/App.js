import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./Pages/Home";
import "bootstrap/dist/css/bootstrap.min.css";

import "react-toastify/dist/ReactToastify.css";
import { isAuthenticated } from "./utils/authHelper";
import Router from "./routes";
import { useEffect } from "react";
import { messaging } from "./firebase/firebase";
import { getToken } from "firebase/messaging";
import { BASE_URL, VAPID_KEY } from "./constant";
import Axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function App() {
  const requestPermission = async () => {
    const usertoken = localStorage.getItem("userId");
    const permission = await Notification.requestPermission();
    console.log(permission, "permission");
    if (permission == "granted") {
      // generate token
      const config = {
        headers: {
          Authorization: `${usertoken}`,
        },
      };

      const tokenw = await getToken(messaging, {
        vapidKey: VAPID_KEY,
      });
      console.log(tokenw, "token");

      localStorage.setItem("firebasetoken", tokenw);

      if (tokenw) {
        try {
          const res = await Axios.put(
            `${BASE_URL}notification/save/deviceToken/${usertoken}`,
            {
              deviceToken: tokenw,
              type: "web",
            }
          );
          console.log(res, "save the device token res");
          // if (res.status == 200) {
          //   toast.success(res.data.message);
          // }
        } catch (error) {
          console.log(error.message);
          // toast.error(error.message);
        }
      } else {
        return "";
      }
    } else if (permission == "denied") {
      // toast.error("You Are Not Giving Any Permission For Notification");
    }
  };
  useEffect(() => {
    // permission for notification
    requestPermission();
  }, []);
  return (
    <div className="App">
      <BrowserRouter>
        <ToastContainer />
        <Router />
      </BrowserRouter>
    </div>
  );
}

export default App;
