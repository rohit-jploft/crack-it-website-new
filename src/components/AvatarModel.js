import { Button, Modal } from "react-bootstrap";
import Avatar1 from "../Images/Avatars/avatar1.svg";
import Avatar2 from "../Images/Avatars/avatar2.svg";
import Avatar3 from "../Images/Avatars/avatar3.svg";
import Avatar4 from "../Images/Avatars/avatar4.svg";
import Avatar5 from "../Images/Avatars/avatar5.svg";
import Avatar6 from "../Images/Avatars/avatar6.svg";
import Avatar7 from "../Images/Avatars/avatar7.svg";
import Avatar8 from "../Images/Avatars/avatar8.svg";
import Avatar9 from "../Images/Avatars/avatar9.svg";
import { useState } from "react";
import Axios from "axios";
import { AVATAR_BASE_URL, BASE_URL } from "../constant";
import { toast } from "react-toastify";

const AvatarModel = ({ show, handleClose, id, onlySet, setAvatarSvg }) => {
  const [avatars, setAvatars] = useState([
    { avatar: Avatar1, id: 0, name: "avatar1.svg" },
    { avatar: Avatar2, id: 1, name: "avatar2.svg" },
    { avatar: Avatar3, id: 2, name: "avatar3.svg" },
    { avatar: Avatar4, id: 3, name: "avatar4.svg" },
    { avatar: Avatar5, id: 4, name: "avatar5.svg" },
    { avatar: Avatar6, id: 5, name: "avatar6.svg" },
    { avatar: Avatar7, id: 6, name: "avatar7.svg" },
    { avatar: Avatar8, id: 7, name: "avatar8.svg" },
    { avatar: Avatar9, id: 8, name: "avatar9.svg" },
  ]);
  const [selectedAvatar, setSelectedAvatar] = useState();
  const [selectedAvatarName, setSelectedAvatarName] = useState("");

  const setAvatarInDb = async () => {
   if(!onlySet){
    const userId = localStorage.getItem("userId");
    const res = await Axios.put(`${BASE_URL}auth/user/set/avatar/${id ? id : userId}`, {
      avatar: selectedAvatarName,
    });
    console.log(res)
    if (
      res &&
      res.data &&
      res.data.success &&
      res.data.status === 200
    ) {
      toast.success("Profile Avatar set successfully");
      handleClose();
      window.location.reload()
    } else {
      toast.error("Something went wrong");
    }
   } else {
    setAvatarSvg(selectedAvatarName)
    handleClose();
   }
  };
  return (
    <Modal className="filter-mddl" show={show} onHide={handleClose}>
      <Modal.Header closeButton></Modal.Header>
      <Modal.Body className="text-center">
        <h3>Choose Avatar</h3>
        <div className="avatar-img">
          {avatars.map((avatar, index) => {
            return (
              <div
                className={`img-img ${
                  selectedAvatar === avatar.id ? "active" : ""
                }`}
                key={index}
                style={{ cursor: "pointer" }}
                onClick={() => {
                  setSelectedAvatar(avatar.id);
                  setSelectedAvatarName(avatar.name);
                }}
              >
                <img src={`${AVATAR_BASE_URL}${avatar.name}`} />
              </div>
            );
          })}
        </div>
        <button
          type="submit"
          className="form-btn setuprofile-btn"
          onClick={() => {
            setAvatarInDb();
          }}
        >
          Save
        </button>
      </Modal.Body>
    </Modal>
  );
};
export default AvatarModel;
