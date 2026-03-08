const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const eventRoutes = require("./routes/eventRoutes");
const authRoutes = require("./routes/authRoutes");
const vendorTypeRoutes = require("./routes/vendorTypeRoutes");
const venueRoutes = require("./routes/venueRoutes");
require("dotenv").config();

const app = express();

const mongoURI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/WellnessDb";

mongoose
  .connect(mongoURI)
  .then(() => console.log("MongoDB Connected: Wellness-Event System Ready"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

app.use(express.json());
app.use(cors());
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/vendor-types", vendorTypeRoutes);
app.use("/api/venues", venueRoutes);
/* ---------- SERVE REACT BUILD ---------- */

app.use(express.static(path.join(__dirname, "../client/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});

/* -------------------------------------- */

app.get("/", (req, res) => {
  res.send("Wellness Event API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is flying on http://localhost:${PORT}`);
});
