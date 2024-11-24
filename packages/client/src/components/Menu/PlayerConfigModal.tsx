/** @format */

import React, { useState } from "react";
import { Player } from "../../models/Player";
import {
  updatePlayer,
  deletePlayer,
  clearPlayerScores,
} from "../../services/PlayerService";
import AvatarUpload from "./AvatarUpload";
import "./PlayerConfigModal.css";

interface PlayerConfigModalProps {
  player: Player;
  onClose: () => void;
  onPlayerUpdated: (player: Player) => void;
  onPlayerDeleted: () => void;
}

const PlayerConfigModal: React.FC<PlayerConfigModalProps> = ({
  player,
  onClose,
  onPlayerUpdated,
  onPlayerDeleted,
}) => {
  const [avatarId, setAvatarId] = useState(player.avatarId);

  const handleAvatarChange = async (newAvatarId: string) => {
    setAvatarId(newAvatarId);
    const updatedPlayer = await updatePlayer(player.id, {
      avatarId: newAvatarId,
    });
    if (updatedPlayer) {
      onPlayerUpdated(updatedPlayer);
    }
  };

  const handleClearScores = async () => {
    const updatedPlayer = await clearPlayerScores(player.id);
    if (updatedPlayer) {
      onPlayerUpdated(updatedPlayer);
    }
  };

  const handleDeletePlayer = async () => {
    const success = await deletePlayer(player.id);
    if (success) {
      onPlayerDeleted();
    }
  };

  return (
    <div className="player-config-modal">
      <h2>Configure Player</h2>
      <AvatarUpload
        currentAvatar={avatarId}
        onAvatarChange={handleAvatarChange}
        onAvatarDelete={() => setAvatarId("")}
        onTakePhoto={() => {}}
      />
      <button onClick={handleClearScores}>Clear Scores</button>
      <button onClick={handleDeletePlayer}>Delete Player</button>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default PlayerConfigModal;
