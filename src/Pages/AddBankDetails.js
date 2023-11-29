import "./../style.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "./Header";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Successicon from "./../Images/success.svg";
import Upi from "./../Images/upi.svg";
import TextInput from "../components/InputField";
import { useFormik } from "formik";
import * as Yup from "yup";
import { addBankDetail } from "../data/wallet";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const validationSchema = Yup.object({
  accountName: Yup.string().required("Account Name is required"),
  accountNo: Yup.number()
    .typeError("Account Number must be a number")
    .required("Account Number is required"),
  ifscCode: Yup.string()
    .matches(/^[A-Z]{4}[0-9]{7}$/, "Invalid IFSC Code")
    .required("IFSC Code is required"),
  bankName: Yup.string().required("Bank Name is required"),
});

const AddBankDtails = () => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const handleClose2 = () => setShow(false);
  const handleShow2 = () => setShow(true);

  const AddUpiID = async (obj) => {
    const userId = localStorage.getItem("userId");
    const data = await addBankDetail({ type: "BANK", ...obj, user: userId });
    console.log(data);
    if (data && data?.data && data?.status === 200 && data?.success) {
      toast.success("Bank details added successfully", {
        autoClose: 400,
      });
      setTimeout(() => {
        navigate("/withdraw-amount");
      }, 800);
    }
    if (data && data?.response && data?.response?.data) {
      toast.error(data?.response?.data?.message, {
        autoClose: 400,
      });
    }
  };

  const formik = useFormik({
    initialValues: {
      accountName: "",
      accountNo: "",
      ifscCode: "",
      bankName: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      console.log(values);
      await AddUpiID(values);
    },
  });
  return (
    <>
      <Header />
      <section className="">
        <Container>
          <div className="main-content">
            <div className="job-categ addbank">
              <div className="addbankdetails_field">
                <h3>Add Bank Details</h3>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    formik.handleSubmit();
                  }}
                >
                  <div className="row in_details">
                    <div className="col-md-6">
                      <div class="input-field">
                        <TextInput
                          name="accountName"
                          label="Account Name *"
                          value={formik.values.accountName}
                          handleChange={formik.handleChange}
                          error={
                            formik.touched.accountName &&
                            Boolean(formik.errors.accountName)
                          }
                          helperText={
                            formik.touched.accountName &&
                            formik.errors.accountName
                          }
                          class="form-control"
                          id="exampleFormControlInput1"
                          placeholder=""
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div class="input-field">
                        <TextInput
                          name="accountNo"
                          label="Account Number *"
                          value={formik.values.accountNo}
                          handleChange={formik.handleChange}
                          error={
                            formik.touched.accountNo &&
                            Boolean(formik.errors.accountNo)
                          }
                          helperText={
                            formik.touched.accountNo && formik.errors.accountNo
                          }
                          class="form-control"
                          id="exampleFormControlInput1"
                          placeholder=""
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div class="input-field">
                        <TextInput
                          name="bankName"
                          label="Bank Name *"
                          variant="outlined"
                          value={formik.values.bankName}
                          handleChange={formik.handleChange}
                          error={
                            formik.touched.bankName &&
                            Boolean(formik.errors.bankName)
                          }
                          helperText={
                            formik.touched.bankName && formik.errors.bankName
                          }
                          class="form-control"
                          id="exampleFormControlInput1"
                          placeholder=""
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div class="input-field">
                        <label
                          for="exampleFormControlInput1"
                          class="form-label"
                        >
                          IFSC Code
                        </label>
                        <TextInput
                          name="ifscCode"
                          label="IFSC Code *"
                          variant="outlined"
                          value={formik.values.ifscCode}
                          handleChange={formik.handleChange}
                          error={
                            formik.touched.ifscCode &&
                            Boolean(formik.errors.ifscCode)
                          }
                          helperText={
                            formik.touched.ifscCode && formik.errors.ifscCode
                          }
                          class="form-control"
                          id="exampleFormControlInput1"
                          placeholder=""
                        />
                      </div>
                    </div>
                  </div>

                  <div className="text-center">
                    <Button type="submit" className="btn-pay">
                      Save
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
};

export default AddBankDtails;
