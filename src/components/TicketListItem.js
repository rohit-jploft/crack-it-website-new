import React from "react";
import OpenIcon from "../Images/icons/open_icon_ticket.svg";
import ResolvedIcon from "../Images/icons/resolved_icon_ticket.svg";
import ProgressIcon from "../Images/icons/in_progress_icon_ticket.svg";
import { format } from "timeago.js";
const TicketListItem = ({
  status,
  reason,
  query,
  ticketNo,
  createdAt,
  feedbackByAdmin,
}) => {
  return (
    <div className="ticket">
      <div className="ticket-header">
        <span>Ticket ID: {ticketNo}</span>
        <span
          className="status-open"
          style={{
            color:
              status === "OPEN"
                ? "#FFAB3F"
                : status === "RESOLVED"
                ? "#0FD678"
                : "#3939F5",
          }}
        >
          <img
            src={
              status === "OPEN"
                ? OpenIcon
                : status === "RESOLVED"
                ? ResolvedIcon
                : ProgressIcon
            }
            style={{ marginRight: "4px" }}
          />
          {status.toLowerCase()}
        </span>
      </div>
      <div className="ticket-body">
        <h3><b>Subject:</b> {reason}</h3>
        <p>{query}</p>
        {feedbackByAdmin && <p><b>Feedback by Admin</b> - {feedbackByAdmin}</p>}
      </div>
      <div className="ticket-footer">
        <span>{format(createdAt)}</span>
      </div>
    </div>
  );
};

export default TicketListItem;
