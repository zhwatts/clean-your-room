/** @format */

import { useState, useEffect } from "react";
import Game from "./components/Game/Game";
import { Player } from "./models/Player";
import StartScreen from "./components/Menu/StartScreen";
import SmallScreenWarning from "./components/UI/SmallScreenWarning";

function App() {
  // State Hooks
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 800);

  // Effect Hooks
  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 800);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Event Handlers
  const handleGameEnd = () => {
    setCurrentPlayer(null);
  };

  const handlePlayerSelect = (player: Player) => {
    setCurrentPlayer(player);
  };

  // Render Logic
  if (isSmallScreen) {
    return <SmallScreenWarning />;
  }

  return currentPlayer ? (
    <Game player={currentPlayer} onGameEnd={handleGameEnd} />
  ) : (
    <StartScreen onPlayerSelect={handlePlayerSelect} />
  );
}

export default App;
