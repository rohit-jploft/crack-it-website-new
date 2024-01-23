import React, { useEffect, useState } from "react";

import Header from "./Header";
import Container from "react-bootstrap/Container";
import TicketListItem from "../components/TicketListItem";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../constant";
import NoTicketIcon from "../Images/icons/no_ticket.svg";

const AllTickets = () => {
  const navigate = useNavigate();
  const [ticketsData, setTicketsData] = useState([]);

  const getAllTicketsData = async () => {
    const userId = localStorage.getItem("userId");
    const res = await axios.get(`${BASE_URL}ticket/get-all?user=${userId}`);
    console.log(res);
    setTicketsData(res?.data?.data);
  };

  useEffect(() => {
    getAllTicketsData();
  }, []);
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
            <h3>Tickets</h3>
            {ticketsData.length > 0 &&
              ticketsData.map((ticket, index) => {
                return (
                  <TicketListItem
                    key={index}
                    reason={ticket?.reason?.reason}
                    query={ticket?.query}
                    status={ticket?.status}
                    ticketNo={ticket?.ticketNo}
                    createdAt={ticket?.createdAt}
                  />
                );
              })}

            {ticketsData?.length === 0 && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "column",
                  marginTop: "40px",
                }}
              >
                <div style={{margin:"25px",padding:"25px", background:"#C2FFDD 0% 0% no-repeat padding-box", border:"1px solid #8DF3BD", borderRadius:"50%"}}>
                  <img src={NoTicketIcon} />
                </div>
                <h3>No Ticket</h3>
                <span style={{ width: "250px" }}>
                  Issue ticket is not available here. do you have any query
                  please create ticket and solve your problem
                </span>
              </div>
            )}
            <div style={{ marginTop: "30px" }}>
              <button
                type="submit"
                className="raise_issue_button"
                onClick={() => {
                  navigate("/mybookings/Past");
                }}
              >
                Raise Issue
              </button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
};

export default AllTickets;
