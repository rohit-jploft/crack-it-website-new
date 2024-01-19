import React from "react";
import arrow from "../Images/loginArrow.svg";
import ArrowLeft from "./../Images/Arrow_Left.svg";

const WebTour = ({ setShowTour, title, body, arrowImage }) => {
  return (
    <div>
      <div className="firstStepper">
        <div className="text-center imagess">
          <img src={arrowImage ? arrowImage : arrow} />
        </div>
        <h5>{title}</h5>
        <p>
          If you are a fresher or experienced, struggling to CRACK the
          interview, <br />
          No Worries. we have a team of experienced professionals.
        </p>

        <div className="text-end pe-5">
          <button
            className="btn_getstrated mt-0"
            style={{ marginBottom: "20px" }}
            onClick={() => {
              setShowTour(false);
            }}
          >
            Skip <img src={ArrowLeft} alt="Logo" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default WebTour;
