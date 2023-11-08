// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

import { getMessaging } from "firebase/messaging";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCR43VTwx11WjV95PiBf6HJMIayXxrh7zY",
  authDomain: "crackit-d3bfb.firebaseapp.com",
  projectId: "crackit-d3bfb",
  storageBucket: "crackit-d3bfb.appspot.com",
  messagingSenderId: "767742891503",
  appId: "1:767742891503:web:526c1e6910092ac33ad21a",
  measurementId: "G-W2XG2EHR99"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const messaging = getMessaging(app);
