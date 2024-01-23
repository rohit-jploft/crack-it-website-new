import { Button, Modal } from "react-bootstrap";
import { useFormik } from "formik";
import { AVATAR_BASE_URL, BASE_URL } from "../constant";
import { toast } from "react-toastify";
import TextInput from "./InputField";
import axios from "axios";
import { useState, useEffect } from "react";
import * as Yup from "yup";

const CancelPopUp = ({
  show,
  handleClose,
  setReason,
  cancelBooking,
  setComment,
}) => {
  const [reasonList, setReasonList] = useState([]);

  const getAllReasons = async () => {
    const res = await axios.get(`${BASE_URL}ticket/reason/get-all`);
    console.log(res, "reason");
    setReasonList(res?.data?.data);
  };
  useEffect(() => {
    getAllReasons();
  }, []);
  const formik = useFormik({
    initialValues: {
      reason: "",
      comment: "",
    },
    validationSchema: Yup.object().shape({
      reason: Yup.string().required("reason is required"),
      comment: Yup.string(),
    }),
    onSubmit: (values) => {
      // If "Other" is selected, use the comment as the reason
      const reason = values.reason === "Other" ? values.comment : values.reason;
      setReason(reason);
      setComment(values.comment);

      cancelBooking(reason, values.comment);

      handleClose();
      formik.resetForm()
    },
  });

  return (
    <Modal className="filter-mddl" show={show} onHide={() => {
        handleClose()
        formik.setFieldValue("reason", "")
    }}>
      <Modal.Header closeButton></Modal.Header>
      <Modal.Body className="text-center">
        <h3>Why you Cancel Booking</h3>
        <form onSubmit={formik.handleSubmit}>
          <div
            className="avatar-img"
            style={{ display: "flex", flexDirection: "column", textAlign:"left", padding:"25px" }}
          >
            {reasonList.length > 0 &&
              reasonList.map((obj, index) => {
                return (
                  <label className="radio-button" key={index}>
                    <input
                      type="radio"
                      class="radio-button__input"
                      id="choice1-1"
                      name="reason"
                      value={obj?._id}
                      onChange={formik.handleChange}
                    />
                    <span className="radio-button__control"></span>
                    {obj?.reason}
                  </label>
                );
              })}
            {formik.touched.reason &&
              Boolean(formik.errors.reason) && (
                <div
                  style={{
                    color: "red",
                    textAlign: "left",
                    marginLeft: "9px",
                    fontSize: "13px",
                    // marginTop: "0px",
                  }}
                >
                  <span>
                    {formik.touched.reason && formik.errors.reason}
                  </span>
                </div>
              )}
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
                value={formik.values.comment}
                onChange={formik.handleChange}
              />
            </>
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
