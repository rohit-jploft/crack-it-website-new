import "./../style.css";
import Header from "./Header";
import Container from "react-bootstrap/Container";
import { Link, useNavigate, useParams } from "react-router-dom";
import Send from "./../Images/send.svg";
import Bookingimg from "./../Images/booking-img.svg";
import Bookingimg2 from "./../Images/booking-img2.svg";
import data from "@emoji-mart/data";
import ExpertImg from "./../Images/default_avatar.png";
import Picker from "@emoji-mart/react";
import PdfICon from "../Images/pdf_icon.png";
import MusicIcon from "../Images/audio.png";
import {
  getConversation,
  getConvoMessage,
  searchConvoApi,
  sendMessage,
} from "../data/chat";
import EmojiIcon from "../Images/emojiIcon.png";
import { useEffect, useState, useRef } from "react";
import { format, render, cancel, register } from "timeago.js";
import Socket from "../data/socket";
import { isExpert, isUser, isUserNameDisplay } from "../utils/authHelper";
import FileInputIcon from "../components/FileInputIcon";
import { AVATAR_BASE_URL, BASE_URL } from "../constant";
import pdfIcon from "../Images/pdf_icon.png";
import { Button } from "react-bootstrap";
import DefaultAvatar from "../Images/default_avatar.png";
import JoyRideComponent from "../components/JoyRide";
const Chat = () => {
  const navigate = useNavigate();
  const { convoId } = useParams();

  const [selectedConversation, setSelectedConversation] = useState(
    convoId || null
  );
  const [newMessage, setNewMessage] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [convoData, setConvoData] = useState(null);
  const [latestMsg, setLatestMsg] = useState("");
  const [lastestMsgTime, setLatestMsgTime] = useState("");
  // const [latestMsg, setLatest] = useState()
  const [messages, setMessages] = useState([]);
  const [messageSent, setMessageSent] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [file, setFile] = useState();
  const [isSelectedChatClosed, setIsSelectedChatClosed] = useState();
  const [newMsgObj, setNewMsgObj] = useState();
  const scrollRef = useRef(null);

  useEffect(() => {
    Socket.emit("addUser", localStorage.getItem("userId"));
    Socket.on("getUsers", (users) => {
      setOnlineUsers(users);
      console.log(users, "online users");
    });
  }, []);

  const getConvo = async () => {
    const data = await getConversation();
    setConversations(data);
    console.log(data);
  };
  const searchConvo = async () => {
    const data = await searchConvoApi(search);
    setConversations(data);
  };

  const getConvoMessages = async () => {
    const data = await getConvoMessage(selectedConversation);
    setMessages(data);
    console.log("mesgga", data);
  };

  useEffect(() => {
    getConvoMessages();
    setMessageSent(false);
    Socket.emit("join_room", selectedConversation);
  }, [selectedConversation, Socket, newMsgObj, messageSent]);
  useEffect(() => {
    getConvo();
  }, [messageSent]);
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);
  useEffect(() => {
    Socket.on("getMessage", (newIncomingMsg) => {
      console.log("helloooooooooooooo");
      console.log(newIncomingMsg, "new message");
      setNewMsgObj(newIncomingMsg);
      //   setMessages([
      //     ...messages,
      //     {
      //       sender: { _id: newIncomingMsg.sender },
      //       content: newIncomingMsg.content,
      //       chat: selectedConversation,
      //       _id: newIncomingMsg._id,
      //     },
      //   ]);
    });
  }, [Socket]);
  useEffect(() => {
    searchConvo();
  }, [search]);

  const handleConversationClick = (conversationId) => {
    setSelectedConversation(conversationId);
  };

  const handleSendMessage = async (messageText) => {
    // Send the message to the selected conversation
    // Update the 'messages' state with the new message
    const userId = localStorage.getItem("userId");
    const newMessage = {
      sender: {
        _id: userId,
      },
      type: file ? "file" : "text",
      content: messageText,
      chat: selectedConversation,
    };
    if (showEmoji) setShowEmoji(false);
    if (file) newMessage.audio = file;
    const sentMsg = await sendMessage(
      selectedConversation,
      file ? "" : messageText,
      file || "",
      file ? file : null
    )
      .then((res) => {
        setMessages([...messages, newMessage]);
        setFile("");
        setLatestMsgTime(new Date());
        setLatestMsg(newMessage);
        // const res =
        Socket.emit("sendMessage", {
          chat: selectedConversation,
          content: messageText,
          sender: userId,
          _id: res?._id,
        });
        setMessageSent(true);
        setNewMessage("");
      })
      .catch((err) => {
        console.log(err);
      });
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };
  const userId = localStorage.getItem("userId");
  console.log(isUser(), "isUser");
  const isThisUser = isUser();

  return (
    <>
      <Header />
      <section className="" onClick={() => setShowEmoji(false)}>
        <Container onClick={() => setShowEmoji(false)}>
          {conversations.length > 0 ? (
            <div className="main-content chat-screen">
              <div className="chat_field">
                <div id="frame">
                  <div id="sidepanel">
                    <div id="contacts">
                      <ul>
                        {conversations?.map((conversation) => {
                          return (
                            <li
                              onClick={() => {
                                handleConversationClick(conversation?._id);
                                setConvoData(conversation);
                                setIsSelectedChatClosed(conversation?.isClosed);
                              }}
                              class={`contact ${
                                selectedConversation === conversation?._id
                                  ? "active"
                                  : ""
                              }`}
                              key={conversation._id}
                            >
                              <div class="wrap">
                                <img
                                  src={
                                    isUserNameDisplay(
                                      conversation?.participants[1]?._id
                                    )
                                      ? conversation?.participants[0]
                                          ?.profilePhoto
                                        ? `${AVATAR_BASE_URL}${conversation?.participants[0]?.profilePhoto}`
                                        : ExpertImg
                                      : conversation?.participants[1]
                                          ?.profilePhoto
                                      ? `${AVATAR_BASE_URL}${conversation?.participants[1]?.profilePhoto}`
                                      : ExpertImg
                                  }
                                  alt="img"
                                />
                                <img
                                  src={
                                    !isUserNameDisplay(
                                      conversation?.participants[1]?._id
                                    )
                                      ? conversation?.participants[0]
                                          ?.profilePhoto
                                        ? `${AVATAR_BASE_URL}${conversation?.participants[0]?.profilePhoto}`
                                        : ExpertImg
                                      : conversation?.participants[1]
                                          ?.profilePhoto
                                      ? `${AVATAR_BASE_URL}${conversation?.participants[1]?.profilePhoto}`
                                      : ExpertImg
                                  }
                                  alt="img"
                                  style={{ marginLeft: "-40px" }}
                                />
                                <div class="meta">
                                  <div
                                    style={{
                                      display: "flex",
                                      justifyContent: "space-between",
                                    }}
                                  >
                                    <p class="name">
                                      {isUserNameDisplay(
                                        conversation?.participants[1]?._id
                                      )
                                        ? `${conversation?.participants[0]?.firstName} ${conversation?.participants[0]?.lastName}`
                                        : `${conversation?.participants[1]?.firstName} ${conversation?.participants[1]?.lastName}`}
                                      {conversation?.admin &&
                                        `${" & "}` +
                                          conversation?.admin.firstName}
                                      {conversation?.superAdmin &&
                                        `${" & "}` +
                                          conversation?.superAdmin.firstName}
                                    </p>
                                    <p> {conversation?.booking?.bookingId}</p>
                                  </div>

                                  <div
                                    style={{
                                      display: "flex",
                                      justifyContent: "space-between",
                                      width: "260px",
                                    }}
                                  >
                                    <p
                                      class="preview"
                                      style={{ width: "100px" }}
                                    >
                                      {conversation?.latestMessage?.content}
                                    </p>
                                    {!conversation?.isClosed && (
                                      <p class="preview">
                                        {format(
                                          conversation?.latestMessage?.createdAt
                                        )}
                                      </p>
                                    )}
                                    {conversation?.isClosed && (
                                      <p
                                        class="preview"
                                        style={{ color: "red" }}
                                      >
                                        Closed
                                      </p>
                                    )}
                                    {console.log(
                                      "isClosed",
                                      conversation?.isClosed
                                    )}
                                  </div>
                                </div>
                              </div>
                            </li>
                          );
                        })}
                        {/* <li class="contact">
                        <div class="wrap">
                          <img src={Bookingimg} alt="img" />
                          <div class="meta">
                            <p class="name">Jaxen C</p>
                            <p class="preview">
                              My progress getting better. Thank you
                            </p>
                          </div>
                        </div>
                      </li>
                      <li class="contact active">
                        <div class="wrap">
                          <img src={Bookingimg2} alt="img" />
                          <div class="meta">
                            <p class="name">Harvey Specter</p>
                            <p class="preview">Hello</p>
                          </div>
                        </div>
                      </li> */}
                      </ul>
                    </div>
                  </div>
                  <div class="content">
                    <div class="messages" ref={scrollRef}>
                      {/* <p className="msg_date">September 15, 2022</p> */}
                      <ul>
                        {messages?.map((message) => {
                          const checkType = message.type;
                          const fileType =
                            message.type && message.type !== "text"
                              ? checkType?.split("/")[0]
                              : message.type;
                          console.log(fileType);

                          if (fileType == "image") {
                            console.log("yes");
                            const imgurl = `${BASE_URL}${message?.media}`;
                            console.log(imgurl);
                            return (
                              <li
                                className={`sent ${
                                  message?.sender?._id === userId
                                    ? "replies"
                                    : "sent"
                                }`}
                                key={message?._id}
                                style={{
                                  marginTop: "10px",
                                  marginBottom: "10px",
                                }}
                              >
                                {/* <h6>{format(message?.createdAt)}</h6> */}
                                {message?.sender?._id !== userId && (
                                  <img
                                    src={
                                      message?.sender?.profilePhoto
                                        ? `${AVATAR_BASE_URL}${message?.sender?.profilePhoto}`
                                        : DefaultAvatar
                                    }
                                    alt="img"
                                    style={{
                                      width: "50px",
                                      height: "50px",
                                      margin: "2px",
                                    }}
                                  />
                                )}
                                <img
                                  alt="image"
                                  src={imgurl}
                                  onClick={() => {
                                    window.open(
                                      `${BASE_URL}${message?.media}`,
                                      "_blank"
                                    );
                                  }}
                                  style={{
                                    width: "200px",
                                    height: "130px",
                                    borderRadius: 0,
                                    border: "2px solid green",
                                  }}
                                />
                              </li>
                            );
                          }
                          if (fileType == "audio") {
                            return (
                              <li
                                className={`sent ${
                                  message?.sender?._id === userId
                                    ? "replies"
                                    : "sent"
                                }`}
                                key={message?._id}
                              >
                                {message?.sender?._id !== userId && (
                                  <img
                                    src={
                                      message?.sender?.profilePhoto
                                        ? `${AVATAR_BASE_URL}${message?.sender?.profilePhoto}`
                                        : DefaultAvatar
                                    }
                                    alt="img"
                                    style={{
                                      width: "40px",
                                      height: "40px",
                                      margin: "2px",
                                    }}
                                  />
                                )}
                                <audio
                                  src={`${BASE_URL}${message?.media}`}
                                  controls
                                />
                                <h6>{format(message?.createdAt)}</h6>
                              </li>
                            );
                          }
                          if (message.type == "application/pdf") {
                            return (
                              <li
                                className={`sent ${
                                  message?.sender?._id === userId
                                    ? "replies"
                                    : "sent"
                                }`}
                                key={message?._id}
                              >
                                {message?.sender?._id !== userId && (
                                  <img
                                    src={
                                      message?.sender.profilePhoto
                                        ? `${AVATAR_BASE_URL}${message?.sender?.profilePhoto}`
                                        : DefaultAvatar
                                    }
                                    alt="img"
                                    style={{
                                      width: "40px",
                                      height: "40px",
                                      margin: "2px",
                                    }}
                                  />
                                )}
                                <button
                                  onClick={() =>
                                    window.open(
                                      `${BASE_URL}${message?.media}`,
                                      "_blank"
                                    )
                                  }
                                  style={{
                                    width: "130px",
                                    color: "grey",
                                    padding: "12px",
                                    border: 0,
                                  }}
                                >
                                  <img alt="pdf-icon" src={pdfIcon} />
                                  Open File
                                </button>
                                <h6>{format(message?.createdAt)}</h6>
                              </li>
                            );
                          }
                          if (message.type == "text") {
                            return (
                              <li
                                className={`sent ${
                                  message?.sender?._id === userId
                                    ? "replies"
                                    : "sent"
                                }`}
                                key={message?._id}
                              >
                                {message?.sender?._id !== userId && (
                                  <img
                                    src={
                                      message?.sender?.profilePhoto
                                        ? `${AVATAR_BASE_URL}${message?.sender?.profilePhoto}`
                                        : DefaultAvatar
                                    }
                                    alt="img"
                                    style={{
                                      width: "40px",
                                      height: "40px",
                                      margin: "2px",
                                    }}
                                  />
                                )}
                                <h6 style={{marginTop:"-15px", color:"black", fontWeight:"900"}}>{message?.sender?.role}</h6>
                                <p>{message?.content}</p>
                                <h6>{format(message?.createdAt)}</h6>
                              </li>
                            );
                          }
                          // return fileType == "image" ? (
                          //   <li
                          //     className={`sent ${
                          //       message?.sender?._id === userId
                          //         ? "replies"
                          //         : "sent"
                          //     }`}
                          //     key={message?._id}
                          //   >
                          //     <p>{message?.content}</p>
                          //     <h6>{format(message?.createdAt)}</h6>
                          //   </li>
                          // ) : (
                          //   <li
                          //     className={`sent ${
                          //       message?.sender?._id === userId
                          //         ? "replies"
                          //         : "sent"
                          //     }`}
                          //   >
                          //     <audio
                          //       src={`${BASE_URL}${message?.media}`}
                          //       controls
                          //     />
                          //   </li>
                          // );
                        })}
                        {/* <audio src="http://localhost:4000/uploads/chat/audio-1696488297171.mp3" /> */}
                      </ul>
                    </div>
                    {selectedConversation && (
                      <div class="message-input">
                        <div class="wrap">
                          {file && (
                            <p className="img-name">
                              <span>
                                <img
                                  src={
                                    file.type === "application/pdf"
                                      ? PdfICon
                                      : file.type.split("/")[0] === "audio"
                                      ? MusicIcon
                                      : `${URL.createObjectURL(file)}`
                                  }
                                  style={{
                                    width: "50px",
                                    height: "40px",
                                    marginTop: "-4px",
                                  }}
                                  alt=""
                                  title=""
                                  class="img-small"
                                />
                                {file?.name}
                              </span>{" "}
                              <button onClick={() => setFile()}>
                                <img
                                  src="https://cdn-icons-png.flaticon.com/512/660/660252.png "
                                  style={{ width: "22px" }}
                                  alt=""
                                  title=""
                                  class="img-small"
                                />
                              </button>
                            </p>
                          )}
                          {!isSelectedChatClosed && (
                            <img
                              src={EmojiIcon}
                              style={{
                                width: "35px",
                                height: "35px",
                                cursor: "pointer",
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowEmoji(!showEmoji);
                              }}
                            />
                          )}
                          {showEmoji && !isSelectedChatClosed && (
                            <div
                              style={{
                                marginBottom: "500px",
                                position: "absolute",
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                              }}
                            >
                              <Picker
                                data={data}
                                onEmojiSelect={(e) => {
                                  setNewMessage(`${newMessage}${e.native}`);
                                }}
                              />
                            </div>
                          )}
                          {!isSelectedChatClosed && (
                            <input
                              type="text"
                              value={newMessage}
                              onChange={(e) => setNewMessage(e.target.value)}
                              onKeyPress={(e) => {
                                if (e.key === "Enter")
                                  handleSendMessage(newMessage);
                                if (showEmoji) setShowEmoji(false);
                              }}
                              placeholder="Write your message..."
                            />
                          )}
                          {!isSelectedChatClosed && (
                            <div style={{ display: "flex" }}>
                              <FileInputIcon
                                file={file}
                                setFile={(value) => setFile(value)}
                              />
                              <img
                                style={{ cursor: "pointer" }}
                                src={Send}
                                alt="img"
                                onClick={() => handleSendMessage(newMessage)}
                              />
                            </div>
                          )}
                          {isSelectedChatClosed && (
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                textAlign: "center",
                                width: "-webkit-fill-available",
                                color: "red",
                              }}
                            >
                              <h6>Closed</h6>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
              className="no_chat"
            >
              You have no conversations
            </div>
          )}
        </Container>
      </section>
      <JoyRideComponent
        steps={[
          {
            disableBeacon: true,
            target: ".message-input",
            content: "Send Message Here",
          },
        ]}
      />
    </>
  );
};

export default Chat;
