/** @format */

import { useState, useEffect, useCallback, useRef } from "react";
import { Obstacle } from "../types";

interface Position {
  x: number;
  y: number;
}

interface PlayerControls {
  position: Position;
  isSpacePressed: boolean;
  hasObstacleCollision: boolean;
  isLocked: boolean;
  resetControls: () => void;
}

const PLAYER_SPEED = 4;
const DIAGONAL_FACTOR = 0.707;
const PLAYER_SIZE = 32;

const ALLOWED_KEYS = [
  "ArrowUp",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "Space",
] as const;

type AllowedKey = (typeof ALLOWED_KEYS)[number];

function isAllowedKey(key: string): key is AllowedKey {
  return ALLOWED_KEYS.includes(key as AllowedKey);
}

function isColliding(
  rect1: { x: number; y: number; width: number; height: number },
  rect2: { x: number; y: number; width: number; height: number }
) {
  return (
    rect1.x < rect2.x + rect2.width &&
    rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.height &&
    rect1.y + rect1.height > rect2.y
  );
}

export default function usePlayerControls(
  obstacles: Obstacle[],
  initialPosition?: Position
): PlayerControls {
  const [position, setPosition] = useState<Position>(
    initialPosition || { x: 400, y: 300 }
  );
  const [isSpacePressed, setIsSpacePressed] = useState(false);
  const [hasObstacleCollision, setHasObstacleCollision] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const pressedKeys = useRef(new Set<AllowedKey>());
  const animationFrameId = useRef<number>();
  const lastUpdate = useRef<number>(0);
  const previousPosition = useRef<Position>(position);

  const resetControls = useCallback(() => {
    pressedKeys.current.clear();
    setIsSpacePressed(false);
    setIsLocked(false);
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
      animationFrameId.current = undefined;
    }
  }, []);

  const checkCollision = useCallback(
    (newX: number, newY: number): boolean => {
      const playerRect = {
        x: newX,
        y: newY,
        width: PLAYER_SIZE,
        height: PLAYER_SIZE,
      };

      return obstacles.some((obstacle) =>
        isColliding(playerRect, {
          x: obstacle.x,
          y: obstacle.y,
          width: obstacle.width,
          height: obstacle.height,
        })
      );
    },
    [obstacles]
  );

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // If it's a modifier key, just ignore it completely
    if (
      e.key === "Shift" ||
      e.key === "Control" ||
      e.key === "Alt" ||
      e.key === "Meta"
    ) {
      return;
    }

    // If any modifier is being held, ignore the key press
    if (e.shiftKey || e.ctrlKey || e.altKey || e.metaKey) {
      return;
    }

    if (isAllowedKey(e.code)) {
      e.preventDefault();
      pressedKeys.current.add(e.code);

      if (e.code === "Space") {
        setIsSpacePressed(true);
      }
    }
  }, []);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    // Only handle game keys, ignore modifier keys completely
    if (isAllowedKey(e.code)) {
      e.preventDefault();
      pressedKeys.current.delete(e.code);

      if (e.code === "Space") {
        setIsSpacePressed(false);
      }
    }
  }, []);

  useEffect(() => {
    const handleWindowBlur = () => {
      setIsLocked(false);
      resetControls();
    };

    window.addEventListener("blur", handleWindowBlur);
    return () => window.removeEventListener("blur", handleWindowBlur);
  }, [resetControls]);

  useEffect(() => {
    const handleBlur = () => resetControls();
    const handleVisibilityChange = () => {
      if (document.hidden) resetControls();
    };
    const handleFocusOut = () => resetControls();

    window.addEventListener("blur", handleBlur);
    window.addEventListener("keydown", handleKeyDown, { capture: true });
    window.addEventListener("keyup", handleKeyUp, { capture: true });
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focusout", handleFocusOut);

    lastUpdate.current = performance.now();

    const updatePosition = (timestamp: number) => {
      const deltaTime = (timestamp - lastUpdate.current) / 1000;
      lastUpdate.current = timestamp;

      setPosition((prev) => {
        let dx = 0;
        let dy = 0;

        if (pressedKeys.current.has("ArrowLeft")) dx -= 1;
        if (pressedKeys.current.has("ArrowRight")) dx += 1;
        if (pressedKeys.current.has("ArrowUp")) dy -= 1;
        if (pressedKeys.current.has("ArrowDown")) dy += 1;

        if (dx !== 0 && dy !== 0) {
          dx *= DIAGONAL_FACTOR;
          dy *= DIAGONAL_FACTOR;
        }

        const moveX = dx * PLAYER_SPEED * deltaTime * 60;
        const moveY = dy * PLAYER_SPEED * deltaTime * 60;

        const newX = Math.max(0, Math.min(prev.x + moveX, 800 - PLAYER_SIZE));
        const newY = prev.y;

        const hasHorizontalCollision = checkCollision(newX, newY);
        const canMoveX = !hasHorizontalCollision;

        const newY2 = Math.max(0, Math.min(prev.y + moveY, 600 - PLAYER_SIZE));
        const newX2 = canMoveX ? newX : prev.x;

        const hasVerticalCollision = checkCollision(newX2, newY2);
        const canMoveY = !hasVerticalCollision;

        setHasObstacleCollision(hasHorizontalCollision || hasVerticalCollision);

        const nextPosition = {
          x: canMoveX ? newX : previousPosition.current.x,
          y: canMoveY ? newY2 : previousPosition.current.y,
        };

        previousPosition.current = nextPosition;
        return nextPosition;
      });

      animationFrameId.current = requestAnimationFrame(updatePosition);
    };

    animationFrameId.current = requestAnimationFrame(updatePosition);

    return () => {
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("keydown", handleKeyDown, { capture: true });
      window.removeEventListener("keyup", handleKeyUp, { capture: true });
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focusout", handleFocusOut);
      resetControls();
    };
  }, [handleKeyDown, handleKeyUp, checkCollision, resetControls]);

  return {
    position,
    isSpacePressed,
    hasObstacleCollision,
    isLocked,
    resetControls,
  };
}
