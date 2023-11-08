export const isAuthenticated = () => {
  if (localStorage.getItem("token")) {
    return true;
  }
  return false;
};
export const isUser = () => {
  const role = localStorage.getItem("role");
  if (role?.toString() === "USER") {
    return true;
  }
  return false;
};
export const isUserNameDisplay = (id) => {
  console.log("id", id, typeof id);
  const loggedUserId = localStorage.getItem("userId");

  if (loggedUserId.toString() === id) {
    return true;
  }
  return false;
};
export const isExpert = () => {
  const role = localStorage.getItem("role");
  if (role?.toString() === "EXPERT") {
    return true;
  }
  return false;
};
export const isAgency = () => {
  const role = localStorage.getItem("role");
  if (role?.toString() === "AGENCY") {
    return true;
  }
  return false;
};
