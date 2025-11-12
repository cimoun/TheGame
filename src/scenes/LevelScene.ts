import Phaser from 'phaser';
import type { LevelData } from '../types/GameTypes';

// Player configuration
const playerConfig = {
  width: 32,
  height: 48,
  color: 0xff0000,
  startX: 100,
  startY: 300,
  gravity: 300,
  moveSpeed: 160,
  jumpSpeed: 330,
  coyoteTime: 120, // milliseconds
  jumpBufferTime: 120, // milliseconds
};

export default class LevelScene extends Phaser.Scene {
  private player!: Phaser.GameObjects.Rectangle & { body: Phaser.Physics.Arcade.Body };
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private escKey!: Phaser.Input.Keyboard.Key;
  private map!: Phaser.Tilemaps.Tilemap;
  private groundLayer!: Phaser.Tilemaps.TilemapLayer;

  // Level data
  private currentLevel: number = 1;
  private deaths: number = 0;

  // Improved jump mechanics
  private lastGroundTime: number = 0;
  private lastJumpPressTime: number = 0;
  private isJumping: boolean = false;

  // HUD elements
  private levelText!: Phaser.GameObjects.Text;
  private deathText!: Phaser.GameObjects.Text;

  // Pause menu
  private isPaused: boolean = false;
  private pauseContainer!: Phaser.GameObjects.Container;

  constructor() {
    super({ key: 'LevelScene' });
  }

  init(data: LevelData): void {
    this.currentLevel = data.level || 1;
    this.deaths = data.deaths || 0;
    this.lastGroundTime = 0;
    this.lastJumpPressTime = 0;
    this.isJumping = false;
    this.isPaused = false;
  }

  preload(): void {
    // Load tilemap
    this.load.tilemapTiledJSON(
      `level${this.currentLevel}`,
      `assets/maps/level${this.currentLevel}.json`
    );

    // Load tileset image
    this.load.image('tiles', 'assets/tiles.png');
  }

  create(): void {
    // Create tilemap
    this.map = this.make.tilemap({ key: `level${this.currentLevel}` });
    const tileset = this.map.addTilesetImage('tileset', 'tiles');

    if (!tileset) {
      console.error('Failed to load tileset');
      return;
    }

    // Create ground layer
    const layer = this.map.createLayer('ground', tileset, 0, 0);
    if (!layer) {
      console.error('Failed to create ground layer');
      return;
    }
    this.groundLayer = layer;

    // Set collision for all tiles (tile index 1 and above)
    this.groundLayer.setCollisionByExclusion([-1, 0]);

    // Set world bounds
    const mapWidth = this.map.widthInPixels;
    const mapHeight = this.map.heightInPixels;
    this.physics.world.setBounds(0, 0, mapWidth, mapHeight);

    // Create player
    this.player = this.add.rectangle(
      playerConfig.startX,
      playerConfig.startY,
      playerConfig.width,
      playerConfig.height,
      playerConfig.color
    ) as Phaser.GameObjects.Rectangle & { body: Phaser.Physics.Arcade.Body };

    this.physics.add.existing(this.player);
    this.player.body.setGravityY(playerConfig.gravity);
    this.player.body.setCollideWorldBounds(true);

    // Add collision between player and tiles
    this.physics.add.collider(this.player, this.groundLayer);

    // Setup camera
    this.cameras.main.setBounds(0, 0, mapWidth, mapHeight);
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);

    // Setup input
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.escKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

    // Create HUD
    this.createHUD();

