import React, { useState } from "react";
import CreateEvent from "../components/CreateEvent";
import EventList from "../components/EventList";

const HRDashboard = ({ user }) => {
  const [view, setView] = useState("list");
  const [selectedEventForEdit, setSelectedEventForEdit] = useState(null);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const handleEditInitiated = (event) => {
    setSelectedEventForEdit(event);
    setView("edit");
  };

  return (
    <div
      className="page-wrapper"
      style={{
        backgroundColor: "#f4f7f6",
        minHeight: "100vh",
        padding: "20px 0",
      }}
    >
      <div
        className="container"
        style={{ maxWidth: "1200px", margin: "0 auto" }}
      >
        {/* PORTAL HEADER */}
        <header className="card" style={styles.header}>
          <div>
            <h2 style={{ margin: 0, color: "#2c3e50" }}>HR Portal</h2>
            <p style={{ margin: 0, color: "#7f8c8d", fontSize: "14px" }}>
              Welcome, <strong>{user.companyName}</strong>
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

        {/* MAIN CONTENT AREA */}
        <main>
          {view === "list" ? (
            <>
              <div style={styles.tableHeader}>
                <h3 style={{ margin: 0, color: "#34495e" }}>Company Events</h3>
                <button
                  className="btn-primary"
                  onClick={() => {
                    setSelectedEventForEdit(null);
                    setView("create");
                  }}
                  style={styles.createBtn}
                >
                  + Propose New Event
                </button>
              </div>

              <div
                className="card"
                style={{ padding: 0, borderRadius: "8px", overflow: "hidden" }}
              >
                {/* EventList will fetch events based on user.companyName */}
                <EventList user={user} onEdit={handleEditInitiated} />
              </div>
            </>
          ) : (
            <div className="card" style={{ padding: "30px" }}>
              <div style={{ marginBottom: "20px" }}>
                <button
                  style={styles.backBtn}
                  onClick={() => {
                    setView("list");
                    setSelectedEventForEdit(null);
                  }}
                >
                  ← Back to List
                </button>
              </div>

              <h3 style={{ marginBottom: "20px" }}>
                {selectedEventForEdit
                  ? "Edit Proposed Event"
                  : "Create New Event Request"}
              </h3>

              <CreateEvent
                user={user}
                existingEvent={selectedEventForEdit}
                onBack={() => {
                  setSelectedEventForEdit(null);
                  setView("list");
                }}
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

const styles = {
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
  tableHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "15px",
    padding: "0 5px",
  },
  createBtn: {
    padding: "10px 25px",
    backgroundColor: "#2ecc71",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  backBtn: {
    backgroundColor: "#f8f9fa",
    color: "#2c3e50",
    border: "1px solid #ddd",
    padding: "8px 15px",
    borderRadius: "4px",
    cursor: "pointer",
  },
  logoutBtn: {
    backgroundColor: "#e74c3c",
    color: "#fff",
    border: "none",
    padding: "8px 15px",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

export default HRDashboard;
