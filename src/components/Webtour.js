import React from 'react';
import arrow from '../Images/loginArrow.svg';
import ArrowLeft from './../Images/Arrow_Left.svg';

const WebTour = ({ setShowTour , title, body}) => {
  return (
    <div>
      <div className="firstStepper">
        <div className="text-center imagess">
          <img src={arrow} />
        </div>
        <h5>Login For User</h5>
        <p>
        If you are a fresher or experienced, struggling to CRACK the interview, No Worries. we have a team of experienced professionals.
        </p>

        <div className="text-end pe-5">
          <button
            className="btn_getstrated mt-0 "
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
