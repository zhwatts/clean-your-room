/** @format */

import { useState } from "react";
import Modal from "../UI/Modal";
import NewPlayerForm from "./NewPlayerForm";
import "./StartScreen.css";
import GameInstructionsModal from "../UI/GameInstructionsModal";
import { usePlayers } from "../../hooks/usePlayers";
import { Player } from "../../models/Player";
import { sortPlayersByBestTime } from "../../utils/playerUtils";
import GameTitle from "./GameTitle";
import PlayerList from "./PlayerList";

interface StartScreenProps {
  onPlayerSelect: (player: Player) => void;
}

function StartScreen({ onPlayerSelect }: StartScreenProps) {
  // State Hooks
  const [showNewPlayerModal, setShowNewPlayerModal] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [showInstructions, setShowInstructions] = useState(false);

  // Custom Hooks
  const {
    players: existingPlayers,
    playerToEdit,
    setPlayerToEdit,
    addPlayer,
    updatePlayer,
  } = usePlayers();

  // Event Handlers
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

  // Use the utility function for sorting
  const sortedPlayers = sortPlayersByBestTime(existingPlayers);

  // Render Logic
  return (
    <div className="start-screen">
      <div className="main-content">
        <div className="main-content-inner">
          <GameTitle onNewGameClick={() => setShowNewPlayerModal(true)} />
        </div>
      </div>

      <div className="players-sidebar">
        <div>
          <h2 className="sidebar-header">Leader Board</h2>
          {existingPlayers.length === 0 ? (
            <div className="no-players">No existing players</div>
          ) : (
            <PlayerList
              players={sortedPlayers}
              onConfigClick={setPlayerToEdit}
              onPlayClick={handleStartGame}
            />
          )}
        </div>
        <div id="credit-footer">Fun as designed, by ZachWatts.Online 🤖</div>
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
              addPlayer(player);
              setShowNewPlayerModal(false);
              handleStartGame(player);
            }}
            onPlayerUpdated={(updatedPlayer) => {
              updatePlayer(updatedPlayer);
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
