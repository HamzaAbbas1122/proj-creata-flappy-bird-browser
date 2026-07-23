/**
 * HUD handles the score display in the DOM.
 */
export class HUD {
  private scoreElement: HTMLElement | null;

  constructor() {
    this.scoreElement = document.getElementById('score');
    if (!this.scoreElement) {
      this.scoreElement = document.createElement('div');
      this.scoreElement.id = 'score';
      this.scoreElement.style.position = 'absolute';
      this.scoreElement.style.top = '20px';
      this.scoreElement.style.left = '50%';
      this.scoreElement.style.transform = 'translateX(-50%)';
      this.scoreElement.style.fontSize = '48px';
      this.scoreElement.style.color = 'white';
      this.scoreElement.style.fontFamily = 'Arial, sans-serif';
      this.scoreElement.style.zIndex = '10';
      document.body.appendChild(this.scoreElement);
    }
  }

  public updateScore(score: number): void {
    if (this.scoreElement) {
      this.scoreElement.innerText = score.toString();
    }
  }
}