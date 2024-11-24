/** @format */

import { useState } from "react";
import Game from "./components/Game/Game";
import { Player } from "./models/Player";
import StartScreen from "./components/Menu/StartScreen";

function App() {
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);

  const handleGameEnd = () => {
    setCurrentPlayer(null);
  };

  return currentPlayer ? (
    <Game player={currentPlayer} onGameEnd={handleGameEnd} />
  ) : (
    <StartScreen onPlayerSelect={setCurrentPlayer} />
  );
}

export default App;
