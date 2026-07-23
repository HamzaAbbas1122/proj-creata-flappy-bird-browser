import { Bird } from '../entities/Bird';
import { Pipe } from '../entities/Pipe';
import { Physics } from './Physics';
import { HUD } from '../ui/HUD';
import { Overlay } from '../ui/Overlay';

export enum GameState {
  START,
  PLAYING,
  GAME_OVER
}

/**
 * Core Game Engine implementing the Finite State Machine (FSM).
 * Manages the game loop, state transitions, and entity orchestration.
 */
export class Game {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private state: GameState = GameState.START;
  
  private bird: Bird;
  private pipes: Pipe[] = [];
  private score: number = 0;
  private frameCount: number = 0;
  
  private hud: HUD;
  private overlay: Overlay;

  private readonly PIPE_SPAWN_RATE = 90; // frames
  private readonly PIPE_SPEED = 3;

  constructor(canvasId: string) {
    this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    this.ctx = this.canvas.getContext('2d')!;
    
    this.bird = new Bird(this.canvas.width, this.canvas.height);
    this.hud = new HUD();
    this.overlay = new Overlay(this);

    this.initEventListeners();
  }

  private initEventListeners(): void {
    window.addEventListener('keydown', (e) => {
      if (e.code === 'Space') this.handleInput();
    });
    this.canvas.addEventListener('pointerdown', () => this.handleInput());
  }

  private handleInput(): void {
    switch (this.state) {
      case GameState.START:
        this.transitionTo(GameState.PLAYING);
        break;
      case GameState.PLAYING:
        this.bird.jump();
        break;
      case GameState.GAME_OVER:
        this.resetGame();
        this.transitionTo(GameState.START);
        break;
    }
  }

  private transitionTo(newState: GameState): void {
    this.state = newState;
    
    if (newState === GameState.START) {
      this.overlay.showStart();
    } else if (newState === GameState.GAME_OVER) {
      this.overlay.showGameOver(this.score);
    }
  }

  private resetGame(): void {
    this.bird.reset(this.canvas.height);
    this.pipes = [];
    this.score = 0;
    this.frameCount = 0;
    this.hud.updateScore(0);
  }

  public start(): void {
    this.transitionTo(GameState.START);
    this.gameLoop();
  }

  private gameLoop(): void {
    this.update();
    this.render();
    requestAnimationFrame(() => this.gameLoop());
  }

  private update(): void {
    if (this.state !== GameState.PLAYING) return;

    this.frameCount++;

    // 1. Update Bird
    this.bird.update();

    // 2. Spawn Pipes
    if (this.frameCount % this.PIPE_SPAWN_RATE === 0) {
      this.pipes.push(new Pipe(this.canvas.width, this.canvas.height));
    }

    // 3. Update Pipes & Collision
    const birdBounds = this.bird.getBounds();
    
    for (let i = this.pipes.length - 1; i >= 0; i--) {
      const pipe = this.pipes[i];
      pipe.update(this.PIPE_SPEED);

      // Collision Detection
      const pipeBounds = pipe.getBounds();
      for (const rect of pipeBounds) {
        if (Physics.checkCollision(birdBounds, rect)) {
          this.transitionTo(GameState.GAME_OVER);
        }
      }

      // Scoring
      pipe.setPassed(this.bird.getPosition().x);
      if (pipe.isPassed()) {
        this.score++;
        this.hud.updateScore(this.score);
      }

      // Cleanup off-screen pipes
      if (pipe.getX() + pipe.getWidth() < 0) {
        this.pipes.splice(i, 1);
      }
    }

    // 4. Floor/Ceiling Collision
    const pos = this.bird.getPosition();
    if (pos.y <= 0 || pos.y + birdBounds.height >= this.canvas.height) {
      this.transitionTo(GameState.GAME_OVER);
    }
  }

  private render(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Render Pipes
    this.pipes.forEach(pipe => {
      this.ctx.fillStyle = '#2ecc71';
      // Top pipe
      this.ctx.fillRect(pipe.getX(), 0, pipe.getWidth(), pipe.getTopHeight());
      // Bottom pipe
      this.ctx.fillRect(pipe.getX(), pipe.getBottomY(), pipe.getWidth(), this.canvas.height - pipe.getBottomY());
    });

    // Render Bird
    const birdPos = this.bird.getPosition();
    const birdDim = this.bird.getDimensions();
    this.ctx.fillStyle = '#f1c40f';
    this.ctx.fillRect(birdPos.x, birdPos.y, birdDim.width, birdDim.height);
  }
}