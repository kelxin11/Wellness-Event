import React, { useState } from "react";

const EventModal = ({ event, userRole, onClose, onAction }) => {
  const [step, setStep] = useState("view"); // type of mode "view", "selectDate", "rejectReason"
  const [selectedDate, setSelectedDate] = useState("");
  const [reason, setReason] = useState("");

  const handleApproveSubmit = () => {
    if (!selectedDate) return alert("Please select a date!");
    onAction("approve", { selectedDate });
  };

  const handleRejectSubmit = () => {
    if (!reason) return alert("Please enter a reason!");
    onAction("reject", { reason });
  };

  return (
    <div className="modal-overlay" style={styles.overlay}>
      <div className="modal-content" style={styles.modal}>
        <h3>{event.eventName}</h3>
        <hr />

        {/* STEP 1: VIEW INFO */}
        {step === "view" && (
          <div>
            <p>
              <strong>Company:</strong> {event.companyName}
            </p>
            <p>
              <strong>Location:</strong> {event.location?.venueDetails},{" "}
              {event.location?.streetName}
            </p>
            <p>
              <strong>Proposed Dates:</strong>
            </p>
            <ul>
              {event.proposedDates.map((d, i) => (
                <li key={i}>{new Date(d).toLocaleDateString()}</li>
              ))}
            </ul>

            {/* ONLY VENDOR SEES THESE BUTTONS */}
            {userRole === "Vendor" && event.status === "Pending" && (
              <div style={styles.buttonGroup}>
                <button
                  onClick={() => setStep("selectDate")}
                  style={styles.approveBtn}
                >
                  Approve
                </button>
                <button
                  onClick={() => setStep("rejectReason")}
                  style={styles.rejectBtn}
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        )}

        {/* STEP 2: APPROVE -> SELECT DATE */}
        {step === "selectDate" && (
          <div>
            <h4>Select a Confirmed Date</h4>
            {event.proposedDates.map((date, idx) => (
              <label
                key={idx}
                style={{ display: "block", marginBottom: "10px" }}
              >
                <input
                  type="radio"
                  name="dateOption"
                  value={date}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />{" "}
                {new Date(date).toLocaleDateString()}
              </label>
            ))}
            <div style={styles.buttonGroup}>
              <button onClick={handleApproveSubmit} style={styles.confirmBtn}>
                Confirm Approval
              </button>
              <button onClick={() => setStep("view")}>Back</button>
            </div>
          </div>
        )}

        {/* STEP 3: REJECT -> ENTER REASON */}
        {step === "rejectReason" && (
          <div>
            <h4>Reason for Rejection</h4>
            <textarea
              style={{ width: "100%", height: "80px" }}
              placeholder="e.g., Fully booked on these dates..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
            <div style={styles.buttonGroup}>
              <button onClick={handleRejectSubmit} style={styles.rejectBtn}>
                Submit Rejection
              </button>
              <button onClick={() => setStep("view")}>Back</button>
            </div>
          </div>
        )}

        <button onClick={onClose} style={styles.closeBtn}>
          Close
        </button>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modal: {
    backgroundColor: "white",
    padding: "30px",
    borderRadius: "12px",
    width: "400px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
  },
  buttonGroup: { marginTop: "20px", display: "flex", gap: "10px" },
  approveBtn: {
    backgroundColor: "#2ecc71",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "5px",
    cursor: "pointer",
  },
  rejectBtn: {
    backgroundColor: "#e74c3c",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "5px",
    cursor: "pointer",
  },
  confirmBtn: {
    backgroundColor: "#3498db",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "5px",
    cursor: "pointer",
  },
  closeBtn: {
    marginTop: "20px",
    background: "none",
    border: "none",
    color: "#95a5a6",
    cursor: "pointer",
    textDecoration: "underline",
  },
};

export default EventModal;
