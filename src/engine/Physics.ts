/**
 * Physics engine handling gravity, movement, and collision detection.
 * Implements AABB (Axis-Aligned Bounding Box) collision logic.
 */

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export class Physics {
  // Constants for game feel
  private static readonly GRAVITY = 0.6;
  private static readonly JUMP_FORCE = -8;
  private static readonly TERMINAL_VELOCITY = 12;

  /**
   * Applies gravity to a velocity value and clamps it to terminal velocity.
   * @param velocity Current vertical velocity
   * @returns New vertical velocity
   */
  public static applyGravity(velocity: number): number {
    const newVelocity = velocity + this.GRAVITY;
    return Math.min(newVelocity, this.TERMINAL_VELOCITY);
  }

  /**
   * Returns the velocity resulting from a jump action.
   * @returns The jump force constant
   */
  public static getJumpVelocity(): number {
    return this.JUMP_FORCE;
  }

  /**
   * Checks for collision between two rectangular areas (AABB).
   * @param rectA First rectangle
   * @param rectB Second rectangle
   * @returns True if rectangles overlap, false otherwise
   */
  public static checkCollision(rectA: Rect, rectB: Rect): boolean {
    return (
      rectA.x < rectB.x + rectB.width &&
      rectA.x + rectA.width > rectB.x &&
      rectA.y < rectB.y + rectB.height &&
      rectA.y + rectA.height > rectB.y
    );
  }

  /**
   * Calculates the new position based on velocity and delta time.
   * @param currentPos Current position
   * @param velocity Current velocity
   * @param dt Delta time (normalized to 1 for fixed timestep)
   * @returns New position
   */
  public static updatePosition(currentPos: number, velocity: number, dt: number = 1): number {
    return currentPos + (velocity * dt);
  }
}