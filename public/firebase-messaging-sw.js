// Scripts for firebase and firebase messaging
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js"
);

// Initialize the Firebase app in the service worker by passing the generated config
const firebaseConfig = {
  apiKey: "AIzaSyCR43VTwx11WjV95PiBf6HJMIayXxrh7zY",
  authDomain: "crackit-d3bfb.firebaseapp.com",
  projectId: "crackit-d3bfb",
  storageBucket: "crackit-d3bfb.appspot.com",
  messagingSenderId: "767742891503",
  appId: "1:767742891503:web:526c1e6910092ac33ad21a",
  measurementId: "G-W2XG2EHR99"
};

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.icon,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
