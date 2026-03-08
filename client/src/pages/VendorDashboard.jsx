import React, { useState, useEffect } from "react";
import EventModal from "../components/eventModal";

const VendorDashboard = ({ user }) => {
  const [events, setEvents] = useState([]);
  const [view, setView] = useState("pending");
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, [user.vendorType, view]);

  const fetchEvents = async () => {
    try {
      const tags = Array.isArray(user.vendorType)
        ? user.vendorType.join(",")
        : user.vendorType;

      const res = await fetch(
        `http://localhost:5000/api/events?vendorType=${tags}&vendorId=${user.id}`,
      );
      const data = await res.json();

      const filteredData = data.filter((e) => {
        if (view === "pending") {
          return e.status === "Pending";
        } else {
          return (
            (e.status === "Approved" || e.status === "Rejected") &&
            (e.vendorId === user.id || e.vendorId?._id === user.id)
          );
        }
      });

      setEvents(filteredData);
    } catch (err) {
      console.error("Fetch Error:", err);
    }
  };

  const handleAction = async (type, payload) => {
    const endpoint = type === "approve" ? "approve" : "reject";

    const finalPayload = {
      ...payload,
      vendorId: user.id,
      vendorName: user.companyName,
    };

    try {
      const res = await fetch(
        `http://localhost:5000/api/events/${endpoint}/${selectedEvent._id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(finalPayload),
        },
      );

      if (res.ok) {
        alert(
          `Event successfully ${type === "approve" ? "Confirmed" : "Rejected"}!`,
        );
        setSelectedEvent(null);
        fetchEvents();
      }
    } catch (err) {
      alert("Error updating event status");
    }
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("user");
      window.location.reload();
    }
  };

  return (
    <div className="page-wrapper" style={styles.pageWrapper}>
      <div
        className="container"
        style={{ maxWidth: "1100px", margin: "0 auto" }}
      >
        {/* HEADER */}
        <header className="card" style={styles.header}>
          <div>
            <h2 style={{ margin: 0, color: "#2c3e50" }}>Vendor Portal</h2>
            <p style={{ margin: 0, color: "#7f8c8d", fontSize: "14px" }}>
              Logged in as: <strong>{user.companyName}</strong> | Services:{" "}
              {Array.isArray(user.vendorType)
                ? user.vendorType.join(" • ")
                : user.vendorType}
            </p>
          </div>
          <button
            className="btn-logout"
            onClick={handleLogout}
            style={styles.logoutBtn}
          >
            Logout ⎋
          </button>
        </header>

        {/* MAIN CONTENT */}
        <div className="card" style={styles.mainCard}>
          {/* TAB NAVIGATION */}
          <div style={styles.tabBar}>
            <button
              onClick={() => setView("pending")}
              style={tabStyle(view === "pending")}
            >
              New Requests {view === "pending" ? `(${events.length})` : ""}
            </button>
            <button
              onClick={() => setView("confirmed")}
              style={tabStyle(view === "confirmed")}
            >
              My Schedule {view === "confirmed" ? `(${events.length})` : ""}
            </button>
          </div>

          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#f8f9fa", textAlign: "left" }}>
                <th style={styles.th}>Event Name</th>
                <th style={styles.th}>HR Company</th>
                <th style={styles.th}>Location</th>
                <th style={styles.th}>
                  {view === "pending" ? "Proposed Dates" : "Confirmed Date"}
                </th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Action</th>
              </tr>
            </thead>
            <tbody>
              {events.length > 0 ? (
                events.map((event) => (
                  <tr key={event._id} style={styles.tr}>
                    <td style={styles.td}>
                      <strong>{event.eventName}</strong>
                    </td>
                    <td style={styles.td}>{event.companyName}</td>
                    <td style={styles.td}>
                      <div style={{ fontSize: "12px" }}>
                        {event.location?.venueDetails}
                      </div>
                      <div style={{ fontSize: "11px", color: "#95a5a6" }}>
                        {event.location?.postalCode}
                      </div>
                    </td>
                    <td style={styles.td}>
                      {event.confirmedDate ? (
                        <span style={{ color: "#27ae60", fontWeight: "bold" }}>
                          {new Date(event.confirmedDate).toLocaleDateString()}
                        </span>
                      ) : (
                        <span style={{ fontSize: "12px", color: "#666" }}>
                          {event.proposedDates
                            ?.map((d) => new Date(d).toLocaleDateString())
                            .join(" | ") || "N/A"}
                        </span>
                      )}
                    </td>
                    <td style={styles.td}>
                      <span style={statusBadgeStyle(event.status)}>
                        {event.status}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <button
                        className="btn-primary"
                        onClick={() => setSelectedEvent(event)}
                        style={styles.viewBtn}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={styles.emptyRow}>
                    No {view} events found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedEvent && (
        <EventModal
          event={selectedEvent}
          userRole="Vendor"
          onClose={() => setSelectedEvent(null)}
          onAction={handleAction}
        />
      )}
    </div>
  );
};

const styles = {
  pageWrapper: {
    minHeight: "100vh",
    backgroundColor: "#f4f7f6",
    padding: "40px 0",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
    padding: "20px",
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
  },
  logoutBtn: {
    padding: "8px 16px",
    backgroundColor: "#e74c3c",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  mainCard: {
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
    overflow: "hidden",
  },
  tabBar: {
    display: "flex",
    backgroundColor: "#f8f9fa",
    borderBottom: "1px solid #eee",
    padding: "10px 20px",
  },
  th: {
    padding: "15px 20px",
    color: "#7f8c8d",
    fontWeight: "600",
    fontSize: "13px",
    textTransform: "uppercase",
  },
  td: { padding: "15px 20px", color: "#2c3e50", fontSize: "14px" },
  tr: { borderBottom: "1px solid #eee" },
  viewBtn: {
    padding: "6px 12px",
    backgroundColor: "#3498db",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  emptyRow: { padding: "40px", textAlign: "center", color: "#95a5a6" },
};

const tabStyle = (isActive) => ({
  padding: "10px 20px",
  cursor: "pointer",
  border: "none",
  backgroundColor: "transparent",
  color: isActive ? "#3498db" : "#7f8c8d",
  borderBottom: isActive ? "3px solid #3498db" : "3px solid transparent",
  fontWeight: isActive ? "bold" : "normal",
  marginRight: "10px",
  transition: "all 0.3s ease",
});

const statusBadgeStyle = (status) => ({
  padding: "4px 10px",
  borderRadius: "12px",
  fontSize: "11px",
  fontWeight: "bold",
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
  border: `1px solid ${
    status === "Approved"
      ? "#27ae60"
      : status === "Rejected"
        ? "#e74c3c"
        : "#f39c12"
  }`,
  display: "inline-block",
  textAlign: "center",
});

export default VendorDashboard;
