import { useEffect } from "react";
import Joyride from "react-joyride";

const JoyRideComponent = ({ steps }) => {
 
  return (
    <div className="app">
      <Joyride
        steps={steps}
        // styles={{
        //   options: {
        //     // ... your other styles ...
        //     spotlightShadow: "0 0 15px rgb(1, 216, 102)", // Change this to your desired color
        //   },
        // }}
        disableBeacon={false}
        styles={{
          options: {
            arrowColor: "#01d866",
            backgroundColor: "black",
            overlayColor: "rgba(1, 0, 0, 0.4)",
            primaryColor: "#000",
            textColor: "#fff",
            width: 900,
            zIndex: 1000,
          },
        }}
      />
    </div>
  );
};

export default JoyRideComponent;
