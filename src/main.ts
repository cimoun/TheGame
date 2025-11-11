import Phaser from 'phaser';
import PlayScene from './scenes/PlayScene';
import MenuScene from './scenes/MenuScene';
import LevelSelectScene from './scenes/LevelSelectScene';
import LevelScene from './scenes/LevelScene';

// Basic Phaser 3 configuration
const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: 'game-container',
  input: {
    keyboard: {
      target: window,
    },
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 0 },
      debug: false,
    },
  },
  scene: [MenuScene, LevelSelectScene, LevelScene, PlayScene],
};

// Initialize the game
const game = new Phaser.Game(config);

// Expose game to window for debugging (development only)
if (typeof window !== 'undefined') {
  (window as any).game = game;
}

export default game;
