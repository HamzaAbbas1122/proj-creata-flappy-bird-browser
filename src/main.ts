import { Game } from './engine/Game';

// Initialize the game
const game = new Game('gameCanvas');

// Expose game instance to window for E2E testing
(window as any).game = game;

game.start();