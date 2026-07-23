import { Bird } from '../entities/Bird';
import { Pipe } from '../entities/Pipe';
import { Physics } from './Physics';
import { HUD } from '../ui/HUD';
import { Overlay } from '../ui/Overlay';
import { AssetManager } from '../assets/AssetManager';

export enum GameState {
  LOADING,
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
  private state: GameState = GameState.LOADING;
  
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
      if (e.code === 'Space') {
        e.preventDefault();
        this.handleInput();
      }
    });
    this.canvas.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      this.handleInput();
    });
  }

  private handleInput(): void {
    switch (this.state) {
      case GameState.START:
        this.transitionTo(GameState.PLAYING);
        break;
      case GameState.PLAYING:
        this.bird.jump();
        AssetManager.playSound('jump');
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
    } else if (newState === GameState.PLAYING) {
      this.overlay.hide();
    } else if (newState === GameState.GAME_OVER) {
      AssetManager.playSound('hit');
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

  public async start(): Promise<void> {
    try {
      await AssetManager.loadAssets();
      this.transitionTo(GameState.START);
      this.gameLoop();
    } catch (error) {
      console.error("Failed to load assets, falling back to primitive rendering", error);
      this.transitionTo(GameState.START);
      this.gameLoop();
    }
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
        AssetManager.playSound('score');
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
    // Clear background
    const bgImg = AssetManager.getImage('background');
    if (bgImg) {
      this.ctx.drawImage(bgImg, 0, 0, this.canvas.width, this.canvas.height);
    } else {
      this.ctx.fillStyle = '#70c5ce';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    // Render Pipes
    const pipeImg = AssetManager.getImage('pipe');
    this.pipes.forEach(pipe => {
      if (pipeImg) {
        // Top pipe (flipped)
        this.ctx.save();
        this.ctx.translate(pipe.getX(), pipe.getTopHeight());
        this.ctx.scale(1, -1);
        this.ctx.drawImage(pipeImg, 0, 0, pipe.getWidth(), pipe.getTopHeight());
        this.ctx.restore();
        
        // Bottom pipe
        this.ctx.drawImage(pipeImg, pipe.getX(), pipe.getBottomY(), pipe.getWidth(), this.canvas.height - pipe.getBottomY());
      } else {
        this.ctx.fillStyle = '#2ecc71';
        this.ctx.fillRect(pipe.getX(), 0, pipe.getWidth(), pipe.getTopHeight());
        this.ctx.fillRect(pipe.getX(), pipe.getBottomY(), pipe.getWidth(), this.canvas.height - pipe.getBottomY());
        
        this.ctx.fillStyle = '#27ae60';
        this.ctx.fillRect(pipe.getX() - 2, pipe.getTopHeight() - 20, pipe.getWidth() + 4, 20);
        this.ctx.fillRect(pipe.getX() - 2, pipe.getBottomY(), pipe.getWidth() + 4, 20);
      }
    });

    // Render Bird
    const birdPos = this.bird.getPosition();
    const birdDim = this.bird.getDimensions();
    const birdImg = AssetManager.getImage('bird');
    
    if (birdImg) {
      this.ctx.drawImage(birdImg, birdPos.x, birdPos.y, birdDim.width, birdDim.height);
    } else {
      this.ctx.fillStyle = '#f1c40f';
      this.ctx.fillRect(birdPos.x, birdPos.y, birdDim.width, birdDim.height);
      
      this.ctx.fillStyle = 'white';
      this.ctx.fillRect(birdPos.x + 20, birdPos.y + 5, 5, 5);
      this.ctx.fillStyle = 'black';
      this.ctx.fillRect(birdPos.x + 22, birdPos.y + 6, 2, 2);
    }
  }
}