import "./../style.css";
import Header from "./Header";
import Container from "react-bootstrap/Container";
import { Link, useNavigate, useParams } from "react-router-dom";

import Send from "./../Images/send.svg";
import Bookingimg from "./../Images/booking-img.svg";
import Bookingimg2 from "./../Images/booking-img2.svg";
import {
  getConversation,
  getConvoMessage,
  searchConvoApi,
  sendMessage,
} from "../data/chat";
import { useEffect, useState, useRef } from "react";
import { format, render, cancel, register } from "timeago.js";
import Socket from "../data/socket";
import { isExpert, isUser, isUserNameDisplay } from "../utils/authHelper";
import FileInputIcon from "../components/FileInputIcon";
import { BASE_URL } from "../constant";
import pdfIcon from '../Images/pdf_icon.png'
import { Button } from "react-bootstrap";
const Chat = () => {
  const navigate = useNavigate();
  const {convoId} = useParams()

  const [selectedConversation, setSelectedConversation] = useState(convoId || null);
  const [newMessage, setNewMessage] = useState("");
  const [convoData, setConvoData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageSent, setMessageSent] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [file, setFile] = useState();
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
  }, []);
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
      <section className="">
        <Container>
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
                              }}
                              class={`contact ${
                                selectedConversation === conversation?._id
                                  ? "active"
                                  : ""
                              }`}
                              key={conversation._id}
                            >
                              <div class="wrap">
                                <img src={Bookingimg} alt="img" />
                                <div class="meta">
                                  <p class="name">
                                    {isUserNameDisplay(
                                      conversation?.participants[1]?._id
                                    )
                                      ? `${conversation?.participants[0]?.firstName} ${conversation?.participants[0]?.lastName}`
                                      : `${conversation?.participants[1]?.firstName} ${conversation?.participants[1]?.lastName}`}
                                  </p>
                                  {/* <p class="preview">
                                  My progress getting better. Thank you
                                </p> */}
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
                                    height: "120px",
                                    borderRadius: 0,
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
                                <button
                                  onClick={() =>
                                    window.open(
                                      `${BASE_URL}${message?.media}`,
                                      "_blank"
                                    )
                                  }
                                  style={{ width: "130px", color:'grey', padding:'12px', border:0 }}
                                >
                                  <img alt="pdf-icon" src={pdfIcon}/>
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
                          <input
                            type="text"
                            value={file ? file.name : newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === "Enter")
                                handleSendMessage(newMessage);
                            }}
                            placeholder="Write your message..."
                          />
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
            >
              You have no conversations
            </div>
          )}
        </Container>
      </section>
    </>
  );
};

export default Chat;
