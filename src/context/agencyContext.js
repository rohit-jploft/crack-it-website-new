import React, { createContext, useState } from "react";
export const AgencyContext = createContext();

export const AgencyProvider = ({ children }) => {
  const [newAgencyExpert, setNewAgencyExpert] = useState();
  const [AgencyExpertJobCategory, setAgencyExpertJobCategory] = useState();
  const [agencyExpertSubCategory, setAgencyExpertSubCategory] = useState();
  const [agencyExpertSkills, setAgencyExpertSkills] = useState([]);

  return (
    <AgencyContext.Provider
      value={{
        newAgencyExpert,
        setNewAgencyExpert,
        AgencyExpertJobCategory,
        setAgencyExpertJobCategory,
        agencyExpertSubCategory,
        setAgencyExpertSubCategory,
        agencyExpertSkills,
        setAgencyExpertSkills,
      }}
    >
      {children}
    </AgencyContext.Provider>
  );
};
