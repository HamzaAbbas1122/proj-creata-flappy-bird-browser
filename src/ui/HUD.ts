/**
 * HUD handles the score display in the DOM.
 * It creates a high-visibility overlay element that tracks the player's current score.
 */
export class HUD {
  private scoreElement: HTMLElement | null;

  constructor() {
    // Attempt to find existing score element or create a new one
    this.scoreElement = document.getElementById('score');
    
    if (!this.scoreElement) {
      this.createScoreElement();
    }
  }

  /**
   * Creates the score DOM element and applies styles for a game-like HUD appearance.
   */
  private createScoreElement(): void {
    const element = document.createElement('div');
    element.id = 'score';
    
    // Styling for the score display
    Object.assign(element.style, {
      position: 'absolute',
      top: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      fontSize: '48px',
      fontWeight: 'bold',
      color: 'white',
      fontFamily: '"Arial Black", Gadget, sans-serif',
      textShadow: '2px 2px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 0 2px 0 #000',
      zIndex: '10',
      pointerEvents: 'none',
      userSelect: 'none'
    });

    document.body.appendChild(element);
    this.scoreElement = element;
  }

  /**
   * Updates the text content of the score display.
   * @param score The current game score to display
   */
  public updateScore(score: number): void {
    if (this.scoreElement) {
      this.scoreElement.innerText = score.toString();
    }
  }
}