/** @format */

import { Room, Obstacle } from "../types";

export const GRID_SIZE = 32;
export const ROOM_MARGIN = GRID_SIZE * 2;

// Room templates with connecting doors
export const ROOM_TEMPLATES: Room[] = [
  {
    id: "main",
    x: GRID_SIZE * 2,
    y: GRID_SIZE * 2,
    width: GRID_SIZE * 20,
    height: GRID_SIZE * 15,
    type: "main",
    doors: [
      { wall: "east", offset: GRID_SIZE * 5, width: GRID_SIZE * 2 },
      { wall: "north", offset: GRID_SIZE * 8, width: GRID_SIZE * 2 },
    ],
  },
  {
    id: "closet",
    x: GRID_SIZE * 22,
    y: GRID_SIZE * 2,
    width: GRID_SIZE * 6,
    height: GRID_SIZE * 8,
    type: "closet",
    doors: [{ wall: "west", offset: GRID_SIZE * 3, width: GRID_SIZE * 2 }],
  },
  {
    id: "bathroom",
    x: GRID_SIZE * 2,
    y: GRID_SIZE * 17,
    width: GRID_SIZE * 8,
    height: GRID_SIZE * 6,
    type: "bathroom",
    doors: [{ wall: "south", offset: GRID_SIZE * 3, width: GRID_SIZE * 2 }],
  },
];

export function generateRoomLayout(): Room[] {
  return ROOM_TEMPLATES.map((room) => ({
    ...room,
    id: crypto.randomUUID(),
  }));
}

export function isPositionInRoom(x: number, y: number, room: Room): boolean {
  return (
    x >= room.x &&
    x <= room.x + room.width &&
    y >= room.y &&
    y <= room.y + room.height
  );
}

export function isPositionInAnyRoom(
  x: number,
  y: number,
  rooms: Room[]
): boolean {
  return rooms.some((room) => isPositionInRoom(x, y, room));
}

export function findValidToyBoxPosition(
  rooms: Room[],
  obstacles: Obstacle[],
  toyBoxWidth: number = GRID_SIZE * 3,
  toyBoxHeight: number = GRID_SIZE * 2
): { x: number; y: number } {
  const validPositions: { x: number; y: number }[] = [];

  rooms.forEach((room) => {
    for (
      let x = room.x + GRID_SIZE;
      x < room.x + room.width - toyBoxWidth - GRID_SIZE;
      x += GRID_SIZE
    ) {
      for (
        let y = room.y + GRID_SIZE;
        y < room.y + room.height - toyBoxHeight - GRID_SIZE;
        y += GRID_SIZE
      ) {
        const toyBoxRect = {
          x,
          y,
          width: toyBoxWidth,
          height: toyBoxHeight,
        };

        // Check if position collides with any obstacles
        const hasCollision = obstacles.some((obstacle) =>
          isColliding(toyBoxRect, obstacle)
        );

        if (!hasCollision) {
          validPositions.push({ x, y });
        }
      }
    }
  });

  if (validPositions.length === 0) {
    throw new Error("No valid position found for toy box");
  }

  // Return random valid position
  return validPositions[Math.floor(Math.random() * validPositions.length)];
}

function isColliding(
  rect1: { x: number; y: number; width: number; height: number },
  rect2: { x: number; y: number; width: number; height: number }
): boolean {
  return (
    rect1.x < rect2.x + rect2.width &&
    rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.height &&
    rect1.y + rect1.height > rect2.y
  );
}
