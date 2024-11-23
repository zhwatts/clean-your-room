/** @format */

import { useState } from "react";
import PlayerSelect from "./PlayerSelect";
import { Player } from "../../types";
import "./MainMenu.css";

interface MainMenuProps {
  onPlayerSelect: (player: Player) => void;
}

function MainMenu({ onPlayerSelect }: MainMenuProps) {
  const [isNewPlayer, setIsNewPlayer] = useState(false);

  return (
    <div className="main-menu">
      <h1>Clean Your Room!</h1>
      <div className="menu-options">
        <button onClick={() => setIsNewPlayer(true)}>New Player</button>
        <button onClick={() => setIsNewPlayer(false)}>Existing Player</button>
      </div>

      {isNewPlayer ? (
        <PlayerSelect onSelect={onPlayerSelect} isNewPlayer={true} />
      ) : (
        <PlayerSelect onSelect={onPlayerSelect} isNewPlayer={false} />
      )}
    </div>
  );
}

export default MainMenu;
