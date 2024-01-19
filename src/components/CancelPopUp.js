import { Button, Modal } from "react-bootstrap";
import { useFormik } from "formik";
import { AVATAR_BASE_URL, BASE_URL } from "../constant";
import { toast } from "react-toastify";
import TextInput from "./InputField";

const CancelPopUp = ({ show, handleClose, setReason,cancelBooking }) => {
  const formik = useFormik({
    initialValues: {
      reason: "",
      comment: "",
    },
    onSubmit: (values) => {
      // If "Other" is selected, use the comment as the reason
      const reason = values.reason === "Other" ? values.comment : values.reason;
      setReason(reason);

      cancelBooking(reason)

      handleClose()
    },
  });

  return (
    <Modal className="filter-mddl" show={show} onHide={handleClose}>
      <Modal.Header closeButton></Modal.Header>
      <Modal.Body className="text-center">
        <h3>Why you Cancel Booking</h3>
        <form onSubmit={formik.handleSubmit}>
          <div
            className="avatar-img"
            style={{ display: "flex", flexDirection: "column" }}
          >
            <label className="radio-button">
              <input
                type="radio"
                class="radio-button__input"
                id="choice1-1"
                name="reason"
                value="Don't need it right now"
                onChange={formik.handleChange}
              />
              <span className="radio-button__control"></span>
              Don't need it right now
            </label>
            <label className="radio-button">
              <input
                type="radio"
                class="radio-button__input"
                id="choice1-2"
                name="reason"
                value="Its too Costly"
                onChange={formik.handleChange}
              />
              <span className="radio-button__control"></span>
              Its too Costly
            </label>
            <label className="radio-button">
              <input
                type="radio"
                class="radio-button__input"
                id="choice1-3"
                name="reason"
                value="Waiting time too much"
                onChange={formik.handleChange}
              />
              <span className="radio-button__control"></span>
              Waiting time too much
            </label>
            <label className="radio-button">
              <input
                type="radio"
                class="radio-button__input"
                id="choice1-4"
                name="reason"
                value="Other"
                onChange={formik.handleChange}
              />
              <span className="radio-button__control"></span>
              Other
            </label>

            {formik.values.reason === "Other" && (
              <>
                <label for="exampleFormControlInput1" class="form-label">
                  Comment *
                </label>
                <textarea
                  name="comment"
                  type="text"
                  class="form-control"
                  id="exampleFormControlInput1"
                  placeholder=""
                  rows={3}
                  onChange={formik.handleChange}
                />
              </>
            )}
          </div>
          <button type="submit" className="form-btn setuprofile-btn">
            Submit
          </button>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default CancelPopUp;
