/** @format */

import { Player } from "../../models/Player";

interface PlayerListProps {
  players: Player[];
  onConfigClick: (player: Player) => void;
  onPlayClick: (player: Player) => void;
}

function PlayerList({ players, onConfigClick, onPlayClick }: PlayerListProps) {
  return (
    <div className="players-list">
      {players.map((player) => {
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
                onClick={() => onConfigClick(player)}
              >
                Config
              </button>
              <button
                className="play-button"
                onClick={() => onPlayClick(player)}
              >
                Play
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default PlayerList;
