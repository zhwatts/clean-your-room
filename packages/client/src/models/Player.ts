/** @format */

export interface Player {
  id: string;
  name: string;
  avatar?: string;
  isLocalAvatar: boolean;
  bestTime?: number;
  lastTime?: number;
  avatarId: string;
  token?: string;
}

export interface PlayerScore {
  timestamp: number;
  timeElapsed: number;
}
