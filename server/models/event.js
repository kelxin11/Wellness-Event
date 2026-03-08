const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
  eventName: { type: String, required: true },
  hrUser: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  companyName: { type: String, required: true },

  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  vendorName: { type: String, default: "" },

  location: {
    venueDetails: { type: String, required: true },
    streetName: { type: String, required: true },
    postalCode: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
  },

  eventType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "VendorType",
    required: true,
  },

  proposedDates: [{ type: String, required: true }],
  confirmedDate: { type: String, default: null },

  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending",
  },
  remarks: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Event", EventSchema);
