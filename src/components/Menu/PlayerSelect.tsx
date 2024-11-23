/** @format */

import { useState } from "react";
import { Player } from "../../types";
import AvatarUpload from "./AvatarUpload";
import "./PlayerSelect.css";
import { storage } from "../../utils/storage";

export interface PlayerSelectProps {
  onSelect: (player: Player) => void;
  isNewPlayer: boolean;
}

function PlayerSelect({ onSelect, isNewPlayer }: PlayerSelectProps) {
  const [name, setName] = useState("");
  const [gender, setGender] = useState<"boy" | "girl">("boy");
  const [newPlayerAvatar, setNewPlayerAvatar] = useState<string | undefined>(
    undefined
  );
  const existingPlayers = storage.getPlayers();

  const handleCreatePlayer = () => {
    if (!name.trim()) return;

    const newPlayer: Player = {
      id: crypto.randomUUID(),
      name: name.trim(),
      avatar: newPlayerAvatar,
    };

    storage.savePlayer(newPlayer);
    onSelect(newPlayer);
  };

  const handleSelectPlayer = (player: Player) => {
    onSelect(player);
  };

  const handleResetBestTime = (playerId: string) => {
    storage.resetPlayerScore(playerId);
    // Force re-render
    window.location.reload();
  };

  const handleResetAllBestTimes = () => {
    const players = storage.getPlayers();
    players.forEach((player) => {
      storage.resetPlayerScore(player.id);
    });
    // Force re-render
    window.location.reload();
  };

  const handleDeletePlayer = (playerId: string) => {
    storage.deletePlayer(playerId);
    // Force re-render
    window.location.reload();
  };

  const handleDeleteAllPlayers = () => {
    storage.deleteAllPlayers();
    // Force re-render
    window.location.reload();
  };

  if (isNewPlayer) {
    return (
      <div className="player-select">
        <h2>Create New Player</h2>
        <AvatarUpload
          currentAvatar={newPlayerAvatar}
          onAvatarChange={setNewPlayerAvatar}
          onAvatarDelete={() => setNewPlayerAvatar(undefined)}
          onTakePhoto={() => {}}
        />
        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <div className="gender-select">
          <button
            className={gender === "boy" ? "active" : ""}
            onClick={() => setGender("boy")}
          >
            Boy
          </button>
          <button
            className={gender === "girl" ? "active" : ""}
            onClick={() => setGender("girl")}
          >
            Girl
          </button>
        </div>
        <button onClick={handleCreatePlayer} disabled={!name.trim()}>
          Create Player
        </button>
      </div>
    );
  }

  return (
    <div className="player-select">
      <h2>Select Existing Player</h2>
      {existingPlayers.length === 0 ? (
        <p>No existing players. Create a new player first!</p>
      ) : (
        <>
          <div className="players-list">
            {existingPlayers.map((player) => (
              <div key={player.id} className="player-item-container">
                <div className="player-info">
                  {player.avatar && (
                    <img
                      src={player.avatar}
                      alt="Avatar"
                      className="player-avatar"
                    />
                  )}
                  <button
                    onClick={() => handleSelectPlayer(player)}
                    className="player-item"
                  >
                    {player.name}
                    {player.bestTime &&
                      ` - Best: ${Math.round(player.bestTime)}s`}
                  </button>
                </div>
                <div className="player-actions">
                  <AvatarUpload
                    currentAvatar={player.avatar}
                    onAvatarChange={(avatarBase64) => {
                      const updatedPlayer = { ...player, avatar: avatarBase64 };
                      storage.savePlayer(updatedPlayer);
                      window.location.reload();
                    }}
                    onAvatarDelete={() => {
                      const updatedPlayer = { ...player };
                      delete updatedPlayer.avatar;
                      storage.savePlayer(updatedPlayer);
                      window.location.reload();
                    }}
                    onTakePhoto={() => {}}
                  />
                  <button
                    onClick={() => handleResetBestTime(player.id)}
                    className="action-button"
                  >
                    Reset Time
                  </button>
                  <button
                    onClick={() => handleDeletePlayer(player.id)}
                    className="action-button delete"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="global-actions">
            <button onClick={handleResetAllBestTimes}>Reset All Times</button>
            <button onClick={handleDeleteAllPlayers} className="delete">
              Delete All Players
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default PlayerSelect;
