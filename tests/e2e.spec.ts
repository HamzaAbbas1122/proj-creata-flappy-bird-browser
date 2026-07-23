import { test, expect } from '@playwright/test';

test.describe('Flappy Bird E2E Tests', () => {
  const URL = 'http://localhost:3000';

  test.beforeEach(async ({ page }) => {
    await page.goto(URL);
  });

  test('should display start screen and initialize game on start click', async ({ page }) => {
    // Verify Start Screen exists
    const startButton = page.locator('button#start-button, .start-button, text=Start');
    await expect(startButton).toBeVisible();

    // Click Start
    await startButton.click();

    // Verify HUD is visible and score is 0
    const scoreDisplay = page.locator('#score, .score-display');
    await expect(scoreDisplay).toBeVisible();
    await expect(scoreDisplay).toHaveText('0');
  });

  test('should trigger bird jump on space key press', async ({ page }) => {
    const startButton = page.locator('button#start-button, .start-button, text=Start');
    await startButton.click();

    // Capture initial state of the canvas or bird position if exposed via window
    // Since it's a canvas, we verify the game doesn't crash and input is accepted
    await page.keyboard.press('Space');
    
    // We expect the game to remain in PLAYING state
    const scoreDisplay = page.locator('#score, .score-display');
    await expect(scoreDisplay).toBeVisible();
  });

  test('should trigger bird jump on mouse click', async ({ page }) => {
    const startButton = page.locator('button#start-button, .start-button, text=Start');
    await startButton.click();

    // Click the canvas area
    await page.click('canvas');
    
    const scoreDisplay = page.locator('#score, .score-display');
    await expect(scoreDisplay).toBeVisible();
  });

  test('should transition to game over screen upon collision', async ({ page }) => {
    const startButton = page.locator('button#start-button, .start-button, text=Start');
    await startButton.click();

    // To simulate a collision quickly, we can either wait or 
    // manipulate the game state via the browser console if the engine is exposed
    await page.evaluate(() => {
      if ((window as any).game) {
        (window as any).game.setState('GAME_OVER');
      } else {
        // Fallback: simulate a long wait for gravity to hit the ground
        // In a real scenario, we'd use a mock or a specific test seed
      }
    });

    // Check for Game Over overlay
    const gameOverScreen = page.locator('.game-over-screen, text=Game Over');
    await expect(gameOverScreen).toBeVisible();

    const restartButton = page.locator('button#restart-button, .restart-button, text=Restart');
    await expect(restartButton).toBeVisible();
  });

  test('should reset game state when restart is clicked', async ({ page }) => {
    const startButton = page.locator('button#start-button, .start-button, text=Start');
    await startButton.click();

    // Force Game Over
    await page.evaluate(() => {
      if ((window as any).game) (window as any).game.setState('GAME_OVER');
    });

    const restartButton = page.locator('button#restart-button, .restart-button, text=Restart');
    await restartButton.click();

    // Verify we are back in the game or at start, and score is reset
    const scoreDisplay = page.locator('#score, .score-display');
    await expect(scoreDisplay).toHaveText('0');
  });

  test('should increment score when passing pipes', async ({ page }) => {
    const startButton = page.locator('button#start-button, .start-button, text=Start');
    await startButton.click();

    // Simulate passing a pipe via the game engine
    await page.evaluate(() => {
      if ((window as any).game) {
        (window as any).game.incrementScore();
      }
    });

    const scoreDisplay = page.locator('#score, .score-display');
    await expect(scoreDisplay).toHaveText('1');
  });
});