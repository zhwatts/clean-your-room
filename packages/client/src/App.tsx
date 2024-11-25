/** @format */

import { useState } from "react";
import Game from "./components/Game/Game";
import { Player } from "./models/Player";
import StartScreen from "./components/Menu/StartScreen";
import SmallScreenWarning from "./components/UI/SmallScreenWarning";

function App() {
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);

  const handleGameEnd = () => {
    setCurrentPlayer(null);
  };

  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 800);

  useState(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 800);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  });

  if (isSmallScreen) {
    return <SmallScreenWarning />;
  }

  return currentPlayer ? (
    <Game player={currentPlayer} onGameEnd={handleGameEnd} />
  ) : (
    <StartScreen onPlayerSelect={setCurrentPlayer} />
  );
}

export default App;
