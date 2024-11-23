/** @format */

import { useState } from "react";
import { Player } from "../../types";
import AvatarUpload from "./AvatarUpload";
import "./NewPlayerForm.css";
import { defaultAvatars } from "../../utils/defaultAvatars";
import WebcamCapture from "../UI/WebcamCapture";

interface NewPlayerFormProps {
  existingPlayers: Player[];
  onPlayerCreated: (player: Player) => void;
}

function NewPlayerForm({
  existingPlayers,
  onPlayerCreated,
}: NewPlayerFormProps) {
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState<string | undefined>();
  const [showExistingAvatars, setShowExistingAvatars] = useState(false);
  const [showWebcam, setShowWebcam] = useState(false);

  const handleCreatePlayer = () => {
    if (!name.trim()) return;

    const newPlayer: Player = {
      id: crypto.randomUUID(),
      name: name.trim(),
      avatar,
    };

    onPlayerCreated(newPlayer);
  };

  const existingAvatars = existingPlayers
    .filter((p) => p.avatar)
    .map((p) => ({ id: p.id, avatar: p.avatar!, name: p.name }));

  return (
    <div className="new-player-form">
      <h2>Create New Player</h2>

      <div className="avatar-section">
        <AvatarUpload
          currentAvatar={avatar}
          onAvatarChange={setAvatar}
          onAvatarDelete={() => setAvatar(undefined)}
          onTakePhoto={() => setShowWebcam(true)}
        />

        <div className="avatar-options-container">
          <div className="avatar-section-title">Or choose from this list:</div>
          <div className="avatar-options">
            {defaultAvatars.map((defaultAvatar) => (
              <div
                key={defaultAvatar.id}
                className={`avatar-option ${
                  avatar === defaultAvatar.url ? "selected" : ""
                }`}
                onClick={() => setAvatar(defaultAvatar.url)}
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
                  onClick={() => setAvatar(avatar)}
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
        onClick={handleCreatePlayer}
        disabled={!name.trim()}
      >
        Create Player
      </button>

      {showWebcam && (
        <WebcamCapture
          onCapture={(imageSrc) => {
            setAvatar(imageSrc);
            setShowWebcam(false);
          }}
          onClose={() => setShowWebcam(false)}
        />
      )}
    </div>
  );
}

export default NewPlayerForm;
