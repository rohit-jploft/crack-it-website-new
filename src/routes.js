import { useRoutes, Navigate } from "react-router-dom";

import { isAgency, isAuthenticated, isExpert } from "./utils/authHelper";
import Login from "./Pages/Login";
import MyBookings from "./Pages/MyBookings";
import Signup from "./Pages/SignUp";
import Forgotpassword from "./Pages/ForgotPassword";
import Home from "./Pages/Home";
import Resetpassword from "./Pages/ResetPassword";
import OTP from "./Pages/OTP";
import JobCategory from "./Pages/JobCategory";
import SubCategory from "./Pages/SubCategory";
import RequestCateg from "./Pages/RequestCateg";
import Experts from "./Pages/Experts";
import ExpertsProfile from "./Pages/ExpertsProfile";
import Wallet from "./Pages/Wallet";
import MyProfile from "./Pages/MyProfile";
import Chat from "./Pages/Chat";
import Rating from "./Pages/Rating"
import Payment from "./Pages/Payment";
import BookingInfo from "./Pages/BookingInfo";
import WithdrawAmount from "./Pages/WithdrawAmount";
import AddBankDtails from "./Pages/AddBankDetails";
import AddUpiId from "./Pages/AddUpiID";
import SetupExpertProfile from "./Pages/SetupExpertProfile";
import ChangePassword from "./Pages/ChangePassword";
import AgencyLogin from "./Pages/AgencyLogin";
import ExpertTable from "./Pages/ExpertTable";
import AddAgencyExpert from "./Pages/AddAgencyExpert";
import AgencyExpertJobCategory from "./Pages/AgencyExpertJobCategory";
import AgencyExpertSubCategory from "./Pages/AgencyExpertSubCategory";
import EditExpertProfile from "./Pages/EditExpertProfile";
import ReferAndEarn from "./Pages/ReferAndEarn";
import EditAgencyProfile from "./Pages/EditAgencyProfile";
import AgencyExpertProfile from "./Pages/AgencyExpertProfile";
import AgencyExpertBooking from "./Pages/AgencyExpertBooking";
import SetupAgencyProfile from "./Pages/SetupAgencyProfile";
import CheckPayment from "./Pages/CheckPayment";
import PrivacyPolicy from "./Pages/PrivacyPolicy";
import TermsAndConditions from "./Pages/TermsConditions";
import ViewAllExperts from "./Pages/ViewAllExperts";

