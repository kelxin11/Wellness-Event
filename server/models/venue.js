const mongoose = require("mongoose");

const VenueSchema = new mongoose.Schema({
  name: { type: String, required: true },
  postalCode: { type: String, required: true },
  streetName: { type: String, required: true },
  state: { type: String, required: true },
});

module.exports = mongoose.model("Venue", VenueSchema);
