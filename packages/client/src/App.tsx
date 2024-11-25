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

  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 800);

  // Update isSmallScreen state when window is resized
  useState(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 800);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  });

  if (isSmallScreen) {
    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.9)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999,
          padding: "20px",
        }}
      >
        <div
          style={{
            backgroundColor: "white",
            padding: "30px",
            borderRadius: "10px",
            textAlign: "center",
            maxWidth: "90%",
          }}
        >
          <h2 style={{ marginBottom: "20px" }}>Screen Size Too Small</h2>
          <p>
            Sorry, this game requires a larger screen to play properly. Please
            access the game from a device with a screen width of at least 800px.
          </p>
          <p style={{ marginTop: "15px" }}>
            Current screen width: {window.innerWidth}px
          </p>
        </div>
      </div>
    );
  }

  return currentPlayer ? (
    <Game player={currentPlayer} onGameEnd={handleGameEnd} />
  ) : (
    <StartScreen onPlayerSelect={setCurrentPlayer} />
  );
}

export default App;
