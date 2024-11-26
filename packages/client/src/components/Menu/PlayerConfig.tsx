/** @format */

import { useState } from "react";
import AvatarUpload from "./AvatarUpload";
import "./PlayerConfig.css";
import { storage } from "../../utils/storage";
import { Player } from "../../types";
import Cookies from "js-cookie";

interface PlayerConfigProps {
  playerId: string;
  onClose: () => void;
}

function PlayerConfig({ playerId, onClose }: PlayerConfigProps) {
  const player = storage.getPlayers().find((p) => p.id === playerId);
  const [name, setName] = useState(player?.name || "");

  if (!player) return null;

  const handleSave = () => {
    if (!name.trim()) return;

    const updatedPlayer: Player = {
      ...player,
      name: name.trim(),
      token: player.token,
    };

    storage.savePlayer(updatedPlayer);
    onClose();
    window.location.reload();
  };

  const handleResetTime = () => {
    storage.resetPlayerScore(playerId);
    onClose();
    window.location.reload();
  };

  const handleDelete = () => {
    storage.deletePlayer(playerId);
    const playerTokens = JSON.parse(Cookies.get("playerTokens") || "[]");
    const updatedTokens = playerTokens.filter(
      (token: string) => token !== player.token
    );
    Cookies.set("playerTokens", JSON.stringify(updatedTokens));
    onClose();
    window.location.reload();
  };

  return (
    <div className="player-config">
      <h2>Configure Player</h2>

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

      <div className="config-form">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Player Name"
        />

        <div className="config-actions">
          <button onClick={handleSave} disabled={!name.trim()}>
            Save Changes
          </button>
          <button onClick={handleResetTime}>Reset Best Time</button>
          <button onClick={handleDelete} className="delete">
            Delete Player
          </button>
        </div>
      </div>
    </div>
  );
}

export default PlayerConfig;
