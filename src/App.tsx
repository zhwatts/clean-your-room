/** @format */

import { useState, useEffect } from "react";
import StartScreen from "./components/Menu/StartScreen";
import Game from "./components/Game/Game";
import MobileWarningModal from "./components/UI/MobileWarningModal";
import { Player } from "./types";
import "./App.css";

function App() {
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if device is mobile
    const checkMobile = () => {
      const isMobileDevice =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        );
      // Also check screen width as a fallback
      const isMobileWidth = window.innerWidth <= 768;
      setIsMobile(isMobileDevice || isMobileWidth);
    };

    // Check initially
    checkMobile();

    // Check on resize
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handlePlayerSelect = (player: Player) => {
    setCurrentPlayer(player);
  };

  const handleGameEnd = () => {
    setCurrentPlayer(null);
  };

  // Show warning if on mobile
  if (isMobile) {
    return <MobileWarningModal />;
  }

  if (!currentPlayer) {
    return <StartScreen onPlayerSelect={handlePlayerSelect} />;
  }

  return <Game player={currentPlayer} onGameEnd={handleGameEnd} />;
}

export default App;
