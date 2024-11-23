/** @format */

import { Player, PlayerScore } from "../models/Player";

const PLAYERS_KEY = "clean-your-room-players";
const SCORES_KEY = "clean-your-room-scores";

export class StorageService {
  static getPlayers(): Player[] {
    const players = localStorage.getItem(PLAYERS_KEY);
    return players ? JSON.parse(players) : [];
  }

  static savePlayer(player: Player): void {
    const players = this.getPlayers();
    const existingPlayerIndex = players.findIndex((p) => p.id === player.id);

    if (existingPlayerIndex >= 0) {
      players[existingPlayerIndex] = player;
    } else {
      players.push(player);
    }

    localStorage.setItem(PLAYERS_KEY, JSON.stringify(players));
  }

  static getScores(playerId: string): PlayerScore[] {
    const scores = localStorage.getItem(`${SCORES_KEY}-${playerId}`);
    return scores ? JSON.parse(scores) : [];
  }

  static saveScore(playerId: string, score: PlayerScore): void {
    const scores = this.getScores(playerId);
    scores.push(score);
    localStorage.setItem(`${SCORES_KEY}-${playerId}`, JSON.stringify(scores));
  }
}
