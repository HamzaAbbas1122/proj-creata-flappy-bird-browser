import { Physics, Rect } from '../engine/Physics';

/**
 * Bird entity representing the player character.
 * Handles movement, jumping, and position updates using the Physics engine.
 */
export class Bird {
  private readonly width: number = 34;
  private readonly height: number = 24;
  private x: number;
  private y: number;
  private velocity: number = 0;

  constructor(canvasWidth: number, canvasHeight: number) {
    // Position bird in the center-left of the screen
    this.x = canvasWidth * 0.25;
    this.y = canvasHeight / 2;
  }

  /**
   * Triggers a jump by setting the vertical velocity to the jump force.
   */
  public jump(): void {
    this.velocity = Physics.getJumpVelocity();
  }

  /**
   * Updates the bird's physics state for the current frame.
   * @param dt Delta time for frame-independent movement
   */
  public update(dt: number = 1): void {
    // Apply gravity to velocity
    this.velocity = Physics.applyGravity(this.velocity);

    // Update vertical position based on velocity
    this.y = Physics.updatePosition(this.y, this.velocity, dt);
  }

  /**
   * Returns the bird's bounding box for collision detection.
   * Returns a new object to maintain immutability of the internal state.
   */
  public getBounds(): Rect {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
    };
  }

  /**
   * Gets the current position of the bird.
   */
  public getPosition(): { x: number; y: number } {
    return { x: this.x, y: this.y };
  }

  /**
   * Resets the bird to the starting position and velocity.
   */
  public reset(canvasHeight: number): void {
    this.y = canvasHeight / 2;
    this.velocity = 0;
  }

  /**
   * Returns the dimensions of the bird.
   */
  public getDimensions(): { width: number; height: number } {
    return { width: this.width, height: this.height };
  }
}