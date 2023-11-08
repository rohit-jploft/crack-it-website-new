import { messaging } from "../firebase/firebase";


export function subscribeToNotifications() {
    messaging.requestPermission()
      .then(() => {
        console.log('Notification permission granted.');
        return messaging.getToken();
      })
      .then((token) => {
        console.log(token)
        // Store this token in your database for later use.
      })
      .catch((error) => {
        console.error('Unable to get permission or token:', error);
      });
  }
  