import Phaser from 'phaser';

interface Obstacle {
  top: Phaser.GameObjects.Rectangle;
  bottom: Phaser.GameObjects.Rectangle;
  passed: boolean;
}

export default class GameScene extends Phaser.Scene {
  private player!: Phaser.GameObjects.Rectangle & {
    body: Phaser.Physics.Arcade.Body;
  };
  private obstacles: Obstacle[] = [];
  private score = 0;
  private scoreText!: Phaser.GameObjects.Text;
  private gameSpeed = 200;
  private obstacleTimer = 0;
  private spawnInterval = 2000;
  private gameOver = false;
  private particles!: Phaser.GameObjects.Particles.ParticleEmitter;
  private leftZone!: Phaser.GameObjects.Zone;
  private rightZone!: Phaser.GameObjects.Zone;

  constructor() {
    super({ key: 'GameScene' });
  }

  create(): void {
    const { width, height } = this.cameras.main;

    // Background
    this.add.rectangle(0, 0, width, height, 0x0f3460).setOrigin(0);

    // Create player
    this.player = this.add.rectangle(
      width / 2,
      height - 100,
      24,
      24,
      0x00ff88
    ) as Phaser.GameObjects.Rectangle & {
      body: Phaser.Physics.Arcade.Body;
    };
    this.physics.add.existing(this.player);
    this.player.body.setCollideWorldBounds(true);
    this.player.body.setBounce(0);

    // Player trail particles
    const particleManager = this.add.particles(0, 0, 'pixel', {
      speed: { min: -50, max: 50 },
      scale: { start: 0.5, end: 0 },
      alpha: { start: 0.8, end: 0 },
      lifespan: 500,
      tint: 0x00ff88,
      blendMode: 'ADD',
    });
    this.particles = particleManager.createEmitter({
      follow: this.player,
      quantity: 2,
      frequency: 50,
    });

    // Create pixel texture for particles
    const graphics = this.make.graphics({ x: 0, y: 0, add: false });
    graphics.fillStyle(0xffffff);
    graphics.fillRect(0, 0, 4, 4);
    graphics.generateTexture('pixel', 4, 4);
    graphics.destroy();

    // Score text
    this.scoreText = this.add
      .text(width / 2, 50, '0', {
        fontSize: '48px',
        fontFamily: 'Arial, sans-serif',
        color: '#00ff88',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);
    this.scoreText.setShadow(2, 2, '#000000', 5);

    // Touch controls - split screen into left and right zones
    this.leftZone = this.add.zone(0, 0, width / 2, height).setOrigin(0, 0);
    this.leftZone.setInteractive();

    this.rightZone = this.add
      .zone(width / 2, 0, width / 2, height)
      .setOrigin(0, 0);
    this.rightZone.setInteractive();

    // Visual feedback for touch zones (subtle)
    const leftIndicator = this.add.rectangle(
      width / 4,
      height - 30,
      80,
      40,
      0xffffff,
      0.1
    );
    this.add
      .text(width / 4, height - 30, '← LEFT', {
        fontSize: '14px',
        fontFamily: 'Arial, sans-serif',
        color: '#ffffff',
        alpha: 0.3,
      })
      .setOrigin(0.5);

    const rightIndicator = this.add.rectangle(
      (width * 3) / 4,
      height - 30,
      80,
      40,
      0xffffff,
      0.1
    );
    this.add
      .text((width * 3) / 4, height - 30, 'RIGHT →', {
        fontSize: '14px',
        fontFamily: 'Arial, sans-serif',
        color: '#ffffff',
        alpha: 0.3,
      })
      .setOrigin(0.5);

    // Touch/click handlers
    this.leftZone.on('pointerdown', () => {
      if (!this.gameOver) {
        this.player.body.setVelocityX(-300);
        leftIndicator.setAlpha(0.3);
      }
    });

    this.leftZone.on('pointerup', () => {
      this.player.body.setVelocityX(0);
      leftIndicator.setAlpha(0.1);
    });

    this.rightZone.on('pointerdown', () => {
      if (!this.gameOver) {
        this.player.body.setVelocityX(300);
        rightIndicator.setAlpha(0.3);
      }
    });

    this.rightZone.on('pointerup', () => {
      this.player.body.setVelocityX(0);
      rightIndicator.setAlpha(0.1);
    });

    // Keyboard controls (for desktop testing)
    const cursors = this.input.keyboard!.createCursorKeys();
    this.input.keyboard!.on('keydown', (event: KeyboardEvent) => {
      if (this.gameOver) return;
      if (event.key === 'ArrowLeft') {
        this.player.body.setVelocityX(-300);
      } else if (event.key === 'ArrowRight') {
        this.player.body.setVelocityX(300);
      }
    });

    this.input.keyboard!.on('keyup', (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        this.player.body.setVelocityX(0);
      }
    });

    // Camera fade in
    this.cameras.main.fadeIn(300);
  }

