import React, { createContext, useState } from "react";
export const PaymentContext = createContext();

export const PaymentProvider = ({ children }) => {
  const [bookingIdAfterPayment, setBookingIdAfterPayment] = useState();
  

  return (
    <PaymentContext.Provider
      value={{
        bookingIdAfterPayment,
        setBookingIdAfterPayment,
      }}
    >
      {children}
    </PaymentContext.Provider>
  );
};
