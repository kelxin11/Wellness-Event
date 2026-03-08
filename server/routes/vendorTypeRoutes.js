const express = require("express");
const router = express.Router();
const VendorType = require("../models/vendorType");

router.get("/", async (req, res) => {
  try {
    const types = await VendorType.find();
    res.json(types);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
