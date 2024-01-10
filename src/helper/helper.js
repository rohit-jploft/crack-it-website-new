import { timeZoneList } from "../constant";

export const getDayName = (dayIndex) => {
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return daysOfWeek[dayIndex];
};
export const getTimeFromTimestamps = (timeStamp) => {
  const date = new Date(timeStamp);

  const options = {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true, // Set to false for 24-hour format
  };

  const formattedTime = date.toLocaleTimeString("en-US", options);
  return formattedTime;
};

export const getDateFromTimeStamps = (timeStamp) => {
  const date = new Date(timeStamp);

  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  const formattedDate = date.toLocaleDateString("en-US", options);

  return formattedDate;
};
export function formatEarnings(earnings) {
  if (typeof earnings !== "number") {
    return "Invalid input";
  }
  const k = "k";
  if (earnings >= 1000) {
    return (earnings / 1000).toFixed(1) + k;
  }

  return earnings.toFixed(2); // Display earnings with 2 decimal places
}
export function scrollToBottom(containerId) {
  const container = document.getElementById(containerId);
  if (container) {
    container.scrollTop = container.scrollHeight;
  }
}
export function convertTimeToJsDate(time) {
  const [hours, minutes] = time.split(":").map(Number);
  if (!isNaN(hours) && !isNaN(minutes)) {
    const now = new Date();
    now.setHours(hours);
    now.setMinutes(minutes);
    now.setSeconds(0); // Optionally, set seconds to 0
    return now;
  } else {
    return null; // Invalid time format
  }
}
export function objectToFormData(obj) {
  const formData = new FormData();
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      formData.append(key, obj[key]);
    }
  }
  console.log(formData, "form data");
  return formData;
}
export function getCurrentDate() {
  const today = new Date();
  const year = today.getFullYear();
  let month = today.getMonth() + 1;
  let day = today.getDate();

  // Ensure month and day are in the 'MM' and 'DD' format, respectively
  month = month < 10 ? "0" + month : month;
  day = day < 10 ? "0" + day : day;

  return `${year}-${month}-${day}`;
}

export function addMinutesToDate(date, minutesToAdd) {
  return new Date(date.getTime() + minutesToAdd * 60000);
}
export const convertDateStampToTimeZone = (dateStamp, timeZone) => {
  console.log(dateStamp, timeZone, "inputs");
  const time = timeZoneList.find((t) => t.symbol === timeZone.toString());
  const date = new Date(dateStamp.toString());
  console.log(date, "offSetTime");
  console.log(time, "offSetTime");
  const modifiedDateStamp = addMinutesToDate(date, time.offsetMinutes);

  return new Date(modifiedDateStamp);
};
export function isDateTodayOrAbove(inputDate) {
  // Get the current date in UTC (year-month-date format)
  const currentDate = new Date().toISOString().split("T")[0];

  // Convert the inputDate to a UTC date string
  const inputUTCDate = new Date(inputDate).toISOString().split("T")[0];

  // Compare the input date with the current date
  return inputUTCDate >= currentDate;
}
export function isDateToday(inputDate) {
  const today = new Date();
  const selectedDate = new Date(inputDate);

  // Set hours, minutes, seconds, and milliseconds to 0 for both dates
  today.setHours(0, 0, 0, 0);
  selectedDate.setHours(0, 0, 0, 0);

  return selectedDate.getTime() === today.getTime();
}
