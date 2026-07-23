/**
 * AssetManager handles the loading and caching of game assets (images and audio).
 * Ensures that assets are fully loaded before the game starts to prevent flickering or missing sounds.
 */
export class AssetManager {
  private static images: Map<string, HTMLImageElement> = new Map();
  private static audio: Map<string, HTMLAudioElement> = new Map();

  private static readonly ASSET_MANIFEST = {
    images: {
      bird: '/src/assets/images/bird.png',
      pipe: '/src/assets/images/pipe.png',
      background: '/src/assets/images/background.png',
    },
    audio: {
      jump: '/src/assets/audio/jump.mp3',
      score: '/src/assets/audio/score.mp3',
      hit: '/src/assets/audio/hit.mp3',
    }
  };

  /**
   * Preloads all assets defined in the manifest.
   * @returns A promise that resolves when all assets are loaded.
   */
  public static async loadAssets(): Promise<void> {
    const imagePromises = Object.entries(this.ASSET_MANIFEST.images).map(([key, src]) => {
      return new Promise<void>((resolve, reject) => {
        const img = new Image();
        img.src = src;
        img.onload = () => {
          this.images.set(key, img);
          resolve();
        };
        img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
      });
    });

    const audioPromises = Object.entries(this.ASSET_MANIFEST.audio).map(([key, src]) => {
      return new Promise<void>((resolve, reject) => {
        const audio = new Audio(src);
        audio.oncanplaythrough = () => {
          this.audio.set(key, audio);
          resolve();
        };
        audio.onerror = () => reject(new Error(`Failed to load audio: ${src}`));
      });
    });

    await Promise.all([...imagePromises, ...audioPromises]);
  }

  public static getImage(key: string): HTMLImageElement | null {
    return this.images.get(key) || null;
  }

  public static playSound(key: string): void {
    const sound = this.audio.get(key);
    if (sound) {
      sound.currentTime = 0;
      sound.play().catch(e => console.warn("Audio playback blocked by browser", e));
    }
  }
}