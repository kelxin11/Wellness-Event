const mongoose = require("mongoose");

const VendorTypeSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: String,
});

module.exports = mongoose.model("VendorType", VendorTypeSchema);
