import { Game } from '../engine/Game';

/**
 * Overlay handles the UI screens for Start and Game Over.
 * It uses direct DOM manipulation to create a high-visibility overlay
 * that sits on top of the game canvas.
 */
export class Overlay {
  private container: HTMLElement;

  constructor(private game: Game) {
    this.container = this.createContainer();
    document.body.appendChild(this.container);
  }

  /**
   * Creates the main overlay container with base styles.
   */
  private createContainer(): HTMLElement {
    const element = document.createElement('div');
    
    Object.assign(element.style, {
      position: 'absolute',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      display: 'none', // Hidden by default
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      color: 'white',
      fontFamily: '"Arial Black", Gadget, sans-serif',
      zIndex: '20',
      textAlign: 'center',
      pointerEvents: 'auto', // Changed to auto so buttons inside are clickable
      userSelect: 'none'
    });

    return element;
  }

  /**
   * Displays the Start screen with instructions.
   */
  public showStart(): void {
    this.container.style.display = 'flex';
    this.container.innerHTML = `
      <div class="start-screen" style="
        padding: 40px;
        border: 8px solid white;
        border-radius: 20px;
        background-color: #f1c40f;
        color: #333;
        box-shadow: 0 10px 0 #d4ac0d;
      ">
        <h1 style="font-size: 64px; margin: 0 0 20px 0; text-shadow: 2px 2px 0 white;">FLAPPY BIRD</h1>
        <p style="font-size: 24px; font-weight: bold; margin: 0 0 20px 0;">Press SPACE or Click to Start</p>
        <button id="start-button" class="start-button" style="
          padding: 15px 30px;
          font-size: 24px;
          font-weight: bold;
          cursor: pointer;
          background: white;
          border: 4px solid #333;
          border-radius: 10px;
          font-family: inherit;
        ">Start</button>
      </div>
    `;

    // Add event listener to the button
    const btn = document.getElementById('start-button');
    if (btn) {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.game.setState('PLAYING');
      });
    }
  }

  /**
   * Displays the Game Over screen with the final score.
   * @param score The final score achieved by the player.
   */
  public showGameOver(score: number): void {
    this.container.style.display = 'flex';
    this.container.innerHTML = `
      <div class="game-over-screen" style="
        padding: 40px;
        border: 8px solid white;
        border-radius: 20px;
        background-color: #e74c3c;
        color: white;
        box-shadow: 0 10px 0 #c0392b;
      ">
        <h1 style="font-size: 64px; margin: 0 0 10px 0; text-shadow: 2px 2px 0 #c0392b;">GAME OVER</h1>
        <div style="font-size: 32px; margin-bottom: 20px; font-weight: bold;">
          SCORE: ${score}
        </div>
        <p style="font-size: 20px; margin: 0 0 20px 0; opacity: 0.9;">Press SPACE or Click to Restart</p>
        <button id="restart-button" class="restart-button" style="
          padding: 15px 30px;
          font-size: 24px;
          font-weight: bold;
          cursor: pointer;
          background: white;
          border: 4px solid #333;
          border-radius: 10px;
          font-family: inherit;
          color: #333;
        ">Restart</button>
      </div>
    `;

    // Add event listener to the button
    const btn = document.getElementById('restart-button');
    if (btn) {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.game.setState('START');
      });
    }
  }

  /**
   * Hides the overlay when the game is actively playing.
   */
  public hide(): void {
    this.container.style.display = 'none';
  }
}