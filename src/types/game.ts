export interface ShapeColor {
  id: string;
  name: string;
  fill: string;
  border: string;
  glow: string;
  lightHighlight: string;
}

export type Matrix = number[][];

export interface Shape {
  id: string;
  matrix: Matrix;
  color: ShapeColor;
  rows: number;
  cols: number;
  blocksCount: number;
}

export interface BoardCell {
  color: ShapeColor;
  placedAt: number;
  isBomb?: boolean;
  countdown?: number;
}

export type BoardMatrix = (BoardCell | null)[][];

export type GameMode = 'classic' | 'rush' | 'zen';

export type ColorTheme = 'vibrant' | 'neon' | 'candy' | 'sunset';

export interface ScorePopup {
  id: string;
  text: string;
  x: number;
  y: number;
  color?: string;
  isCombo?: boolean;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  alpha: number;
  decay: number;
  gravity?: number;
}

export interface GameStats {
  gamesPlayed: number;
  highScore: number;
  totalScore: number;
  totalLinesCleared: number;
  highestCombo: number;
  totalBlocksPlaced: number;
}
