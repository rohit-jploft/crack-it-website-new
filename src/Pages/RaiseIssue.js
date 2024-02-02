import React, { useContext, useEffect, useState, useRef } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import TextInput from "../components/InputField";
import "./../style.css";
import Header from "./Header";
import Container from "react-bootstrap/Container";
import { BASE_URL } from "../constant";
import { BookingContext } from "../context/bookingContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

const RaiseIssue = () => {
  const fileInputRef = useRef(null);

  const navigate = useNavigate();
  const [file, setFile] = useState()
  const [reasonList, setReasonList] = useState([]);
  const { ticketRaiseBookingId, setTicketRaiseBookingId } =
    useContext(BookingContext);

  const getAllReasons = async () => {
    const role = localStorage.getItem("role")
    const res = await axios.get(`${BASE_URL}ticket/reason/get-all?role=${role}`);
    console.log(res, "reason");
    setReasonList(res?.data?.data);
    formik.setFieldValue("reason", res?.data?.data[0]._id)
  };
  useEffect(() => {
    if (!ticketRaiseBookingId) {
      navigate("/mybookings/Past");
    }
    getAllReasons();
  }, []);
  const formik = useFormik({
    initialValues: {
      reason: "",
      query: "",
    },
    validationSchema: Yup.object({
      reason: Yup.string().required("Reason is Required"),
      query: Yup.string().required("query is Required"),
     
    }),
    onSubmit: async (values) => {
      try {
        const userId = localStorage.getItem("userId");
        const formData = new FormData();
        formData.append("reason", values.reason);
        formData.append("query", values.query);
        // formData.append("doc", values.doc);
        if(file) formData.append("doc", file)
        formData.append("user", userId);
        formData.append("booking", ticketRaiseBookingId);

        // Use Axios to send a POST request with FormData
        const response = await axios.post(`${BASE_URL}ticket/raise`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        console.log(response.data);
        if (response && response.data && response.data.success) {
          toast.success("Ticket raised successfully");
          formik.resetForm();
          navigate("/ticket/view/all");
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        // Handle errors (e.g., show error message)
        console.error("Error submitting form:", error);
      }
    },
  });

  const handleFileInputChange = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      const fileType = selectedFile.type;
      const acceptedTypes = [ "application/pdf", "image/*"];
      if (acceptedTypes.some((type) => fileType.match(type))) {
        // File type is valid, you can handle the file here
        console.log("Selected file:", selectedFile);
        setFile(selectedFile);
      } else {
        // alert("Invalid file type. Please select an audio, PDF, or image file.");
        toast.error(
          "Invalid file type. Please select an PDF, or image file."
        );
        // Clear the input to prevent further submission
        setFile();
        fileInputRef.current.value = "";
      }
    }
    // Check if the selected file type matches any of the accepted types

    // Do something with the selected file, e.g., upload or process it
  };

  return (
    <>
      <Header />
      <section className="">
        <Container>
          <div
            className="main-content"
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div style={{ width: "50%" }}>
              <h3>Raise issue</h3>
              <p>
                Please get in touch and our support team will answer all your
                questions.
              </p>
              <form onSubmit={formik.handleSubmit}>
                <div className="input-field">
                  <label for="exampleFormControlInput1" className="form-label">
                    Reason
                  </label>
                  <select
                    name="reason"
                    className="form-control"
                    id=""
                    value={formik.values.reason}
                    onChange={formik.handleChange}
                  >
                    {reasonList.length > 0 &&
                      reasonList.map((obj) => {
                        return <option value={obj?._id}>{obj?.reason}</option>;
                      })}
                  </select>
                  {formik.touched.reason && formik.errors.reason ? (
                    <div
                      style={{
                        color: "red",
                        textAlign: "left",
                        marginLeft: "9px",
                        fontSize: "13px",
                        marginBottom: "-4px",
                        marginTop: "3px",
                      }}
                    >
                      <span>{formik.errors.reason}</span>
                    </div>
                  ) : null}
                </div>
                <div class="input-field">
                  <label for="exampleFormControlInput1" class="form-label">
                    Query *
                  </label>
                  <textarea
                    name="query"
                    type="text"
                    class="form-control"
                    id="exampleFormControlInput1"
                    placeholder=""
                    rows={3}
                    value={formik.values.query}
                    onChange={formik.handleChange}
                  />
                  {formik.touched.query && formik.errors.query ? (
                    <div
                      style={{
                        color: "red",
                        textAlign: "left",
                        marginLeft: "9px",
                        fontSize: "13px",
                        marginBottom: "-4px",
                        marginTop: "3px",
                      }}
                    >
                      <span>{formik.errors.query}</span>
                    </div>
                  ) : null}
                </div>
                <div className="input-field">
                  <TextInput
                    type="file"
                    ref={fileInputRef}
                    name="doc"
                    handleChange={handleFileInputChange}
                  />
                  {formik.touched.doc && formik.errors.doc ? (
                    <div
                      style={{
                        color: "red",
                        textAlign: "left",
                        marginLeft: "9px",
                        fontSize: "13px",
                      }}
                    >
                      <span>{formik.errors.doc}</span>
                    </div>
                  ) : null}
                </div>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <span>
                    {" "}
                    File types must be like PDFs, png, jpg. Max File Size:
                    4 mb
                  </span>
                </div>
                {/* <div className="input-field"> */}
                <button
                  type="submit"
                  className="form-btn setuprofile-btn"
                  style={{ width: "100%" }}
                >
                  Submit
                </button>
                {/* </div> */}
              </form>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
};

export default RaiseIssue;
