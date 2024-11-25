/** @format */

import { useState, useEffect } from "react";
import { Player } from "../../models/Player";
import Modal from "../UI/Modal";
import NewPlayerForm from "./NewPlayerForm";
import "./StartScreen.css";
import GameInstructionsModal from "../UI/GameInstructionsModal";
import { fetchPlayers } from "../../services/PlayerService";

interface StartScreenProps {
  onPlayerSelect: (player: Player) => void;
}

function StartScreen({ onPlayerSelect }: StartScreenProps) {
  const [showNewPlayerModal, setShowNewPlayerModal] = useState(false);
  const [playerToEdit, setPlayerToEdit] = useState<Player | null>(null);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [showInstructions, setShowInstructions] = useState(false);
  const [existingPlayers, setExistingPlayers] = useState<Player[]>([]);

  useEffect(() => {
    const loadPlayers = async () => {
      const players = await fetchPlayers();
      if (players) {
        setExistingPlayers(players);
      }
    };

    loadPlayers();
  }, []);

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
        <div>
          <h2 className="sidebar-header">Leader Board</h2>
          {existingPlayers.length === 0 ? (
            <div className="no-players">No existing players</div>
          ) : (
            <div className="players-list">
              {sortedPlayers.map((player) => {
                const avatarSrc = player.isLocalAvatar
                  ? localStorage.getItem(player.avatarId) || ""
                  : player.avatarId;

                return (
                  <div key={player.id} className="player-card">
                    <div className="player-avatar">
                      {avatarSrc ? (
                        <img src={avatarSrc} alt={player.name} />
                      ) : (
                        <div className="avatar-placeholder">No Avatar</div>
                      )}
                    </div>
                    <div className="player-info">
                      <h3>{player.name}</h3>
                      <div className="player-scores">
                        {player.bestTime !== undefined && (
                          <span className="best-time">
                            Best: {Math.round(player.bestTime)}s
                          </span>
                        )}
                        {player.lastTime !== undefined && (
                          <span className="last-time">
                            Last: {Math.round(player.lastTime)}s
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="player-actions">
                      <button
                        className="config-button"
                        onClick={() => setPlayerToEdit(player)}
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
                );
              })}
            </div>
          )}
        </div>
        <div id="credit-footer">Fun as designed, by ZachWatts.Online 🤖</div>
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

      {(showNewPlayerModal || playerToEdit) && (
        <Modal
          onClose={() => {
            setShowNewPlayerModal(false);
            setPlayerToEdit(null);
          }}
        >
          <NewPlayerForm
            existingPlayers={existingPlayers}
            onPlayerCreated={(player) => {
              setExistingPlayers((prevPlayers) => [...prevPlayers, player]);
              setShowNewPlayerModal(false);
              handleStartGame(player);
            }}
            onPlayerUpdated={(updatedPlayer) => {
              setExistingPlayers((prevPlayers) =>
                prevPlayers.map((p) =>
                  p.id === updatedPlayer.id ? updatedPlayer : p
                )
              );
              setPlayerToEdit(null);
            }}
            playerToEdit={playerToEdit}
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
