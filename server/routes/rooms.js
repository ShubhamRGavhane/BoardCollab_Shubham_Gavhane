const express = require("express");
const jwt = require("jsonwebtoken");
const Session = require("../models/Session");
const router = express.Router();

// Middleware to verify JWT
const auth = (req, res, next) => {
  const token = req.header("x-auth-token");
  if (!token)
    return res.status(401).json({ msg: "No token, authorization denied" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};

// Create a new room
router.post("/", auth, async (req, res) => {
  try {
    const roomId = Math.random().toString(36).substring(2, 10); // random 8 chars
    const session = new Session({ roomId, elements: [] });
    await session.save();
    res.json({ roomId });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// Get room data
router.get("/:roomId", auth, async (req, res) => {
  try {
    const session = await Session.findOne({ roomId: req.params.roomId });
    if (!session) return res.status(404).json({ msg: "Room not found" });
    res.json(session);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
