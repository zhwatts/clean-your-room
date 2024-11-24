/** @format */

export interface Player {
  id: string;
  name: string;
  avatar?: string;
  bestTime?: number;
  lastTime?: number;
}

export interface ClutterItem {
  id: string;
  x: number;
  y: number;
  isPickedUp: boolean;
  isDropped: boolean;
  cooldownTime?: number;
  emoji: string;
}

export interface GameState {
  isPlaying: boolean;
  currentTime: number;
  clutter: ClutterItem[];
  obstacles: Obstacle[];
  player: {
    x: number;
    y: number;
    hasClutter: boolean;
    currentClutter?: ClutterItem;
  };
}

export interface Obstacle {
  id: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  emoji: string;
}

export interface Room {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type: "main" | "closet" | "bathroom";
  doors: DoorPosition[];
}

export interface DoorPosition {
  wall: "north" | "south" | "east" | "west";
  offset: number;
  width: number;
}
