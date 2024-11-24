/** @format */

import { useEffect, useState } from "react";
import "./GameInstructionsModal.css";

interface GameInstructionsModalProps {
  onStart: () => void;
  onClose: () => void;
}

function GameInstructionsModal({
  onStart,
  onClose,
}: GameInstructionsModalProps) {
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    onClose();
  };

  // Add keyboard event handler
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === "Space" && !isClosing) {
        e.preventDefault(); // Prevent page scroll
        setIsClosing(true);
        onStart();
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [onStart, isClosing]);

  const handleStartClick = () => {
    setIsClosing(true);
    onStart();
  };

  return (
    <div className="instructions-modal-overlay">
      <div className="instructions-modal">
        <button className="instructions-close" onClick={handleClose}>
          ×
        </button>
        <h2>How to Play</h2>

        <div className="story-section">
          <p>Oh No! Mom is on her way home, and our room is a mess!</p>
        </div>

        <div className="instructions-section">
          <p>
            Use your keyboard to walk through your room. When you approach some
            clutter, pick it up by pressing and holding space bar. Watch out for
            obstacles! If you bump something, you'll drop your clutter, and
            won't be able to pick it back up for 3 seconds. Win the game by
            depositing all the clutter into your toy box!
          </p>
        </div>

        <div className="controls-section">
          <h3>Controls</h3>

          <div className="keyboard-controls">
            <div className="arrow-keys">
              <div className="key-row">
                <div className="key up-key">↑</div>
              </div>
              <div className="key-row">
                <div className="key">←</div>
                <div className="key">↓</div>
                <div className="key">→</div>
              </div>
              <div className="key-label">Movement</div>
            </div>

            <div className="spacebar">
              <div className="key space-key">Space Bar</div>
              <div className="key-label">Hold to Pickup/Carry Clutter</div>
            </div>
          </div>
        </div>

        <button className="start-button" onClick={handleStartClick}>
          Start Game <span className="spacebar-hint">(or press Space)</span>
        </button>
      </div>
    </div>
  );
}

export default GameInstructionsModal;
