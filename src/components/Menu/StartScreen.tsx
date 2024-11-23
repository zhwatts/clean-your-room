/** @format */

import { useState } from "react";
import { Player } from "../../types";
import { storage } from "../../utils/storage";
import Modal from "../UI/Modal";
import NewPlayerForm from "./NewPlayerForm";
import PlayerConfig from "./PlayerConfig";
import "./StartScreen.css";
import GameInstructionsModal from "../UI/GameInstructionsModal";

interface StartScreenProps {
  onPlayerSelect: (player: Player) => void;
}

function StartScreen({ onPlayerSelect }: StartScreenProps) {
  const [showNewPlayerModal, setShowNewPlayerModal] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState<string | null>(null);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [showInstructions, setShowInstructions] = useState(false);
  const existingPlayers = storage.getPlayers();

  const handleStartGame = (player: Player) => {
    setSelectedPlayer(player);
    setShowInstructions(true);
  };

  const handleInstructionsComplete = () => {
    if (selectedPlayer) {
      onPlayerSelect(selectedPlayer);
    }
    setShowInstructions(false);
  };

  const handleCloseInstructions = () => {
    setShowInstructions(false);
  };

  const sortedPlayers = [...existingPlayers].sort((a, b) => {
    if (!a.bestTime && !b.bestTime) return 0;
    if (!a.bestTime) return 1;
    if (!b.bestTime) return -1;
    return a.bestTime - b.bestTime;
  });

  return (
    <div className="start-screen">
      <div className="players-sidebar">
        <h2 className="sidebar-header">Leader Board</h2>
        {existingPlayers.length === 0 ? (
          <div className="no-players">No existing players</div>
        ) : (
          <div className="players-list">
            {sortedPlayers.map((player) => (
              <div key={player.id} className="player-card">
                <div className="player-avatar">
                  {player.avatar ? (
                    <img src={player.avatar} alt={player.name} />
                  ) : (
                    <div className="avatar-placeholder" />
                  )}
                </div>
                <div className="player-info">
                  <h3>{player.name}</h3>

                  <div className="player-scores">
                    {player.bestTime && (
                      <span className="best-time">
                        <>Best: {Math.round(player.bestTime)}s</>
                      </span>
                    )}

                    {player.lastTime && (
                      <span className="last-time">
                        Last: {Math.round(player.lastTime)}s
                      </span>
                    )}
                  </div>
                </div>
                <div className="player-actions">
                  <button
                    className="config-button"
                    onClick={() => setShowConfigModal(player.id)}
                  >
                    Config
                  </button>
                  <button
                    className="play-button"
                    onClick={() => handleStartGame(player)}
                  >
                    Play
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="main-content">
        <div className="main-content-inner">
          <div className="game-title">
            <h1>Clean Your Room!</h1>
            <p className="tagline">An epic adventure to be spick and span</p>
            <button
              className="new-game-button"
              onClick={() => setShowNewPlayerModal(true)}
            >
              Start Game with New Player
            </button>
          </div>
        </div>
      </div>

      {showNewPlayerModal && (
        <Modal onClose={() => setShowNewPlayerModal(false)}>
          <NewPlayerForm
            existingPlayers={existingPlayers}
            onPlayerCreated={(player) => {
              storage.savePlayer(player);
              setShowNewPlayerModal(false);
              handleStartGame(player);
            }}
          />
        </Modal>
      )}

      {showConfigModal && (
        <Modal onClose={() => setShowConfigModal(null)}>
          <PlayerConfig
            playerId={showConfigModal}
            onClose={() => setShowConfigModal(null)}
          />
        </Modal>
      )}

      {showInstructions && (
        <GameInstructionsModal
          onStart={handleInstructionsComplete}
          onClose={handleCloseInstructions}
        />
      )}
    </div>
  );
}

export default StartScreen;
