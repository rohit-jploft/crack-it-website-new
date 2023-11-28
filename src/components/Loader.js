import React from "react";
import { CircularProgress, Backdrop } from "@mui/material";
const Loader = ({ open, handleClose }) => {
  return (
    <Backdrop
      sx={{ color: "#01d866", zIndex: (theme) => theme.zIndex.drawer + 1 , flexDirection:"column"}}
      open={open}
    //   onClick={handleClose}
    >
      <CircularProgress color="inherit" />
      <span style={{color:"white", marginTop:"10px"}}>Loading....</span>
      
    </Backdrop>
  );
};

export default Loader;
