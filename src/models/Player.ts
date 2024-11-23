/** @format */

export interface Player {
  id: string;
  name: string;
  gender: "boy" | "girl";
  bestTime?: number;
}

export interface PlayerScore {
  timestamp: number;
  timeElapsed: number;
}
