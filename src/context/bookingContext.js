import React, { createContext, useState } from "react";
export const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
  const [jobCategory, setJobCategory] = useState();
  const [jobDescription, setJobDescription] = useState();
  const [subCategory, setSubCategory] = useState();
  const [duration, setDuration] = useState();
  const [date, setDate] = useState();
  const [time, setTime] = useState();
  const [timeZone, setTimeZone] = useState();

  const [storeSkills, setStoreSkills] = useState([]);
  const getReqData = {
    jobCategory,
    jobDescription,
    skills:storeSkills,
    date,
    startTime:time,
    duration,
    timeZone
  }
  return (
    <BookingContext.Provider
      value={{
        jobCategory,
        setJobCategory,
        subCategory,
        setSubCategory,
        storeSkills,
        setStoreSkills,
        duration,
        setDuration,
        date,
        setDate,
        time,
        setTime,
        timeZone,
        setTimeZone,
        jobDescription,
        setJobDescription,
        getReqData
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};
