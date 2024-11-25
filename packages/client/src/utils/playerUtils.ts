/** @format */

import { Player } from "../models/Player";

export function sortPlayersByBestTime(players: Player[]): Player[] {
  return [...players].sort((a, b) => {
    if (!a.bestTime && !b.bestTime) return 0;
    if (!a.bestTime) return 1;
    if (!b.bestTime) return -1;
    return a.bestTime - b.bestTime;
  });
}
