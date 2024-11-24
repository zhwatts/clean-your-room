/** @format */

const mongoose = require("mongoose");

const playerSchema = new mongoose.Schema({
  id: String,
  name: String,
  avatarId: String,
  isLocalAvatar: Boolean,
  bestTime: { type: Number, default: null },
  lastTime: { type: Number, default: null },
});

module.exports = mongoose.model("Player", playerSchema);
