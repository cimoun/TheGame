import Phaser from 'phaser';
// Game configuration constants
const gameConfig = {
  // Game dimensions
  game: {
    width: 800,
    height: 600,
  },
  // Player settings
  player: {
    width: 32,
    height: 48,
    color: 0xff0000,
    x: 400,
    y: 300,
    gravity: 300,
    moveSpeed: 160,
    jumpSpeed: 330,
    wallJumpSpeed: 250,
    wallJumpHorizontal: 200,
  },
  // Platform settings
  platform: {
    x: 400,
    y: 580,
    width: 800,
    height: 40,
    color: 0x00ff00,
  },
  // Wall settings
  walls: {
    left: {
      x: 50,
      y: 300,
      width: 20,
      height: 600,
      color: 0xffffff,
    },
    right: {
      x: 750,
      y: 300,
      width: 20,
      height: 600,
      color: 0xffffff,
    },
  },
};
export default class PlayScene extends Phaser.Scene {
  player;
  platform;
  leftWall;
  rightWall;
  cursors;
  constructor() {
    super({ key: 'PlayScene' });
  }
  preload() {
    // Nothing to preload
  }
  create() {
    // 1. Create static platform (rectangle) at bottom of screen
    this.platform = this.add.rectangle(
      gameConfig.platform.x,
      gameConfig.platform.y,
      gameConfig.platform.width,
      gameConfig.platform.height,
      gameConfig.platform.color
    );
    this.physics.add.existing(this.platform, true); // true = static body
    // Create left wall (white)
    this.leftWall = this.add.rectangle(
      gameConfig.walls.left.x,
      gameConfig.walls.left.y,
      gameConfig.walls.left.width,
      gameConfig.walls.left.height,
      gameConfig.walls.left.color
    );
    this.physics.add.existing(this.leftWall, true);
    // Create right wall (white)
    this.rightWall = this.add.rectangle(
      gameConfig.walls.right.x,
      gameConfig.walls.right.y,
      gameConfig.walls.right.width,
      gameConfig.walls.right.height,
      gameConfig.walls.right.color
    );
    this.physics.add.existing(this.rightWall, true);
    // 2. Create player (rectangle) in center of screen
    this.player = this.add.rectangle(
      gameConfig.player.x,
      gameConfig.player.y,
      gameConfig.player.width,
      gameConfig.player.height,
      gameConfig.player.color
    );
    // 3. Enable arcade physics for player
    this.physics.add.existing(this.player);
    // 4. Set gravity for player
    this.player.body.setGravityY(gameConfig.player.gravity);
    // 5. Make player collide with platform
    this.physics.add.collider(this.player, this.platform);
    // Add colliders for walls
    this.physics.add.collider(this.player, this.leftWall);
    this.physics.add.collider(this.player, this.rightWall);
    // 6. Create cursor controls with keyboard
    this.cursors = this.input.keyboard.createCursorKeys();
  }
  update() {
    // 1. If left arrow is pressed, set player velocity.x
    if (this.cursors.left.isDown) {
      this.player.body.setVelocityX(-gameConfig.player.moveSpeed);
    }
    // 2. If right arrow is pressed, set player velocity.x
    else if (this.cursors.right.isDown) {
      this.player.body.setVelocityX(gameConfig.player.moveSpeed);
    }
    // 3. If neither left nor right is pressed, set player velocity.x to 0
    else {
      this.player.body.setVelocityX(0);
    }
    // 4. If up arrow is pressed AND player is 'touching.down' (on ground), set player velocity.y
    if (this.cursors.up.isDown && this.player.body.touching.down) {
      this.player.body.setVelocityY(-gameConfig.player.jumpSpeed);
    }
    // Jump from left wall
    else if (this.cursors.up.isDown && this.player.body.touching.left) {
      this.player.body.setVelocityY(-gameConfig.player.wallJumpSpeed);
      this.player.body.setVelocityX(gameConfig.player.wallJumpHorizontal);
    }
    // Jump from right wall
    else if (this.cursors.up.isDown && this.player.body.touching.right) {
      this.player.body.setVelocityY(-gameConfig.player.wallJumpSpeed);
      this.player.body.setVelocityX(-gameConfig.player.wallJumpHorizontal);
    }
  }
}