function AppRoutes() {
  const isAuthenticateds = isAuthenticated();
  const isThisExpert = isExpert()
  const isThisAgency = isAgency()
  
  console.log("is Auth", isAuthenticateds);
  const routes = useRoutes([
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/login",
      element: !isAuthenticateds ? <Login />:<Navigate to="/mybookings" /> ,
    },
    {
      path: "/refer/earn",
      element: isAuthenticateds ? <ReferAndEarn />:<Navigate to="/login" /> ,
    },
    {
      path: "/refer/signup/:referedBy",
      element: isAuthenticateds ? <Signup />:<Navigate to="/login" /> ,
    },
    {
      path: "/agency/login",
      element: !isAuthenticateds ? <AgencyLogin /> : <Navigate to="/agency/experts/all" />,
    },
    {
      path: "/forgotpassword",
      element: !isAuthenticateds ? <Forgotpassword />:<Navigate to="/mybookings" /> ,
    },
    {
      path: "/resetpassword",
      element: !isAuthenticateds ? <Resetpassword />:<Navigate to="/mybookings" /> ,
    },
    {
      path: "/otp",
      element: !isAuthenticateds ? <OTP />:<Navigate to="/mybookings" /> ,
    },
    {
      path: "/JobCategory",
      element: isAuthenticateds ? <JobCategory />:<Navigate to="/login" /> ,
    },
 
    {
      path: "/subCategory",
      element: isAuthenticateds ? <SubCategory />:<Navigate to="/login" /> ,
    },
    {
      path: "/RequestCateg",
      element: isAuthenticateds ? <RequestCateg />:<Navigate to="/login" /> ,
    },
    {
      path: "/experts",
      element: isAuthenticateds ? <Experts />:<Navigate to="/login" /> ,
    },
    {
      path: "/agency/experts/all",
      element: isAuthenticateds ? <ExpertTable />:<Navigate to="/agency/login" /> ,
    },
    {
      path: "/agency/add/expert",
      element: isAuthenticateds ? <AddAgencyExpert />:<Navigate to="/agency/login" /> ,
    },
    {
      path: "/agency/edit/expert/:expertUserId",
      element: isAuthenticateds ? <AddAgencyExpert />:<Navigate to="/agency/login" /> ,
    },
    {
      path: "/agency/add/expert/jobCategory",
      element: isAuthenticateds ? <AgencyExpertJobCategory /> : <Navigate to="/agency/login" /> ,
    },
    {
      path: "/agency/add/expert/subCategory",
      element: isAuthenticateds ? <AgencyExpertSubCategory /> : <Navigate to="/agency/login" /> ,
    },
    {
      path: "/mybookings",
      element: isAuthenticateds ? <MyBookings />:<Navigate to="/login" /> ,
    },
    {
      path: "/view/all/experts",
      element: isAuthenticateds ? <ViewAllExperts />:<Navigate to="/login" /> ,
    },
    {
      path: "/rate/expert/:expertId",
      element: isAuthenticateds && !isThisAgency && !isThisExpert ? <Rating />:<Navigate to="/login" /> ,
    },
    {
      path: "/agency/expert/bookings/:agencyExpertUserId",
      element: isAuthenticateds ? <AgencyExpertBooking />:<Navigate to="/login" /> ,
    },
    {
      path: "/bookingInfo/:bookingId",
      element: isAuthenticateds ? <BookingInfo />:<Navigate to="/login" /> ,
    },
    {
      path: "/ExpertsProfile/:userId",
      element: isAuthenticateds ? <ExpertsProfile />:<Navigate to="/login" /> ,
    },
    {
      path: "/wallet",
      element: isAuthenticateds ? <Wallet />:<Navigate to="/login" /> ,
    },
    {
      path: "/check-payment",
      element: isAuthenticateds ? <CheckPayment />:<Navigate to="/login" /> ,
    },
    {
      path: "/change-password",
      element: isAuthenticateds ? <ChangePassword />:<Navigate to="/login" /> ,
    },
    {
      path: "/Myprofile",
      element: isAuthenticateds ? isThisExpert ?  <ExpertsProfile/> : <MyProfile />:<Navigate to="/login" /> 
    },
    {
      path: "/agency/expert/profile/:agencyExpertUserId",
      element: isAuthenticateds && isThisAgency ?  <AgencyExpertProfile/> :<Navigate to="/login" /> 
    },
    {
      path: "/expert/profile/:agencyExpertUserId",
      element: isAuthenticateds ?  <AgencyExpertProfile/> :<Navigate to="/login" /> 
    },
    {
      path: "agency/Myprofile",
      element: isAuthenticateds ? isThisAgency ?  <ExpertsProfile/> : <MyProfile />:<Navigate to="/login" /> 
    },
    {
      path: "/edit/Myprofile",
      element: isAuthenticateds ? isThisExpert ? <EditExpertProfile/> : <MyProfile />:<Navigate to="/login" /> ,
    },
    {
      path: "/edit/agency/Myprofile",
      element: isAuthenticateds ? isThisAgency ? <EditAgencyProfile/> : <MyProfile />:<Navigate to="/login" /> ,
      // loader:<h1>Loading</h1>
    },
    {
      path: "/chat",
      element: isAuthenticateds ? <Chat />:<Navigate to="/login" /> ,
    },
    {
      path: "/chat/:convoId",
      element: isAuthenticateds ? <Chat />:<Navigate to="/login" /> ,
    },
    {
      path: "/rating",
      element: isAuthenticateds ? <Rating/>:<Navigate to="/login" /> ,
    },
    {
      path: "/payment",
      element: isAuthenticateds ? <Payment/>:<Navigate to="/login" /> ,
    },
    {
      path: "/reset-password",
      element: !isAuthenticateds ? <Resetpassword/>:<Navigate to="/login" /> ,
    },
    {
      path: "/payment",
      element: isAuthenticateds ? <Payment/>:<Navigate to="/login" /> ,
    },
    {
      path: "/withdraw-amount",
      element: isAuthenticateds ? <WithdrawAmount/> : <Navigate to="/login" /> ,
    },
    {
      path: "/AddBankDtails",
      element: isAuthenticateds ? <AddBankDtails/> : <Navigate to="/login" /> ,
    },
    {
      path: "/AddUpiId",
      element: isAuthenticateds ? <AddUpiId/> : <Navigate to="/login" /> ,
    },
    {
      path: "/setup-profile",
      element: isAuthenticateds ? <SetupExpertProfile/> : <Navigate to="/login" /> ,
    },
    {
      path: "/privacy-policy",
      element:  <PrivacyPolicy/>  ,
    },
    {
      path: "/terms-conditions",
      element:  <TermsAndConditions/>  ,
    },
    {
      path: "/agency/setup-profile",
      element: isAuthenticateds ? <SetupAgencyProfile/> : <Navigate to="/login" /> ,
    },
  
    {
      path: "/signup",
      element: isAuthenticateds ? <Navigate to="/mybookings" /> : <Signup />,
      children: [
        {
          element: isAuthenticateds ? (
            <Navigate to="/mybookings" />
          ) : (
            <Signup />
          ),
        },
      ],
    },

    {
      path: "/mybookings",
      element: isAuthenticateds ? <MyBookings /> : <Navigate to="/login" />,
      children: [
        {
          element: isAuthenticateds ? (
            <MyBookings />
          ) : (
            <Navigate to="/mybookings" />
          ),
        },
      ],
    },
    {
      path: "/mybookings/:tabKey",
      element: isAuthenticateds ? <MyBookings /> : <Navigate to="/login" />,
      children: [
        {
          element: isAuthenticateds ? (
            <MyBookings />
          ) : (
            <Navigate to="/mybookings" />
          ),
        },
      ],
    },

    // {
    //   path: '*',
    //   element: <Navigate to="/404" replace />,
    // },
  ]);

  return routes;
}

export default AppRoutes;


