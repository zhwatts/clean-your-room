/** @format */

import { useEffect, useState, useCallback } from "react";
import { Player } from "../../models/Player";
import Room from "./Room";
import usePlayerControls from "../../hooks/usePlayerControls";
import { storage } from "../../utils/storage";
import "./Game.css";
import { generateGameState } from "../../utils/gameSetup";
import { soundManager } from "../../utils/sounds";
import { musicManager } from "../../utils/music";
import CountdownModal from "../UI/CountdownModal";
import { updatePlayer } from "../../services/PlayerService"; // Import updatePlayer

interface GameProps {
  player: Player;
  onGameEnd: () => void;
}

const COOLDOWN_TIME = 3; // seconds

function Game({ player, onGameEnd }: GameProps) {
  // Add state declarations at the top
  const [showCountdown, setShowCountdown] = useState(true);
  const [gameActive, setGameActive] = useState(false);
  const [activeChannel, setActiveChannel] = useState<"A" | "B" | null>("A");

  // Initialize game state using the utility
  const [gameState, setGameState] = useState(generateGameState());

  // Start music when component mounts
  useEffect(() => {
    try {
      musicManager.playChannelA();
    } catch (error) {
      console.warn("Failed to start music:", error);
    }
  }, []);

  // Get player controls with initial position from gameState
  const { position, isSpacePressed, hasObstacleCollision } = usePlayerControls(
    gameActive ? gameState.obstacles : [],
    { x: gameState.player.x, y: gameState.player.y }
  );

  // Update position effect - remove validation here
  useEffect(() => {
    if (gameActive && position) {
      setGameState((prev) => ({
        ...prev,
        player: {
          ...prev.player,
          x: position.x,
          y: position.y,
        },
      }));
    }
  }, [gameActive, position]);

  // Start game timer only when game is active
  useEffect(() => {
    if (!gameActive) return;

    const timer = setInterval(() => {
      setGameState((prev) => ({
        ...prev,
        currentTime: prev.currentTime + 0.1,
      }));
    }, 100);

    return () => clearInterval(timer);
  }, [gameActive]);

  // Handle dropping clutter when space is released
  useEffect(() => {
    if (!isSpacePressed && gameState.player.hasClutter) {
      soundManager.play("drop");
      setGameState((prev) => {
        const droppedClutter = prev.clutter.map((c) => {
          if (c.isPickedUp) {
            return {
              ...c,
              isPickedUp: false,
              isDropped: true,
              cooldownTime: COOLDOWN_TIME,
              x: prev.player.x,
              y: prev.player.y,
            };
          }
          return c;
        });

        return {
          ...prev,
          clutter: droppedClutter,
          player: {
            ...prev.player,
            hasClutter: false,
            currentClutter: undefined,
          },
        };
      });
    }
  }, [isSpacePressed]);

  // Handle obstacle collisions
  useEffect(() => {
    if (hasObstacleCollision) {
      soundManager.play("bump");
      if (gameState.player.hasClutter) {
        setGameState((prev) => {
          const droppedClutter = prev.clutter.map((c) => {
            if (c.isPickedUp) {
              return {
                ...c,
                isPickedUp: false,
                isDropped: true,
                cooldownTime: COOLDOWN_TIME,
                x: prev.player.x,
                y: prev.player.y,
              };
            }
            return c;
          });

          return {
            ...prev,
            clutter: droppedClutter,
            player: {
              ...prev.player,
              hasClutter: false,
              currentClutter: undefined,
            },
          };
        });
      }
    }
  }, [hasObstacleCollision]);

  const handleExit = () => {
    musicManager.stopAll();
    soundManager.play("exit");
    setTimeout(onGameEnd, 1000);
  };

  const handleClutterCollision = useCallback(
    (clutterIndex: number) => {
      if (!isSpacePressed || gameState.player.hasClutter) return;

      const clutter = gameState.clutter[clutterIndex];
      if (clutter.isDropped && clutter.cooldownTime && clutter.cooldownTime > 0)
        return;

      setGameState((prev) => {
        const newClutter = [...prev.clutter];
        newClutter[clutterIndex] = {
          ...newClutter[clutterIndex],
          isPickedUp: true,
          isDropped: false,
          cooldownTime: undefined,
        };
        return {
          ...prev,
          clutter: newClutter,
          player: {
            ...prev.player,
            hasClutter: true,
            currentClutter: newClutter[clutterIndex],
          },
        };
      });
    },
    [isSpacePressed, gameState.player.hasClutter, gameState.clutter]
  );

  const handleDepositClutter = () => {
    if (gameState.player.hasClutter) {
      setGameState((prev) => {
        const newClutter = prev.clutter.filter((c) => !c.isPickedUp);

        if (newClutter.length === 0) {
          storage.saveScore(player.id, prev.currentTime);
          musicManager.stopAll();
          soundManager.play("complete");

          // Debugging: Log the current and best times
          console.log(
            `Player: ${player.name}, Last Time: ${prev.currentTime}, Best Time: ${player.bestTime}`
          );

          // Update player scores in the backend
          console.log("PLAYER TO UPDATE", player);

          updatePlayer(player.id, {
            lastTime: prev.currentTime,
            bestTime: prev.currentTime,
            // player.bestTime === null ||
            // prev.currentTime < (player.bestTime ?? Infinity)
            //   ? prev.currentTime
            //   : player.bestTime,
          });

          setTimeout(onGameEnd, 1000);
        } else {
          soundManager.play("deposit");
        }

        return {
          ...prev,
          clutter: newClutter,
          player: {
            ...prev.player,
            hasClutter: false,
            currentClutter: undefined,
          },
        };
      });
    }
  };

  // Handle countdown completion
  const handleCountdownComplete = useCallback(() => {
    setShowCountdown(false);
    setGameActive(true);
    soundManager.play("start");
  }, []);

  // Add cooldown timer effect
  useEffect(() => {
    const cooldownTimer = setInterval(() => {
      setGameState((prev) => ({
        ...prev,
        clutter: prev.clutter.map((clutter) => {
          if (
            clutter.isDropped &&
            clutter.cooldownTime &&
            clutter.cooldownTime > 0
          ) {
            const newCooldown = clutter.cooldownTime - 0.1;
            return {
              ...clutter,
              cooldownTime: newCooldown,
              isDropped: newCooldown > 0,
            };
          }
          return clutter;
        }),
      }));
    }, 100);

    return () => clearInterval(cooldownTimer);
  }, []);

  // Determine the avatar source
  const avatarSrc = player.isLocalAvatar
    ? localStorage.getItem(player.avatarId) || ""
    : player.avatarId;

  return (
    <div className="game">
      {showCountdown && (
        <div className="countdown-overlay">
          <CountdownModal onComplete={handleCountdownComplete} />
        </div>
      )}
      {gameActive && (
        <>
          <div className="game-header">
            <span>Time: {Math.floor(gameState.currentTime)}s</span>
            <span>
              Clutter: {gameState.clutter.length}/{gameState.obstacles.length}
            </span>
            <div className="music-controls">
              <button
                className={`music-button channel ${
                  activeChannel === "A" ? "active" : ""
                }`}
                onClick={() => {
                  if (activeChannel === "A") {
                    musicManager.stopAll();
                    setActiveChannel(null);
                  } else {
                    musicManager.playChannelA();
                    setActiveChannel("A");
                  }
                }}
              >
                🎵
              </button>
              <button
                className={`music-button channel ${
                  activeChannel === "B" ? "active" : ""
                }`}
                onClick={() => {
                  if (activeChannel === "B") {
                    musicManager.stopAll();
                    setActiveChannel(null);
                  } else {
                    musicManager.playChannelB();
                    setActiveChannel("B");
                  }
                }}
              >
                🎶
              </button>
            </div>
            <span>Player: {player.name}</span>
            <button className="exit-button" onClick={handleExit}>
              Exit Game
            </button>
          </div>
          <Room
            gameState={gameState}
            avatarSrc={avatarSrc}
            onCollision={handleClutterCollision}
            onDepositClutter={handleDepositClutter}
          />
        </>
      )}
    </div>
  );
}

export default Game;
