// Type definitions for game state and parameters

export interface LevelData {
  level: number;
  deaths?: number;
}

export interface GameState {
  currentLevel: number;
  totalDeaths: number;
  levelDeaths: Record<number, number>;
}

export interface PlayerConfig {
  width: number;
  height: number;
  color: number;
  x: number;
  y: number;
  gravity: number;
  moveSpeed: number;
  jumpSpeed: number;
  coyoteTime: number;
  jumpBufferTime: number;
}
