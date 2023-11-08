import { Button, Modal } from "react-bootstrap";
import Avatar1 from "../Images/Avatars/avatar1.svg";

const AvatarModel = ({ show, handleClose }) => {
  return (
    <Modal className="filter-mddl" show={show} onHide={handleClose}>
      <Modal.Header closeButton></Modal.Header>
      <Modal.Body className="text-center">
        <h3>Choose Avatar</h3>
       <div className="avatar-img">
        <div className="img-img active"><img src={Avatar1} /></div>
        <div className="img-img"><img src={Avatar1} /></div>
        <div className="img-img"><img src={Avatar1} /></div>
        <div className="img-img"><img src={Avatar1} /></div>
        <div className="img-img"><img src={Avatar1} /></div>
        <div className="img-img"><img src={Avatar1} /></div>
        <div className="img-img"><img src={Avatar1} /></div>
        <div className="img-img"><img src={Avatar1} /></div>
        <div className="img-img"><img src={Avatar1} /></div>
        
        
       </div>
        <button type="submit" className="form-btn setuprofile-btn">
          Save
        </button>
      </Modal.Body>
    </Modal>
  );
};
export default AvatarModel;
