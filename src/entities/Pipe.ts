import { Rect } from '../engine/Physics';

/**
 * Pipe entity representing the obstacles the bird must pass through.
 * Each Pipe object consists of a top and bottom pipe with a gap in between.
 */
export class Pipe {
  private readonly width: number = 52;
  private readonly gapHeight: number = 160;
  private readonly minPipeHeight: number = 50;
  
  private x: number;
  private topHeight: number;
  private bottomY: number;
  private passed: boolean = false;

  /**
   * @param x Initial horizontal position
   * @param canvasHeight Total height of the game canvas to calculate gap position
   */
  constructor(x: number, canvasHeight: number) {
    this.x = x;
    
    // Randomize the height of the top pipe
    // Ensure the gap is within the screen bounds
    const maxTopHeight = canvasHeight - this.gapHeight - this.minPipeHeight;
    this.topHeight = Math.floor(Math.random() * (maxTopHeight - this.minPipeHeight + 1)) + this.minPipeHeight;
    
    // The bottom pipe starts where the top pipe ends + the gap
    this.bottomY = this.topHeight + this.gapHeight;
  }

  /**
   * Moves the pipe to the left based on the game speed.
   * @param speed Horizontal movement speed (pixels per frame)
   * @param dt Delta time for frame-independent movement
   */
  public update(speed: number, dt: number = 1): void {
    this.x -= speed * dt;
  }

  /**
   * Marks the pipe as passed when the bird's x position exceeds the pipe's right edge.
   * @param birdX The current x position of the bird
   */
  public setPassed(birdX: number): void {
    if (!this.passed && birdX > this.x + this.width) {
      this.passed = true;
    }
  }

  /**
   * Checks if the pipe has been passed by the bird.
   * @returns True if passed, false otherwise
   */
  public isPassed(): boolean {
    return this.passed;
  }

  /**
   * Returns the bounding boxes for both the top and bottom pipes.
   * Used for collision detection in the Physics engine.
   */
  public getBounds(): Rect[] {
    return [
      {
        x: this.x,
        y: 0,
        width: this.width,
        height: this.topHeight,
      },
      {
        x: this.x,
        y: this.bottomY,
        width: this.width,
        height: 1000, // Large enough to cover the bottom of the screen
      },
    ];
  }

  /**
   * Returns the current horizontal position of the pipe.
   */
  public getX(): number {
    return this.x;
  }

  /**
   * Returns the width of the pipe.
   */
  public getWidth(): number {
    return this.width;
  }

  /**
   * Returns the height of the top pipe for rendering.
   */
  public getTopHeight(): number {
    return this.topHeight;
  }

  /**
   * Returns the Y position of the bottom pipe for rendering.
   */
  public getBottomY(): number {
    return this.bottomY;
  }
}