    // Create pause menu (initially hidden)
    this.createPauseMenu();
  }

  createHUD(): void {
    // Level text (top-left)
    this.levelText = this.add.text(16, 16, `Level: ${this.currentLevel}`, {
      fontSize: '24px',
      color: '#ffffff',
      fontFamily: 'Arial',
      backgroundColor: '#000000',
      padding: { x: 8, y: 4 },
    });
    this.levelText.setScrollFactor(0);
    this.levelText.setDepth(100);

    // Death text (top-left, below level)
    this.deathText = this.add.text(16, 48, `Deaths: ${this.deaths}`, {
      fontSize: '24px',
      color: '#ffffff',
      fontFamily: 'Arial',
      backgroundColor: '#000000',
      padding: { x: 8, y: 4 },
    });
    this.deathText.setScrollFactor(0);
    this.deathText.setDepth(100);
  }

  createPauseMenu(): void {
    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;

    // Semi-transparent background
    const background = this.add.rectangle(
      centerX,
      centerY,
      this.cameras.main.width,
      this.cameras.main.height,
      0x000000,
      0.7
    );

    // Pause title
    const pauseTitle = this.add.text(centerX, centerY - 60, 'PAUSED', {
      fontSize: '48px',
      color: '#ffffff',
      fontFamily: 'Arial',
    });
    pauseTitle.setOrigin(0.5);

    // Resume button
    const resumeButton = this.add.text(centerX, centerY, 'RESUME', {
      fontSize: '32px',
      color: '#00ff00',
      fontFamily: 'Arial',
    });
    resumeButton.setOrigin(0.5);
    resumeButton.setInteractive({ useHandCursor: true });
    resumeButton.on('pointerover', () => {
      resumeButton.setColor('#ffffff');
    });
    resumeButton.on('pointerout', () => {
      resumeButton.setColor('#00ff00');
    });
    resumeButton.on('pointerdown', () => {
      this.togglePause();
    });

    // Restart button
    const restartButton = this.add.text(centerX, centerY + 60, 'RESTART', {
      fontSize: '32px',
      color: '#ffff00',
      fontFamily: 'Arial',
    });
    restartButton.setOrigin(0.5);
    restartButton.setInteractive({ useHandCursor: true });
    restartButton.on('pointerover', () => {
      restartButton.setColor('#ffffff');
    });
    restartButton.on('pointerout', () => {
      restartButton.setColor('#ffff00');
    });
    restartButton.on('pointerdown', () => {
      this.restartLevel();
    });

    // Create container with all pause menu elements
    this.pauseContainer = this.add.container(0, 0, [
      background,
      pauseTitle,
      resumeButton,
      restartButton,
    ]);
    this.pauseContainer.setScrollFactor(0);
    this.pauseContainer.setDepth(200);
    this.pauseContainer.setVisible(false);
  }

  togglePause(): void {
    this.isPaused = !this.isPaused;
    this.pauseContainer.setVisible(this.isPaused);

    if (this.isPaused) {
      this.physics.pause();
    } else {
      this.physics.resume();
    }
  }

  restartLevel(): void {
    this.deaths++;
    this.isPaused = false;
    this.scene.restart({ level: this.currentLevel, deaths: this.deaths });
  }

  update(time: number): void {
    if (this.isPaused) {
      return;
    }

    // Check for pause key
    if (Phaser.Input.Keyboard.JustDown(this.escKey)) {
      this.togglePause();
      return;
    }

    // Update ground time tracking
    if (this.player.body.onFloor()) {
      this.lastGroundTime = time;
      this.isJumping = false;
    }

    // Track jump button press
    if (Phaser.Input.Keyboard.JustDown(this.cursors.up)) {
      this.lastJumpPressTime = time;
    }

    // Horizontal movement
    if (this.cursors.left.isDown) {
      this.player.body.setVelocityX(-playerConfig.moveSpeed);
    } else if (this.cursors.right.isDown) {
      this.player.body.setVelocityX(playerConfig.moveSpeed);
    } else {
      this.player.body.setVelocityX(0);
    }

    // Jump with coyote time and jump buffer
    const timeSinceGround = time - this.lastGroundTime;
    const timeSinceJumpPress = time - this.lastJumpPressTime;

    const canCoyoteJump = timeSinceGround <= playerConfig.coyoteTime;
    const hasJumpBuffer = timeSinceJumpPress <= playerConfig.jumpBufferTime;

    if (hasJumpBuffer && canCoyoteJump && !this.isJumping) {
      this.player.body.setVelocityY(-playerConfig.jumpSpeed);
      this.isJumping = true;
      this.lastJumpPressTime = 0; // Clear jump buffer
    }

    // Variable jump height (release jump key early to jump lower)
    if (this.isJumping && !this.cursors.up.isDown && this.player.body.velocity.y < 0) {
      this.player.body.setVelocityY(this.player.body.velocity.y * 0.5);
    }

    // Check if player fell off the map (death)
    if (this.player.y > this.map.heightInPixels) {
      this.restartLevel();
    }

    // Check if player reached the right edge (level complete)
    if (this.player.x >= this.map.widthInPixels - 50) {
      this.completeLevel();
    }
  }

  completeLevel(): void {
    const nextLevel = this.currentLevel + 1;
    if (nextLevel <= 2) {
      // We have 2 levels
      this.scene.start('LevelScene', { level: nextLevel, deaths: this.deaths });
    } else {
      // Return to level select after completing all levels
      this.scene.start('LevelSelectScene');
    }
  }
}
