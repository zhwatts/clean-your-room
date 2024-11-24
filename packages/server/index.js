/** @format */

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
import morgan from "morgan";

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(morgan("dev"));

// MongoDB connection
const MONGODB_URI =
  "mongodb+srv://zhwatts:jxBFFW6mU23ZXFwO@clean-your-room.tf28x.mongodb.net/?retryWrites=true&w=majority&appName=clean-your-room";
mongoose.connect(MONGODB_URI);

// Define a Player model
const playerSchema = new mongoose.Schema({
  id: String,
  name: String,
  avatarId: String,
  isLocalAvatar: Boolean,
  bestTime: Number,
  lastTime: Number,
});

const Player = mongoose.model("Player", playerSchema);

// Routes
app.post("/players", async (req, res) => {
  const { id, name, avatarId } = req.body;
  const isLocalAvatar = avatarId ? avatarId.startsWith("avatar-") : false;

  const player = new Player({
    id,
    name,
    avatarId,
    isLocalAvatar,
  });

  try {
    await player.save();
    res.status(201).send(player);
  } catch (error) {
    console.error("Error saving player:", error);
    res.status(400).send(error);
  }
});

app.put("/players/:id", async (req, res) => {
  const { bestTime, lastTime, avatarId, name, isLocalAvatar } = req.body;

  try {
    const player = await Player.findOne({ id: req.params.id });

    if (player) {
      if (bestTime && player.bestTime > bestTime) {
        player.bestTime = bestTime;
      }

      if (lastTime) {
        player.lastTime = lastTime;
      }

      if (name) {
        player.name = name;
      }

      if (avatarId) {
        player.avatarId = avatarId;
      }

      if (isLocalAvatar !== undefined) {
        isLocalAvatar === false
          ? (player.isLocalAvatar = false)
          : (player.isLocalAvatar = true);
      }

      await player.save();
      res.send(player);
    } else {
      console.log(`Player not found: ${req.params.id}`);
      res.status(404).send({ message: "Player not found" });
    }
  } catch (error) {
    console.error("Error updating player:", error);
    res.status(400).send(error);
  }
});

app.get("/players", async (req, res) => {
  try {
    const players = await Player.find();
    res.send(players);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Clear player scores
app.put("/players/:id/clear-scores", async (req, res) => {
  try {
    const player = await Player.findOne({ id: req.params.id });

    if (player) {
      player.bestTime = null;
      player.lastTime = null;
      await player.save();
      res.send(player);
    } else {
      res.status(404).send({ message: "Player not found" });
    }
  } catch (error) {
    console.error("Error clearing scores:", error);
    res.status(400).send(error);
  }
});

// Delete player
app.delete("/players/:id", async (req, res) => {
  try {
    const result = await Player.deleteOne({ id: req.params.id });

    if (result.deletedCount > 0) {
      res.send({ message: "Player deleted successfully" });
    } else {
      res.status(404).send({ message: "Player not found" });
    }
  } catch (error) {
    console.error("Error deleting player:", error);
    res.status(400).send(error);
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
