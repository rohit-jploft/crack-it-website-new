import { Modal , Button} from "react-bootstrap";


const LogoutModal = ({open, handleClose, logOut}) => {
  return (
    <div>
      <Modal show={open} onHide={handleClose} className="cancel_modal">
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          {/* <img src={Cancelicon} alt="img" /> */}
          <Modal.Title>Are you sure to you want Logout ?</Modal.Title>
         
          <Button className="no-btn" onClick={handleClose}>
            No
          </Button>
          <Button
            className="yes-btn"
            onClick={() => logOut()}
          >
            Yes
          </Button>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default LogoutModal;
