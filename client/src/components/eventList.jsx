import React, { useState, useEffect } from "react";
import EventModal from "./eventModal";

const EventList = ({ user, onEdit }) => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, [user.companyName]);

  const fetchEvents = () => {
    fetch(
      `http://localhost:5000/api/events?companyName=${encodeURIComponent(user.companyName)}`,
    )
      .then((res) => res.json())
      .then((data) => setEvents(data))
      .catch((err) => console.error("Error fetching events:", err));
  };

  return (
    <div
      className="card"
      style={{ padding: 0, overflow: "hidden", border: "none" }}
    >
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ backgroundColor: "#f8f9fa", textAlign: "left" }}>
            <th style={thStyle}>Event Name</th>
            <th style={thStyle}>Assigned Vendor</th>
            <th style={thStyle}>Date Created</th>
            <th style={thStyle}>Scheduled Date</th>
            <th style={thStyle}>Status</th>
            <th style={thStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {events.length > 0 ? (
            events.map((event) => (
              <tr key={event._id} style={{ borderBottom: "1px solid #eee" }}>
                <td style={tdStyle}>
                  <strong>{event.eventName}</strong>
                  <div style={{ fontSize: "11px", color: "#7f8c8d" }}>
                    {event.eventType?.name || "Uncategorized"}
                  </div>
                </td>

                <td style={tdStyle}>
                  {/* Checks both populated object and the flat string fallback */}
                  {event.vendorName ||
                  (event.vendorId && event.vendorId.companyName) ? (
                    <span style={{ color: "#2c3e50", fontWeight: "600" }}>
                      {event.vendorName || event.vendorId.companyName}
                    </span>
                  ) : (
                    <span style={{ color: "#95a5a6", fontStyle: "italic" }}>
                      Waiting for Vendor...
                    </span>
                  )}
                </td>

                <td style={tdStyle}>
                  {new Date(event.createdAt).toLocaleDateString()}
                </td>

                <td style={tdStyle}>
                  {event.confirmedDate ? (
                    <strong style={{ color: "#27ae60" }}>
                      {new Date(event.confirmedDate).toLocaleDateString()}
                    </strong>
                  ) : (
                    <div style={{ fontSize: "0.85rem", color: "#666" }}>
                      {event.proposedDates && event.proposedDates.length > 0
                        ? event.proposedDates
                            .map((d) => new Date(d).toLocaleDateString())
                            .join(" / ")
                        : "N/A"}
                    </div>
                  )}
                </td>

                <td style={tdStyle}>
                  <span style={statusBadgeStyle(event.status)}>
                    {event.status}
                  </span>
                </td>

                <td style={tdStyle}>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      className="btn-primary"
                      style={actionBtnStyle("#3498db")}
                      onClick={() => setSelectedEvent(event)}
                    >
                      View
                    </button>

                    {event.status === "Pending" && (
                      <button
                        className="btn-primary"
                        style={actionBtnStyle("#f39c12")}
                        onClick={() => onEdit(event)}
                      >
                        Edit
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="6"
                style={{
                  padding: "30px",
                  textAlign: "center",
                  color: "#95a5a6",
                }}
              >
                No events found for {user.companyName}.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {selectedEvent && (
        <EventModal
          event={selectedEvent}
          userRole="HR"
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </div>
  );
};

const thStyle = {
  padding: "15px 20px",
  color: "#7f8c8d",
  fontSize: "12px",
  textTransform: "uppercase",
};
const tdStyle = {
  padding: "15px 20px",
  fontSize: "14px",
  verticalAlign: "middle",
};

const actionBtnStyle = (bgColor) => ({
  padding: "6px 12px",
  fontSize: "11px",
  backgroundColor: bgColor,
  border: "none",
  borderRadius: "4px",
  color: "white",
  cursor: "pointer",
});

const statusBadgeStyle = (status) => ({
  padding: "4px 10px",
  borderRadius: "12px",
  fontSize: "11px",
  fontWeight: "bold",
  display: "inline-block",
  backgroundColor:
    status === "Approved"
      ? "#eafaf1"
      : status === "Rejected"
        ? "#fdf2f2"
        : "#fff9db",
  color:
    status === "Approved"
      ? "#27ae60"
      : status === "Rejected"
        ? "#e74c3c"
        : "#f39c12",
  border: `1px solid ${status === "Approved" ? "#27ae60" : status === "Rejected" ? "#e74c3c" : "#f39c12"}`,
});

export default EventList;
