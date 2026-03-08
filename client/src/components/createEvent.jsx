import React, { useState, useEffect } from "react";

const CreateEvent = ({ user, onBack, existingEvent }) => {
  const [categories, setCategories] = useState([]);
  const [venueLibrary, setVenueLibrary] = useState([]);
  const [filteredVenues, setFilteredVenues] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [formData, setFormData] = useState({
    eventName: "",
    streetName: "",
    venueDetails: "",
    postalCode: "",
    state: "",
    country: "",
    eventType: "",
    date1: "",
    date2: "",
    date3: "",
  });

  useEffect(() => {
    // Load Service Categories
    fetch("http://localhost:5000/api/vendor-types")
      .then((res) => res.json())
      .then(setCategories)
      .catch((err) => console.error("Error loading categories", err));

    // auto complete venue library
    fetch("http://localhost:5000/api/venues")
      .then((res) => res.json())
      .then(setVenueLibrary)
      .catch((err) => console.error("Error loading venues", err));
  }, []);

  useEffect(() => {
    if (existingEvent) {
      setFormData({
        eventName: existingEvent.eventName || "",
        streetName: existingEvent.location?.streetName || "",
        venueDetails: existingEvent.location?.venueDetails || "",
        postalCode: existingEvent.location?.postalCode || "",
        state: existingEvent.location?.state || "",
        country: existingEvent.location?.country || "",
        eventType: existingEvent.eventType || "",
        date1: existingEvent.proposedDates?.[0] || "",
        date2: existingEvent.proposedDates?.[1] || "",
        date3: existingEvent.proposedDates?.[2] || "",
      });
    }
  }, [existingEvent]);

  const handlePostalChange = (e) => {
    const val = e.target.value;
    setFormData({ ...formData, postalCode: val });

    if (val.trim().length > 0) {
      const matches = venueLibrary.filter(
        (v) =>
          v.postalCode.toString().includes(val.trim()) ||
          v.name.toLowerCase().includes(val.toLowerCase()),
      );

      setFilteredVenues(matches);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const selectVenue = (venue) => {
    setFormData({
      ...formData,
      venueDetails: venue.name,
      postalCode: venue.postalCode,
      streetName: venue.streetName,
      state: venue.state,
      country: "Malaysia",
    });
    setShowSuggestions(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      eventName: formData.eventName,
      hrUser: user.id,
      companyName: user.companyName,
      eventType: formData.eventType,
      proposedDates: [formData.date1, formData.date2, formData.date3].filter(
        Boolean,
      ),
      location: {
        venueDetails: formData.venueDetails,
        streetName: formData.streetName,
        postalCode: formData.postalCode,
        state: formData.state,
        country: formData.country,
      },
    };

    const url = existingEvent
      ? `http://localhost:5000/api/events/${existingEvent._id}`
      : "http://localhost:5000/api/events/create";

    const res = await fetch(url, {
      method: existingEvent ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      alert(existingEvent ? "Saved!" : "Created!");
      onBack();
    }
  };

  return (
    <div style={{ padding: "10px", maxWidth: "550px" }}>
      <h3 style={{ color: "#2c3e50" }}>
        {existingEvent ? "Edit Event" : "New Event Request"}
      </h3>

      <form onSubmit={handleSubmit} style={styles.form}>
        <label style={styles.label}>Event Name</label>
        <input
          className="input-field"
          type="text"
          value={formData.eventName}
          required
          onChange={(e) =>
            setFormData({ ...formData, eventName: e.target.value })
          }
        />

        {/* POSTAL CODE WITH AUTOCOMPLETE */}
        <div style={{ position: "relative" }}>
          <label style={styles.label}>Postal Code (Search Venue Library)</label>
          <input
            className="input-field"
            type="text"
            placeholder="Type postcode or venue name..."
            value={formData.postalCode}
            required
            autoComplete="off"
            onChange={handlePostalChange}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          />

          {showSuggestions && filteredVenues.length > 0 && (
            <ul style={styles.suggestionList}>
              {filteredVenues.map((v) => (
                <li
                  key={v._id}
                  style={styles.suggestionItem}
                  onMouseDown={() => selectVenue(v)}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#f1f7fe")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "#fff")
                  }
                >
                  <span style={{ fontWeight: "bold", color: "#2980b9" }}>
                    {v.postalCode}
                  </span>
                  <span
                    style={{
                      fontSize: "12px",
                      marginLeft: "8px",
                      color: "#34495e",
                    }}
                  >
                    {v.name}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <label style={styles.label}>Venue Name</label>
        <input
          className="input-field"
          type="text"
          value={formData.venueDetails}
          required
          onChange={(e) =>
            setFormData({ ...formData, venueDetails: e.target.value })
          }
        />

        <label style={styles.label}>Street Name</label>
        <input
          className="input-field"
          type="text"
          value={formData.streetName}
          required
          onChange={(e) =>
            setFormData({ ...formData, streetName: e.target.value })
          }
        />

        <div style={styles.grid}>
          <div style={styles.inputStack}>
            <label style={styles.label}>State</label>
            <input
              className="input-field"
              type="text"
              value={formData.state}
              required
              onChange={(e) =>
                setFormData({ ...formData, state: e.target.value })
              }
            />
          </div>
          <div style={styles.inputStack}>
            <label style={styles.label}>Country</label>
            <input
              className="input-field"
              type="text"
              value={formData.country}
              required
              onChange={(e) =>
                setFormData({ ...formData, country: e.target.value })
              }
            />
          </div>
        </div>

        <label style={styles.label}>Service Required</label>
        <select
          className="input-field"
          value={formData.eventType}
          required
          onChange={(e) =>
            setFormData({ ...formData, eventType: e.target.value })
          }
        >
          <option value="">-- Select Category --</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {" "}
              {cat.name}
            </option>
          ))}
        </select>

        <label style={styles.label}>Proposed Dates</label>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <input
            className="input-field"
            type="date"
            value={formData.date1}
            required
            onChange={(e) =>
              setFormData({ ...formData, date1: e.target.value })
            }
          />
          <input
            className="input-field"
            type="date"
            value={formData.date2}
            required
            onChange={(e) =>
              setFormData({ ...formData, date2: e.target.value })
            }
          />
          <input
            className="input-field"
            type="date"
            value={formData.date3}
            required
            onChange={(e) =>
              setFormData({ ...formData, date3: e.target.value })
            }
          />
        </div>

        <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
          <button type="submit" className="btn-primary" style={{ flex: 2 }}>
            Submit
          </button>
          <button type="button" className="btn-logout" onClick={onBack}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

const styles = {
  form: { display: "flex", flexDirection: "column", gap: "12px" },
  label: {
    fontSize: "12px",
    fontWeight: "bold",
    color: "#34495e",
    marginBottom: "-5px",
  },
  grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" },
  inputStack: { display: "flex", flexDirection: "column", gap: "5px" },
  suggestionList: {
    position: "absolute",
    top: "58px",
    left: 0,
    right: 0,
    backgroundColor: "white",
    border: "1px solid #3498db",
    borderRadius: "4px",
    listStyle: "none",
    padding: "5px 0",
    margin: 0,
    zIndex: 1000,
    boxShadow: "0 10px 20px rgba(0,0,0,0.15)",
    maxHeight: "180px",
    overflowY: "auto",
  },
  suggestionItem: {
    padding: "10px 15px",
    cursor: "pointer",
    fontSize: "13px",
    borderBottom: "1px solid #f1f1f1",
    display: "flex",
    alignItems: "center",
    backgroundColor: "#fff",
  },
};

export default CreateEvent;
