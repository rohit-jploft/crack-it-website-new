import React, { createContext, useState } from "react";
export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [phoneForOtp, setPhoneForOtp] = useState();
  const [emailForOtp, setEmailForOtp] = useState();
  const [typeForOtp, setTypeForOtp] = useState();
  const [resetToken, setResetToken] = useState();
  const [profileData, setProfileData] = useState();
  const [walletAmount, setWalletAmount] = useState();
  const [isExpertVerified, setExpertVerified] = useState();
  const [profileSetupData, setProfileSetupData] = useState();
  const [preEditExpertData, setPreEditExpertData] = useState();
  const [isNewAccount, setIsNewAccount] = useState(null);
  const [isFirstBookingDone, setIsFirstBookingDone] = useState(null);

  return (
    <UserContext.Provider
      value={{
        setPhoneForOtp,
        phoneForOtp,
        resetToken,
        setResetToken,
        profileData,
        setProfileData,
        walletAmount,
        setWalletAmount,
        isExpertVerified,
        setExpertVerified,
        profileSetupData,
        emailForOtp,
        setEmailForOtp,
        setProfileSetupData,
        preEditExpertData,
        setPreEditExpertData,
        isNewAccount,
        setIsNewAccount,
        isFirstBookingDone,
        setIsFirstBookingDone,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
