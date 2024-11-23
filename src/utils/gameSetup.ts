/** @format */

import { Obstacle, ClutterItem } from "../types";
import { BEDROOM_FURNITURE } from "./furniture";
import { getRandomToyEmoji } from "./toys";

const ROOM_WIDTH = 800;
const ROOM_HEIGHT = 600;
const GRID_SIZE = 32; // Base grid size matching player size
const MARGIN = GRID_SIZE * 2; // Two grid cells margin
const PLAYER_SIZE = GRID_SIZE; // Player size

// Grid cell states
type CellState = "empty" | "obstacle" | "margin" | "player" | "clutter";

class GameGrid {
  private grid: CellState[][];
  private cols: number;
  private rows: number;

  constructor() {
    this.cols = Math.floor(ROOM_WIDTH / GRID_SIZE);
    this.rows = Math.floor(ROOM_HEIGHT / GRID_SIZE);
    this.grid = Array(this.rows)
      .fill(null)
      .map(() => Array(this.cols).fill("empty"));
    this.markMargins();
  }

  private markMargins() {
    // Mark margins around room edges
    const marginCells = Math.floor(MARGIN / GRID_SIZE);
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        if (
          row < marginCells ||
          row >= this.rows - marginCells ||
          col < marginCells ||
          col >= this.cols - marginCells
        ) {
          this.grid[row][col] = "margin";
        }
      }
    }
  }

  private markObstacle(x: number, y: number, width: number, height: number) {
    const startCol = Math.floor(x / GRID_SIZE);
    const startRow = Math.floor(y / GRID_SIZE);
    const endCol = Math.ceil((x + width) / GRID_SIZE);
    const endRow = Math.ceil((y + height) / GRID_SIZE);

    // Mark the obstacle and its margin
    for (let row = startRow - 1; row <= endRow; row++) {
      for (let col = startCol - 1; col <= endCol; col++) {
        if (row >= 0 && row < this.rows && col >= 0 && col < this.cols) {
          if (
            row >= startRow &&
            row < endRow &&
            col >= startCol &&
            col < endCol
          ) {
            this.grid[row][col] = "obstacle";
          } else {
            // Only mark margin if cell is empty
            if (this.grid[row][col] === "empty") {
              this.grid[row][col] = "margin";
            }
          }
        }
      }
    }
  }

  private findEmptyCellsInRoom(): { row: number; col: number }[] {
    const emptyCells: { row: number; col: number }[] = [];

    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        if (this.grid[row][col] === "empty") {
          emptyCells.push({ row, col });
        }
      }
    }

    return emptyCells;
  }

  placeObstacles(): Obstacle[] {
    const obstacles: Obstacle[] = [];

    // Place each piece of furniture
    for (const furniture of BEDROOM_FURNITURE) {
      let placed = false;
      let attempts = 0;
      const maxAttempts = 100;

      while (!placed && attempts < maxAttempts) {
        // Align to grid
        const x =
          Math.floor(
            Math.random() * (this.cols - Math.ceil(furniture.width / GRID_SIZE))
          ) * GRID_SIZE;
        const y =
          Math.floor(
            Math.random() *
              (this.rows - Math.ceil(furniture.height / GRID_SIZE))
          ) * GRID_SIZE;

        // Check if area is clear
        let canPlace = true;
        const startCol = Math.floor(x / GRID_SIZE);
        const startRow = Math.floor(y / GRID_SIZE);
        const endCol = Math.ceil((x + furniture.width) / GRID_SIZE);
        const endRow = Math.ceil((y + furniture.height) / GRID_SIZE);

        for (let row = startRow - 1; row <= endRow; row++) {
          for (let col = startCol - 1; col <= endCol; col++) {
            if (row >= 0 && row < this.rows && col >= 0 && col < this.cols) {
              if (this.grid[row][col] !== "empty") {
                canPlace = false;
                break;
              }
            }
          }
          if (!canPlace) break;
        }

        if (canPlace) {
          this.markObstacle(x, y, furniture.width, furniture.height);
          obstacles.push({ ...furniture, x, y });
          placed = true;
        }

        attempts++;
      }
    }

    return obstacles;
  }

  private findRandomEmptyPosition(): { x: number; y: number } | null {
    // Create a list of all possible grid positions in the entire room
    const possiblePositions: { x: number; y: number }[] = [];

    // Consider all positions in the room
    for (
      let x = MARGIN;
      x < ROOM_WIDTH - MARGIN - PLAYER_SIZE;
      x += GRID_SIZE
    ) {
      for (
        let y = MARGIN;
        y < ROOM_HEIGHT - MARGIN - PLAYER_SIZE;
        y += GRID_SIZE
      ) {
        // Check if this position is valid
        let isValid = true;

        // Check for collisions with obstacles and their margins
        const playerRect = {
          x,
          y,
          width: PLAYER_SIZE,
          height: PLAYER_SIZE,
        };

        // Check collision with obstacles
        for (
          let row = Math.floor(y / GRID_SIZE);
          row <= Math.ceil((y + PLAYER_SIZE) / GRID_SIZE);
          row++
        ) {
          for (
            let col = Math.floor(x / GRID_SIZE);
            col <= Math.ceil((x + PLAYER_SIZE) / GRID_SIZE);
            col++
          ) {
            if (
              row < this.rows &&
              col < this.cols &&
              (this.grid[row][col] === "obstacle" ||
                this.grid[row][col] === "margin")
            ) {
              isValid = false;
              break;
            }
          }
          if (!isValid) break;
        }

        // Check if position is too close to toy box
        const toyBoxArea = {
          x: ROOM_WIDTH / 2 - 75,
          y: ROOM_HEIGHT - 100,
          width: 150,
          height: 80,
        };

        if (isColliding(playerRect, toyBoxArea)) {
          isValid = false;
        }

        if (isValid) {
          possiblePositions.push({ x, y });
        }
      }
    }

    // If no valid positions found, return null
    if (possiblePositions.length === 0) {
      return null;
    }

    // Shuffle array for true randomization
    for (let i = possiblePositions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [possiblePositions[i], possiblePositions[j]] = [
        possiblePositions[j],
        possiblePositions[i],
      ];
    }

    // Return a random position from the valid positions
    const randomIndex = Math.floor(Math.random() * possiblePositions.length);
    return possiblePositions[randomIndex];
  }

  placePlayer(): { x: number; y: number } {
    const maxAttempts = 10;
    let attempts = 0;

    while (attempts < maxAttempts) {
      const position = this.findRandomEmptyPosition();
      if (position) {
        // Mark the position as occupied
        const row = Math.floor(position.y / GRID_SIZE);
        const col = Math.floor(position.x / GRID_SIZE);
        this.grid[row][col] = "player";
        return position;
      }
      attempts++;
    }

    // If all attempts fail, use a guaranteed safe position
    console.warn("Could not find random position, using fallback");
    return { x: MARGIN + GRID_SIZE, y: MARGIN + GRID_SIZE };
  }

  placeClutter(): ClutterItem[] {
    const clutter: ClutterItem[] = [];
    const emptyCells = this.findEmptyCellsInRoom();
    const targetClutterCount = Math.min(5, emptyCells.length);

    for (let i = 0; i < targetClutterCount; i++) {
      if (emptyCells.length === 0) break;

      const randomIndex = Math.floor(Math.random() * emptyCells.length);
      const cell = emptyCells.splice(randomIndex, 1)[0];

      this.grid[cell.row][cell.col] = "clutter";

      clutter.push({
        id: crypto.randomUUID(),
        x: cell.col * GRID_SIZE,
        y: cell.row * GRID_SIZE,
        emoji: getRandomToyEmoji(),
        isPickedUp: false,
        isDropped: false,
      });
    }

    return clutter;
  }
}

export function generateGameState() {
  let attempts = 0;
  const maxAttempts = 10;

  while (attempts < maxAttempts) {
    try {
      const gameGrid = new GameGrid();

      // 1. Place obstacles first
      const obstacles = gameGrid.placeObstacles();

      // 2. Find valid player position
      const playerPosition = gameGrid.placePlayer();

      // 3. Place clutter
      const clutter = gameGrid.placeClutter();

      // If we got here, we have a valid game state
      return {
        isPlaying: false,
        currentTime: 0,
        obstacles,
        clutter,
        player: {
          x: playerPosition.x,
          y: playerPosition.y,
          hasClutter: false,
        },
      };
    } catch (error) {
      console.warn(
        `Attempt ${attempts + 1} failed to generate valid game state`
      );
      attempts++;
    }
  }

  throw new Error("Failed to generate valid game state after maximum attempts");
}

export function isColliding(
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
