import React, { useRef } from "react";
import Attach from "./../Images/attach.svg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import './FileInputIcon.css'; // Import your CSS file for styling

const FileInputIcon = ({ file, setFile }) => {
  const fileInputRef = useRef(null);

  const handleFileInputChange = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      const fileType = selectedFile.type;
      const acceptedTypes = ["audio/*", "application/pdf", "image/*"];
      if (acceptedTypes.some((type) => fileType.match(type))) {
        // File type is valid, you can handle the file here
        console.log("Selected file:", selectedFile);
        setFile(selectedFile);
      } else {
        // alert("Invalid file type. Please select an audio, PDF, or image file.");
        toast.error(
          "Invalid file type. Please select an audio, PDF, or image file."
        );
        // Clear the input to prevent further submission
        setFile();
        fileInputRef.current.value = "";
      }
    }
    // Check if the selected file type matches any of the accepted types

    // Do something with the selected file, e.g., upload or process it
  };

  const handleIconClick = () => {
    // Trigger the file input when the icon is clicked
    fileInputRef.current.click();
  };

  return (
    <div className="file-input-container">
      <ToastContainer />
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        style={{ display: "none" }}
      />
      <img
        class="attachment"
        src={Attach}
        alt="img"
        onClick={handleIconClick}
      />
    </div>
  );
};

export default FileInputIcon;
