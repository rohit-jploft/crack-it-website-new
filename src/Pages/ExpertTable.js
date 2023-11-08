import "./../style.css";
import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Header from "./Header";
import Table from "react-bootstrap/Table";
import Container from "react-bootstrap/Container";
import Visible from "./../Images/visible.svg";
import EditText from "./../Images/Edit_Text.svg";
import Deletee from "./../Images/delete1.svg";
import Bookingimg from "./../Images/booking-img.svg";
import Bookingimg2 from "./../Images/booking-img2.svg";
import Cancelicon from "./../Images/cancel-icon.svg";
import { useNavigate } from "react-router-dom";
import { deleteAgencyExpert, getAllAgencyExpert } from "../data/agency";
import { ToastContainer, toast } from "react-toastify";

const ExpertTable = () => {
  const navigate = useNavigate();

  const [agencyExpertList, setAgencyExpertList] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState();
  const [isDeleteDone, setIsDeleteDone] = useState(false);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = (uid) => {
    setShow(true);
    setSelectedUserId(uid);
  };

  const getAllExperts = async () => {
    const data = await getAllAgencyExpert();
    setAgencyExpertList(data?.data);
  };

  useEffect(() => {
    getAllExperts();
  }, [isDeleteDone]);

  const deleteAgencyExpertProfile = async (uid) => {
    const res = await deleteAgencyExpert(uid);
    console.log(res);
    if (res && res.success) {
      setIsDeleteDone(true);
      toast.success(res.message);
    }
    if (res && res.data && res.data.success) {
      setIsDeleteDone(true);
      toast.success(res.data.message);
    }
  };
  return (
    <>
      <ToastContainer />
      <Header />
      <section className="">
        <Container>
          <div className="main-content">
            <div className="wallet_field">
              <div>
                <div class="experttd-heading">
                  <h3>Experts</h3>
                  <button
                    class="btn_bg"
                    onClick={() => navigate("/agency/add/expert")}
                  >
                    Add Expert
                  </button>
                </div>
                <div className="table-responsive wallet-table experttd">
                  <Table width="100%">
                    <thead>
                      <tr width="100%">
                        <th width="1%"></th>
                        <th width="15%">Name</th>
                        <th width="24%">Expertise</th>
                        <th width="15%">Experience</th>
                        <th width="15%">Price / hr</th>
                        <th width="15%">Booking</th>
                        <th width="15%">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {agencyExpertList &&
                        agencyExpertList.map((exp) => {
                          return (
                            <tr>
                              <td>
                                <img
                                  className="wallet-img"
                                  src={Bookingimg}
                                  alt="img"
                                />
                              </td>
                              <td className="Wname">
                                {exp?.user?.firstName} {exp?.user?.lastName}
                              </td>
                              <td>{exp?.jobCategory?.title}</td>
                              <td>{exp?.experience} yrs</td>
                              <td>${exp.price}</td>
                              <td>
                                <button
                                  class="btn_border"
                                  onClick={() =>
                                    navigate(
                                      `/agency/expert/bookings/${exp?.user?._id}`
                                    )
                                  }
                                >
                                  See Bookings
                                </button>
                              </td>
                              <td>
                                <span className="expertd-action">
                                  <img
                                    src={Visible}
                                    style={{ cursor: "pointer" }}
                                    onClick={() =>
                                      navigate(
                                        `/agency/expert/profile/${exp?.user?._id}`
                                      )
                                    }
                                  />
                                  <img
                                    src={EditText}
                                    style={{ cursor: "pointer" }}
                                    onClick={() =>
                                      navigate(
                                        `/agency/edit/expert/${exp?.user?._id}`
                                      )
                                    }
                                  />
                                  <img
                                    src={Deletee}
                                    variant="primary"
                                    style={{ cursor: "pointer" }}
                                    onClick={() => handleShow(exp?.user?._id)}
                                  />
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </Table>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
      <Modal show={show} onHide={handleClose} className="cancel_modal">
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          <img src={Cancelicon} alt="img" />
          <Modal.Title>Are you sure you want to delete expert?</Modal.Title>

          <Button className="no-btn" onClick={handleClose}>
            No
          </Button>
          <Button
            className="yes-btn"
            onClick={() => {
              handleClose();
              deleteAgencyExpertProfile(selectedUserId);
            }}
          >
            Yes
          </Button>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ExpertTable;
