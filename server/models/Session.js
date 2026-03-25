const mongoose = require("mongoose");

const ElementSchema = new mongoose.Schema({
  id: { type: String, required: true },
  type: { type: String, required: true }, // 'stroke', 'rect', 'circle'
  points: [Number], // for strokes
  x: Number,
  y: Number,
  width: Number,
  height: Number,
  color: String,
  size: Number,
  createdAt: { type: Date, default: Date.now },
});

const SessionSchema = new mongoose.Schema({
  roomId: { type: String, required: true, unique: true },
  elements: [ElementSchema],
  lastUpdated: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Session", SessionSchema);
