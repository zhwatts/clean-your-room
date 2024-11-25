/** @format */

interface GameTitleProps {
  onNewGameClick: () => void;
}

function GameTitle({ onNewGameClick }: GameTitleProps) {
  return (
    <div className="game-title">
      <h1>Clean Your Room!</h1>
      <p className="tagline">An epic adventure to be spick and span</p>
      <button className="new-game-button" onClick={onNewGameClick}>
        Start Game with New Player
      </button>
    </div>
  );
}

export default GameTitle;
