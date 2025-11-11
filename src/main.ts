import Phaser from 'phaser';
import PlayScene from './scenes/PlayScene';

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
  scene: [PlayScene],
};

// Initialize the game
const game = new Phaser.Game(config);

export default game;
