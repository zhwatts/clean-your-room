/** @format */

import { useEffect, useRef } from "react";
import { GameState } from "../../types";
import "./Room.css";

interface RoomProps {
  gameState: GameState;
  avatarSrc: string;
  onCollision: (clutterIndex: number) => void;
  onDepositClutter: () => void;
  vacuum: { x: number; y: number; direction: string };
  playerHit: boolean;
  countdown: number | null;
}

function Room({
  gameState,
  avatarSrc,
  onCollision,
  onDepositClutter,
  vacuum,
  playerHit,
  countdown,
}: RoomProps) {
  const roomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkCollisions = () => {
      const playerRect = {
        x: gameState.player.x,
        y: gameState.player.y,
        width: 32,
        height: 32,
      };

      gameState.clutter.forEach((clutter, index) => {
        if (!clutter.isPickedUp && !clutter.isDropped) {
          const clutterRect = {
            x: clutter.x,
            y: clutter.y,
            width: 24,
            height: 24,
          };

          if (isColliding(playerRect, clutterRect)) {
            onCollision(index);
          }
        }
      });

      const toyBoxRect = {
        x: roomRef.current?.clientWidth! / 2 - 50,
        y: roomRef.current?.clientHeight! - 60,
        width: 100,
        height: 40,
      };

      if (gameState.player.hasClutter && isColliding(playerRect, toyBoxRect)) {
        onDepositClutter();
      }
    };

    checkCollisions();
  }, [gameState.player.x, gameState.player.y]);

  return (
    <div ref={roomRef} className="room">
      {gameState.obstacles.map((obstacle) => (
        <div
          key={obstacle.id}
          className="obstacle"
          style={{
            left: obstacle.x,
            top: obstacle.y,
            width: obstacle.width,
            height: obstacle.height,
          }}
        >
          <span className="furniture-emoji">{obstacle.emoji}</span>
        </div>
      ))}
      {gameState.clutter.map((clutter) => {
        const clutterStyle = {
          left: clutter.isPickedUp ? gameState.player.x : clutter.x,
          top: clutter.isPickedUp ? gameState.player.y - 24 : clutter.y,
          transition: clutter.isPickedUp ? "none" : "all 0.3s ease",
        };

        return (
          <div
            key={clutter.id}
            className={`clutter ${clutter.isPickedUp ? "picked-up" : ""} ${
              clutter.isDropped ? "dropped" : ""
            }`}
            style={clutterStyle}
          >
            {clutter.emoji}
            {clutter.isDropped && clutter.cooldownTime && (
              <span className="cooldown">
                {Math.ceil(clutter.cooldownTime)}
              </span>
            )}
          </div>
        );
      })}
      <div
        className={`player ${
          gameState.player.hasClutter ? "has-clutter" : ""
        } ${playerHit ? "hit" : ""}`}
        style={{
          left: gameState.player.x,
          top: gameState.player.y,
          backgroundImage: `url(${avatarSrc})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {playerHit && countdown !== null && (
          <span className="countdown">{countdown}</span>
        )}
      </div>
      <div className="toy-box">
        <span className="toy-box-emoji">🧸</span>
      </div>
      <div
        className="vacuum"
        style={{
          left: vacuum.x,
          top: vacuum.y,
          width: 60,
          height: 60,
        }}
      />
    </div>
  );
}

function isColliding(rect1: any, rect2: any) {
  return (
    rect1.x < rect2.x + rect2.width &&
    rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.height &&
    rect1.y + rect1.height > rect2.y
  );
}

export default Room;
