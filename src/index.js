import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BookingProvider } from "./context/bookingContext";
import { UserProvider } from "./context/userContext";
import { AgencyContext, AgencyProvider } from "./context/agencyContext";
import { PaymentProvider } from "./context/paymentContext";
import { ModelProvider } from "./context/ModelContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BookingProvider>
      <UserProvider>
        <AgencyProvider>
          <PaymentProvider>
            <ModelProvider>
              <App />
            </ModelProvider>
          </PaymentProvider>
        </AgencyProvider>
      </UserProvider>
    </BookingProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
