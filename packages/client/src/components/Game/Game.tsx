/** @format */

import { useEffect, useState, useCallback } from "react";
import { Player } from "../../models/Player";
import Room from "./Room";
import usePlayerControls from "../../hooks/usePlayerControls";
import "./Game.css";
import { generateGameState } from "../../utils/gameSetup";
import { soundManager } from "../../utils/sounds";
import { musicManager } from "../../utils/music";
import CountdownModal from "../UI/CountdownModal";
import { updatePlayerTimes } from "../../services/PlayerService";

interface GameProps {
  player: Player;
  onGameEnd: () => void;
}

const COOLDOWN_TIME = 3; // seconds

function Game({ player, onGameEnd }: GameProps) {
  const [showCountdown, setShowCountdown] = useState(true);
  const [gameActive, setGameActive] = useState(false);
  const [activeChannel, setActiveChannel] = useState<"A" | "B" | null>("A");

  const [gameState, setGameState] = useState(generateGameState());
  const [vacuum, setVacuum] = useState({
    x: 0,
    y: 0,
    direction: "right",
  });

  const [playerHit, setPlayerHit] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);

  useEffect(() => {
    try {
      musicManager.playChannelA();
    } catch (error) {
      console.warn("Failed to start music:", error);
    }
  }, []);

  const { position, isSpacePressed, hasObstacleCollision } = usePlayerControls(
    gameActive && !playerHit ? gameState.obstacles : [],
    { x: gameState.player.x, y: gameState.player.y }
  );

  useEffect(() => {
    if (gameActive && !playerHit && position) {
      setGameState((prev) => ({
        ...prev,
        player: {
          ...prev.player,
          x: position.x,
          y: position.y,
        },
      }));
    }
  }, [gameActive, playerHit, position]);

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

  useEffect(() => {
    const vacuumInterval = setInterval(() => {
      setVacuum((prev) => {
        let newX = prev.x;
        let newY = prev.y;
        let newDirection = prev.direction;

        switch (prev.direction) {
          case "right":
            newX += 4;
            if (newX + 60 > 800) {
              newX = 800 - 60;
              newY += 25;
              newDirection = "left";
            }
            break;
          case "left":
            newX -= 4;
            if (newX < 0) {
              newX = 0;
              newY += 25;
              newDirection = "right";
            }
            break;
        }

        if (newY + 60 > 600) {
          handleGameEnd(player.id, gameState.currentTime);
          return prev;
        }

        const vacuumRect = { x: newX, y: newY, width: 60, height: 60 };
        const obstacleCollision = gameState.obstacles.some((obstacle) =>
          isColliding(vacuumRect, {
            x: obstacle.x,
            y: obstacle.y,
            width: obstacle.width,
            height: obstacle.height,
          })
        );

        if (obstacleCollision) {
          newDirection = reverseDirection(prev.direction);
        }

        return { x: newX, y: newY, direction: newDirection };
      });
    }, 50);

    return () => clearInterval(vacuumInterval);
  }, [gameState.obstacles]);

  useEffect(() => {
    const vacuumRect = { x: vacuum.x, y: vacuum.y, width: 60, height: 60 };

    const playerRect = {
      x: gameState.player.x,
      y: gameState.player.y,
      width: 32,
      height: 32,
    };

    if (isColliding(playerRect, vacuumRect)) {
      if (!playerHit) {
        soundManager.play("bump");
        setPlayerHit(true);
        setCountdown(3);

        const countdownInterval = setInterval(() => {
          setCountdown((prev) => {
            if (prev === null) return null;
            if (prev <= 1) {
              clearInterval(countdownInterval);
              setPlayerHit(false);
              return null;
            }
            return prev - 1;
          });
        }, 1000);
      }
    }

    setGameState((prev) => {
      const remainingClutter = prev.clutter.filter((clutter) => {
        const clutterRect = {
          x: clutter.x,
          y: clutter.y,
          width: 24,
          height: 24,
        };
        return !isColliding(clutterRect, vacuumRect);
      });

      if (remainingClutter.length === 0) {
        handleGameEnd(player.id, prev.currentTime);
      }

      return { ...prev, clutter: remainingClutter };
    });
  }, [vacuum, gameState.player.x, gameState.player.y, playerHit]);

  const handleExit = () => {
    musicManager.stopAll();
    soundManager.play("exit");
    setTimeout(onGameEnd, 1000);
  };

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

  const avatarSrc = player.isLocalAvatar
    ? localStorage.getItem(player.avatarId) || ""
    : player.avatarId;

  function isColliding(rect1: any, rect2: any) {
    return (
      rect1.x < rect2.x + rect2.width &&
      rect1.x + rect1.width > rect2.x &&
      rect1.y < rect2.y + rect2.height &&
      rect1.y + rect1.height > rect2.y
    );
  }

  function reverseDirection(direction: string): string {
    switch (direction) {
      case "right":
        return "left";
      case "left":
        return "right";
      case "up":
        return "down";
      case "down":
        return "up";
      default:
        return direction;
    }
  }

  const handleCountdownComplete = () => {
    setShowCountdown(false);
    setGameActive(true);
    soundManager.play("start");
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
          handleGameEnd(player.id, prev.currentTime);
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

  const handleGameEnd = (playerId: string, timeElapsed: number) => {
    updatePlayerTimes(playerId, { lastTime: timeElapsed });
    musicManager.stopAll();
    soundManager.play("complete");
    setTimeout(onGameEnd, 1000);
  };

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
            vacuum={vacuum}
            playerHit={playerHit}
            countdown={countdown}
          />
        </>
      )}
    </div>
  );
}

export default Game;
