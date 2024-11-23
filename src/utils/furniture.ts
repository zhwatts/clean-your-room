/** @format */

export interface Furniture {
  id: string;
  type: string;
  width: number;
  height: number;
  emoji: string;
}

export const BEDROOM_FURNITURE: Furniture[] = [
  {
    id: "bed",
    type: "Bed",
    width: 120,
    height: 200,
    emoji: "🛏️",
  },
  {
    id: "desk",
    type: "Desk",
    width: 100,
    height: 60,
    emoji: "🪑",
  },
  {
    id: "dresser",
    type: "Dresser",
    width: 80,
    height: 40,
    emoji: "🗄️",
  },
  {
    id: "bookshelf",
    type: "Bookshelf",
    width: 80,
    height: 120,
    emoji: "📚",
  },
];
