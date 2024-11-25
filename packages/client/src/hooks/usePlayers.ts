/** @format */

import { useState, useEffect } from "react";
import { Player } from "../models/Player";
import { fetchPlayers } from "../services/PlayerService";

export function usePlayers() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [playerToEdit, setPlayerToEdit] = useState<Player | null>(null);

  useEffect(() => {
    const loadPlayers = async () => {
      const players = await fetchPlayers();
      if (players) {
        setPlayers(players);
      }
    };

    loadPlayers();
  }, []);

  const addPlayer = (player: Player) => {
    setPlayers((prevPlayers) => [...prevPlayers, player]);
  };

  const updatePlayer = (updatedPlayer: Player) => {
    setPlayers((prevPlayers) =>
      prevPlayers.map((p) => (p.id === updatedPlayer.id ? updatedPlayer : p))
    );
  };

  const deletePlayer = (playerId: string) => {
    setPlayers((prevPlayers) => prevPlayers.filter((p) => p.id !== playerId));
  };

  return {
    players,
    playerToEdit,
    setPlayerToEdit,
    addPlayer,
    updatePlayer,
    deletePlayer,
  };
}
