const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["HR", "Vendor"], required: true },
  companyName: { type: String, default: null },
  vendorType: { type: [String], default: [] },
});

UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const isAlreadyHashed = /^\$2[ayb]\$/.test(this.password);
  if (isAlreadyHashed) return;

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (err) {
    throw err;
  }
});

module.exports = mongoose.model("User", UserSchema);