  update(time: number, delta: number): void {
    if (this.gameOver) return;

    // Spawn obstacles
    this.obstacleTimer += delta;
    if (this.obstacleTimer >= this.spawnInterval) {
      this.spawnObstacle();
      this.obstacleTimer = 0;

      // Increase difficulty over time
      if (this.spawnInterval > 1000) {
        this.spawnInterval -= 20;
      }
      if (this.gameSpeed < 400) {
        this.gameSpeed += 5;
      }
    }

    // Move and check obstacles
    for (let i = this.obstacles.length - 1; i >= 0; i--) {
      const obstacle = this.obstacles[i];

      // Move obstacle
      obstacle.top.y += (this.gameSpeed * delta) / 1000;
      obstacle.bottom.y += (this.gameSpeed * delta) / 1000;

      // Check if passed
      if (!obstacle.passed && obstacle.top.y > this.player.y) {
        obstacle.passed = true;
        this.score += 10;
        this.scoreText.setText(this.score.toString());

        // Score feedback
        this.tweens.add({
          targets: this.scoreText,
          scaleX: 1.2,
          scaleY: 1.2,
          duration: 100,
          yoyo: true,
        });

        // Play success sound (visual feedback)
        this.createScoreParticles();
      }

      // Check collision
      if (this.checkCollision(obstacle)) {
        this.endGame();
      }

      // Remove off-screen obstacles
      if (obstacle.top.y > this.cameras.main.height + 100) {
        obstacle.top.destroy();
        obstacle.bottom.destroy();
        this.obstacles.splice(i, 1);
      }
    }
  }

  private spawnObstacle(): void {
    const { width, height } = this.cameras.main;
    const gapSize = Phaser.Math.Between(140, 200); // Gap for player to pass through
    const gapPosition = Phaser.Math.Between(80, width - 80);

    // Top spike (pointing down)
    const topHeight = Phaser.Math.Between(60, 150);
    const top = this.add.rectangle(
      gapPosition,
      -topHeight / 2,
      30,
      topHeight,
      0xff3366
    );
    this.physics.add.existing(top, true);

    // Add spike triangles for visual effect
    const topSpike = this.add.triangle(
      gapPosition,
      topHeight / 2,
      0,
      0,
      -15,
      20,
      15,
      20,
      0xff0033
    );
    topSpike.setPosition(gapPosition, -topHeight);

    // Bottom spike (pointing up)
    const bottomHeight = Phaser.Math.Between(60, 150);
    const bottom = this.add.rectangle(
      gapPosition,
      height + bottomHeight / 2,
      30,
      bottomHeight,
      0xff3366
    );
    this.physics.add.existing(bottom, true);

    const bottomSpike = this.add.triangle(
      gapPosition,
      0,
      0,
      0,
      -15,
      -20,
      15,
      -20,
      0xff0033
    );
    bottomSpike.setPosition(gapPosition, height + bottomHeight);

    this.obstacles.push({
      top,
      bottom,
      passed: false,
    });

    // Make spikes follow their rectangles
    this.tweens.add({
      targets: topSpike,
      y: `+=${height + 200}`,
      duration: ((height + 200) / this.gameSpeed) * 1000,
      onUpdate: () => {
        topSpike.y = top.y + topHeight / 2;
      },
    });

    this.tweens.add({
      targets: bottomSpike,
      y: `-=${height + 200}`,
      duration: ((height + 200) / this.gameSpeed) * 1000,
      onUpdate: () => {
        bottomSpike.y = bottom.y - bottomHeight / 2;
      },
    });
  }

  private checkCollision(obstacle: Obstacle): boolean {
    const playerBounds = this.player.getBounds();
    const topBounds = obstacle.top.getBounds();
    const bottomBounds = obstacle.bottom.getBounds();

    return (
      Phaser.Geom.Intersects.RectangleToRectangle(playerBounds, topBounds) ||
      Phaser.Geom.Intersects.RectangleToRectangle(playerBounds, bottomBounds)
    );
  }

  private createScoreParticles(): void {
    const { width } = this.cameras.main;

    // Create burst of particles at score text
    const burst = this.add.particles(width / 2, 50, 'pixel', {
      speed: { min: 50, max: 150 },
      scale: { start: 1, end: 0 },
      alpha: { start: 1, end: 0 },
      lifespan: 600,
      quantity: 10,
      tint: 0x00ff88,
      blendMode: 'ADD',
    });

    this.time.delayedCall(700, () => {
      burst.destroy();
    });
  }

  private endGame(): void {
    this.gameOver = true;

    // Stop player
    this.player.body.setVelocity(0, 0);

    // Explosion effect
    const explosion = this.add.particles(this.player.x, this.player.y, 'pixel', {
      speed: { min: 100, max: 300 },
      scale: { start: 1.5, end: 0 },
      alpha: { start: 1, end: 0 },
      lifespan: 1000,
      quantity: 30,
      tint: [0xff3366, 0xff6633, 0xffff00],
      blendMode: 'ADD',
    });

    // Flash player red
    this.tweens.add({
      targets: this.player,
      alpha: 0,
      duration: 100,
      yoyo: true,
      repeat: 3,
    });

    // Camera shake
    this.cameras.main.shake(300, 0.01);

    // Save high score
    const highScore = parseInt(
      localStorage.getItem('jumpmaster-highscore') || '0'
    );
    if (this.score > highScore) {
      localStorage.setItem('jumpmaster-highscore', this.score.toString());
    }

    // Show game over after delay
    this.time.delayedCall(1000, () => {
      explosion.destroy();
      this.scene.start('GameOverScene', { score: this.score });
    });
  }
}
