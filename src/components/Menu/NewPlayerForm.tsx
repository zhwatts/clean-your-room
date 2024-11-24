/** @format */

import React, { useState, useEffect } from "react";
import { Player } from "../../models/Player";
import { createPlayer, updatePlayer } from "../../services/PlayerService";
import AvatarUpload from "./AvatarUpload";
import "./NewPlayerForm.css";
import { defaultAvatars } from "../../utils/defaultAvatars";
import WebcamCapture from "../UI/WebcamCapture";

interface NewPlayerFormProps {
  existingPlayers: Player[];
  onPlayerCreated: (player: Player) => void;
  onPlayerUpdated?: (player: Player) => void;
  playerToEdit?: Player | null;
}

const NewPlayerForm: React.FC<NewPlayerFormProps> = ({
  existingPlayers,
  onPlayerCreated,
  onPlayerUpdated,
  playerToEdit,
}) => {
  const [name, setName] = useState(playerToEdit?.name || "");
  const [avatarId, setAvatarId] = useState<string | undefined>(
    playerToEdit?.avatarId
  );
  const [showExistingAvatars, setShowExistingAvatars] = useState(false);
  const [showWebcam, setShowWebcam] = useState(false);

  useEffect(() => {
    if (playerToEdit) {
      setName(playerToEdit.name);
      setAvatarId(playerToEdit.avatarId);
    }
  }, [playerToEdit]);

  const saveImageToLocalStorage = (imageSrc: string): string => {
    const imageId = `avatar-${crypto.randomUUID()}`;
    localStorage.setItem(imageId, imageSrc);
    return imageId;
  };

  const handleSubmit = async () => {
    if (!name.trim()) return;

    const isLocal = avatarId?.startsWith("avatar-") || false;

    const playerData: Player = {
      id: playerToEdit ? playerToEdit.id : crypto.randomUUID(),
      name: name.trim(),
      avatarId: avatarId || "",
      isLocalAvatar: isLocal,
      bestTime: playerToEdit?.bestTime || null,
      lastTime: playerToEdit?.lastTime || null,
    };

    if (playerToEdit) {
      const updatedPlayer = await updatePlayer(playerData.id, playerData);
      if (updatedPlayer && onPlayerUpdated) {
        onPlayerUpdated(updatedPlayer);
      }
    } else {
      const createdPlayer = await createPlayer(playerData);
      if (createdPlayer) {
        onPlayerCreated(createdPlayer);
      }
    }
  };

  const existingAvatars = existingPlayers
    .filter((p) => p.avatarId)
    .map((p) => ({ id: p.id, avatar: p.avatarId, name: p.name }));

  return (
    <div className="new-player-form">
      <h2>{playerToEdit ? "Edit Player" : "Create New Player"}</h2>

      <div className="avatar-section">
        <AvatarUpload
          currentAvatar={
            avatarId && avatarId.startsWith("avatar-")
              ? localStorage.getItem(avatarId)
              : avatarId
          }
          onAvatarChange={(imageSrc) => {
            const imageId = saveImageToLocalStorage(imageSrc);
            setAvatarId(imageId);
          }}
          onAvatarDelete={() => setAvatarId(undefined)}
          onTakePhoto={() => setShowWebcam(true)}
        />

        <div className="avatar-options-container">
          <div className="avatar-section-title">Or choose from this list:</div>
          <div className="avatar-options">
            {defaultAvatars.map((defaultAvatar) => (
              <div
                key={defaultAvatar.id}
                className={`avatar-option ${
                  avatarId === defaultAvatar.url ? "selected" : ""
                }`}
                onClick={() => setAvatarId(defaultAvatar.url)}
              >
                <img src={defaultAvatar.url} alt={defaultAvatar.id} />
              </div>
            ))}
          </div>

          <div className="avatar-section-title">
            <button
              className="use-existing-button"
              onClick={() => setShowExistingAvatars(!showExistingAvatars)}
            >
              {showExistingAvatars ? "Hide User Avatars" : "Show User Avatars"}
            </button>
          </div>

          {showExistingAvatars && (
            <div className="existing-avatars">
              {existingAvatars.map(({ id, avatar }) => (
                <div
                  key={id}
                  className={`existing-avatar ${
                    avatar === avatar ? "selected" : ""
                  }`}
                  onClick={() => setAvatarId(avatar)}
                >
                  <img src={avatar} alt="User Avatar" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <input
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <button
        className="create-button"
        onClick={handleSubmit}
        disabled={!name.trim()}
      >
        {playerToEdit ? "Update Player" : "Create Player"}
      </button>

      {showWebcam && (
        <WebcamCapture
          onCapture={(imageSrc) => {
            const imageId = saveImageToLocalStorage(imageSrc);
            setAvatarId(imageId);
            setShowWebcam(false);
          }}
          onClose={() => setShowWebcam(false)}
        />
      )}
    </div>
  );
};

export default NewPlayerForm;
