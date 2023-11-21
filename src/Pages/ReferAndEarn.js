import React, { useState } from "react";
import Header from "./Header";
import { Container } from "react-bootstrap";

import Gamil from "./../Images/gmail.svg";
import Facebook from "./../Images/facebook.svg";
import Twitter from "./../Images/twitter.svg";
import Msg from "./../Images/msg-1.svg";
import Copy from "./../Images/copy.svg";
import WhatsappIcon from "../Images/whatsapp_ic.svg";
import { Link, useLocation } from "react-router-dom";
import { FE_BASE_URL } from "../constant";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { ToastContainer, toast } from "react-toastify";

import {
  EmailShareButton,
  FacebookShareButton,
  TwitterShareButton,
  FacebookMessengerShareButton,
  WhatsappShareButton,
} from "react-share";
import "react-toastify/dist/ReactToastify.css";
const ReferAndEarn = () => {
  const userId = localStorage.getItem("userId");
  const [copied, setCopied] = useState(false);
  const match = useLocation();
  console.log(match);

  return (
    <div>
      <ToastContainer />
      <Header />
      <section className="">
        <Container>
          <div className="refer-earn">
            <div className="refer-banner">
              <h2>Refer a Friend</h2>
              <p>$ earn credit</p>
            </div>
            <p className="text-refer">
              Share a link with your friends via E-mail, Facebook Twitter or
              messenger. When they sign up using your link they get $5 free. And
              when they make purchase you'll get $5 free too.
            </p>
            <div>
              <ul className="social-link-man">
                <li>
                  {/* <Link to="/"> */}{" "}
                  <EmailShareButton
                    url={`${FE_BASE_URL}/refer/signup/${userId}`}
                  >
                    <img src={Gamil} />
                  </EmailShareButton>
                  {/* </Link> */}
                </li>
                {/* <li>
                  <FacebookShareButton
                    url={`${FE_BASE_URL}/refer/signup/${userId}`}
                  >
                    <img src={Facebook} />
                  </FacebookShareButton>
                </li> */}
                <li>
                  <WhatsappShareButton
                    url={`${FE_BASE_URL}/refer/signup/${userId}`}
                  >
                    {/* <WhatsappIcon size={50} round={false} />
                    <img */}
                    <img
                      src={WhatsappIcon}
                      // style={{ height: "45px", width: "45px" }}
                    />
                  </WhatsappShareButton>
                </li>
                <li>
                  <TwitterShareButton
                    url={`${FE_BASE_URL}/refer/signup/${userId}`}
                  >
                    <img src={Twitter} />
                  </TwitterShareButton>
                </li>
                <li>
                  <FacebookMessengerShareButton
                    url={`${FE_BASE_URL}/refer/signup/${userId}`}
                  >
                    <img src={Msg} />
                  </FacebookMessengerShareButton>
                </li>
              </ul>
              <p className="text-center w-100 text-refer m-0">
                Or share your personal link
              </p>
            </div>
            <div className="input-copy">
              <p>
                {`${FE_BASE_URL}/refer/signup/${userId}`}
                <CopyToClipboard
                  text={`${FE_BASE_URL}/refer/signup/${userId}`}
                  onCopy={() => {
                    setCopied(true);
                    if (!copied) {
                      toast.success("Copied", { autoClose: 400 });
                    }
                  }}
                >
                  <img style={{ cursor: "pointer" }} src={Copy} />
                </CopyToClipboard>
              </p>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
};
export default ReferAndEarn;
