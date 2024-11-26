/** @format */

import axios from "axios";
import { Player } from "../models/Player";

const API_URL = import.meta.env.VITE_API_URL || "https://default-url.com";

export const createPlayer = async (
  player: Player
): Promise<Player | undefined> => {
  try {
    const response = await axios.post(`${API_URL}/players`, player);
    return response.data;
  } catch (error) {
    console.error("Error creating player:", error);
  }
};

export const updatePlayer = async (
  playerId: string,
  data: Partial<Player>
): Promise<Player | null> => {
  try {
    const response = await axios.put(`${API_URL}/players/${playerId}`, data);
    return response.data;
  } catch (error) {
    console.error("Error updating player:", error);
    return null;
  }
};

export const fetchPlayers = async (): Promise<Player[] | undefined> => {
  try {
    const response = await axios.get(`${API_URL}/players`);
    return response.data;
  } catch (error) {
    console.error("Error fetching players:", error);
  }
};

export const getPlayer = async (id: string): Promise<Player | undefined> => {
  try {
    const response = await axios.get(`${API_URL}/players/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching player:", error);
  }
};

export const clearPlayerScores = async (
  playerId: string
): Promise<Player | null> => {
  try {
    const response = await axios.put(
      `${API_URL}/players/${playerId}/clear-scores`
    );
    return response.data;
  } catch (error) {
    console.error("Error clearing player scores:", error);
    return null;
  }
};

export const deletePlayer = async (playerId: string): Promise<boolean> => {
  try {
    await axios.delete(`${API_URL}/players/${playerId}`);
    return true;
  } catch (error) {
    console.error("Error deleting player:", error);
    return false;
  }
};

export const updatePlayerTimes = async (
  playerId: string,
  times: { bestTime?: number; lastTime?: number }
) => {
  try {
    const response = await fetch(
      `${API_URL}/players/${playerId}/update-times`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(times),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to update player times");
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating player times:", error);
  }
};
