const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET || "your_super_secret_key_123",
        { expiresIn: "1d" },
      );

      res.json({
        success: true,
        token: token,
        user: {
          id: user._id,
          username: user.username,
          role: user.role,
          companyName: user.companyName,
          vendorType: user.vendorType || [],
        },
      });
    } else {
      res.status(401).json({ success: false, message: "Invalid password" });
    }
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

// password fixer due to bcrypt (Utility for development)
// GET http://localhost:5000/api/auth/fix-passwords
router.get("/fix-passwords", async (req, res) => {
  try {
    const users = await User.find({});
    let updatedCount = 0;

    for (let user of users) {
      const isAlreadyHashed = /^\$2[ayb]\$.{50,}/.test(user.password);

      if (!isAlreadyHashed) {
        const cleanPassword = user.password.trim();
        const salt = await bcrypt.genSalt(10);
        const hashedPw = await bcrypt.hash(cleanPassword, salt);

        await User.updateOne(
          { _id: user._id },
          { $set: { password: hashedPw } },
        );
        updatedCount++;
      }
    }
    res.send(`Successfully encrypted ${updatedCount} passwords!`);
  } catch (err) {
    res.status(500).send("Error: " + err.message);
  }
});

module.exports = router;
