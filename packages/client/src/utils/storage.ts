/** @format */

import { Player } from "../types";

const STORAGE_KEYS = {
  PLAYERS: "clean-your-room-players",
};

export const storage = {
  getPlayers: (): Player[] => {
    try {
      const players = localStorage.getItem(STORAGE_KEYS.PLAYERS);
      return players ? JSON.parse(players) : [];
    } catch (error) {
      console.error("Error loading players:", error);
      return [];
    }
  },

  savePlayer: (player: Player) => {
    try {
      const players = storage.getPlayers();
      const existingPlayerIndex = players.findIndex((p) => p.id === player.id);

      if (existingPlayerIndex >= 0) {
        players[existingPlayerIndex] = player;
      } else {
        players.push(player);
      }

      localStorage.setItem(STORAGE_KEYS.PLAYERS, JSON.stringify(players));
    } catch (error) {
      console.error("Error saving player:", error);
    }
  },

  saveScore: (playerId: string, time: number) => {
    try {
      const players = storage.getPlayers();
      const player = players.find((p) => p.id === playerId);

      if (player) {
        player.lastTime = time;

        if (!player.bestTime || time < player.bestTime) {
          player.bestTime = time;
        }

        storage.savePlayer(player);
      }
    } catch (error) {
      console.error("Error saving score:", error);
    }
  },

  resetPlayerScore: (playerId: string) => {
    try {
      const players = storage.getPlayers();
      const player = players.find((p) => p.id === playerId);
      if (player) {
        player.bestTime = undefined;
        player.lastTime = undefined;
        storage.savePlayer(player);
      }
    } catch (error) {
      console.error("Error resetting player score:", error);
    }
  },

  deletePlayer: (playerId: string) => {
    try {
      const players = storage.getPlayers();
      const filteredPlayers = players.filter((p) => p.id !== playerId);
      localStorage.setItem(
        STORAGE_KEYS.PLAYERS,
        JSON.stringify(filteredPlayers)
      );
    } catch (error) {
      console.error("Error deleting player:", error);
    }
  },

  deleteAllPlayers: () => {
    try {
      localStorage.setItem(STORAGE_KEYS.PLAYERS, JSON.stringify([]));
    } catch (error) {
      console.error("Error deleting all players:", error);
    }
  },
};
