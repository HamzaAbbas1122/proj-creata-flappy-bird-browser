import { Game } from './engine/Game';

// Initialize the game
const game = new Game('gameCanvas');

// Ensure canvas exists in DOM
const canvas = document.getElementById('gameCanvas');
if (!canvas) {
  const newCanvas = document.createElement('canvas');
  newCanvas.id = 'gameCanvas';
  newCanvas.width = 320;
  newCanvas.height = 480;
  newCanvas.style.position = 'relative';
  newCanvas.style.display = 'block';
  newCanvas.style.margin = '0 auto';
  newCanvas.style.backgroundColor = '#70c5ce';
  document.body.appendChild(newCanvas);
}

game.start();