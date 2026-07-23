import { Game } from '../engine/Game';

/**
 * Overlay handles the UI screens for Start and Game Over.
 */
export class Overlay {
  private container: HTMLElement;

  constructor(private game: Game) {
    this.container = document.createElement('div');
    this.container.style.position = 'absolute';
    this.container.style.top = '0';
    this.container.style.left = '0';
    this.container.style.width = '100%';
    this.container.style.height = '100%';
    this.container.style.display = 'flex';
    this.container.style.flexDirection = 'column';
    this.container.style.justifyContent = 'center';
    this.container.style.alignItems = 'center';
    this.container.style.backgroundColor = 'rgba(0,0,0,0.5)';
    this.container.style.color = 'white';
    this.container.style.fontFamily = 'Arial, sans-serif';
    this.container.style.zIndex = '20';
    document.body.appendChild(this.container);
  }

  public showStart(): void {
    this.container.style.display = 'flex';
    this.container.innerHTML = `
      <h1>FLAPPY BIRD</h1>
      <p>Press SPACE or Click to Start</p>
    `;
  }

  public showGameOver(score: number): void {
    this.container.style.display = 'flex';
    this.container.innerHTML = `
      <h1>GAME OVER</h1>
      <p>Score: ${score}</p>
      <p>Press SPACE or Click to Restart</p>
    `;
  }

  public hide(): void {
    this.container.style.display = 'none';
  }
}