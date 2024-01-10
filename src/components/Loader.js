import React from "react";
import { CircularProgress, Backdrop } from "@mui/material";
const Loader = ({ open, handleClose , title}) => {
  return (
    <Backdrop
      sx={{ color: "#01d866", zIndex: (theme) => theme.zIndex.drawer + 1 , flexDirection:"column"}}
      open={open}
    //   onClick={handleClose}
    >
      <CircularProgress color="inherit" />
      <span style={{color:"white", marginTop:"10px"}}>{title}</span>
      
    </Backdrop>
  );
};

export default Loader;
