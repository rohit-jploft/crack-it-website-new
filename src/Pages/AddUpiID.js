import "./../style.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "./Header";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Successicon from "./../Images/success.svg";
import Upi from "./../Images/upi.svg";
import { addBankDetail } from "../data/wallet";
import { useFormik } from "formik";
import * as Yup from "yup";
import TextInput from "../components/InputField";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddUpiId = () => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const handleClose2 = () => setShow(false);
  const handleShow2 = () => setShow(true);
  const AddUpiID = async (upi) => {
    const userId = localStorage.getItem("userId");
    const data = await addBankDetail({ type: "UPI", upiId: upi, user: userId });
    if (data && data?.data && data?.status === 200 && data?.success) {
      console.log("hello in");
      toast.success("UPI Id added successfully", {autoClose:400});
      setTimeout(() => {
        navigate("/withdraw-amount");
      }, 800)
    }
    console.log(data);
  };

  const formik = useFormik({
    initialValues: {
      upi: "",
    },
    validationSchema: Yup.object({
      upi: Yup.string()
        .matches(/^(?=.*[@.])[a-zA-Z0-9@.]{3,128}$/, "Invalid UPI ID")
        .required("UPI ID is required"),
    }),
    onSubmit: async (values) => {
      console.log(values);
      await AddUpiID(values.upi);
    },
  });
  return (
    <>
      <ToastContainer />
      <Header />
      <section className="">
        <Container>
          <div className="main-content">
            <div className="job-categ addbank">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  formik.handleSubmit();
                }}
              >
                <div className="addbankdetails_field">
                  <h3>Add UPI Id</h3>
                  <div className="in_details">
                    <div class="input-field">
                      <TextInput
                        name="upi"
                        label="UPI ID *"
                        value={formik.values.upi}
                        handleChange={formik.handleChange}
                        error={formik.touched.upi && Boolean(formik.errors.upi)}
                        helperText={formik.touched.upi && formik.errors.upi}
                      />
                    </div>
                  </div>

                  <div className="text-center">
                    <Button type="submit" className="btn-pay">
                      Save
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
};

export default AddUpiId;
