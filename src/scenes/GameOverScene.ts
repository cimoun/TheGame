import Phaser from 'phaser';

export default class GameOverScene extends Phaser.Scene {
  private score = 0;

  constructor() {
    super({ key: 'GameOverScene' });
  }

  init(data: { score: number }): void {
    this.score = data.score;
  }

  create(): void {
    const { width, height } = this.cameras.main;

    // Background
    this.add.rectangle(0, 0, width, height, 0x1a1a2e).setOrigin(0);

    // Game Over text
    const gameOverText = this.add
      .text(width / 2, height / 3 - 40, 'GAME OVER', {
        fontSize: '56px',
        fontFamily: 'Arial, sans-serif',
        color: '#ff3366',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);
    gameOverText.setShadow(0, 0, '#ff3366', 15, false, true);

    // Score
    this.add
      .text(width / 2, height / 3 + 30, `Score: ${this.score}`, {
        fontSize: '36px',
        fontFamily: 'Arial, sans-serif',
        color: '#00ff88',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);

    // High score
    const highScore = localStorage.getItem('jumpmaster-highscore') || '0';
    const isNewHighScore = this.score >= parseInt(highScore);

    if (isNewHighScore && this.score > 0) {
      const newHighScoreText = this.add
        .text(width / 2, height / 3 + 75, '🏆 NEW HIGH SCORE! 🏆', {
          fontSize: '24px',
          fontFamily: 'Arial, sans-serif',
          color: '#ffcc00',
          fontStyle: 'bold',
        })
        .setOrigin(0.5);

      // Pulsing animation
      this.tweens.add({
        targets: newHighScoreText,
        scaleX: 1.1,
        scaleY: 1.1,
        duration: 500,
        yoyo: true,
        repeat: -1,
      });
    } else {
      this.add
        .text(width / 2, height / 3 + 75, `High Score: ${highScore}`, {
          fontSize: '24px',
          fontFamily: 'Arial, sans-serif',
          color: '#aaaaaa',
        })
        .setOrigin(0.5);
    }

    // Restart button
    const restartButton = this.add
      .rectangle(width / 2, height / 2 + 60, 200, 60, 0x00ff88)
      .setInteractive({ useHandCursor: true });

    const restartText = this.add
      .text(width / 2, height / 2 + 60, 'PLAY AGAIN', {
        fontSize: '28px',
        fontFamily: 'Arial, sans-serif',
        color: '#1a1a2e',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);

    // Button hover effect
    restartButton.on('pointerover', () => {
      restartButton.setFillStyle(0x00cc66);
      restartButton.setScale(1.05);
    });

    restartButton.on('pointerout', () => {
      restartButton.setFillStyle(0x00ff88);
      restartButton.setScale(1);
    });

    restartButton.on('pointerdown', () => {
      restartButton.setScale(0.95);
    });

    restartButton.on('pointerup', () => {
      restartButton.setScale(1);
      this.cameras.main.fade(200, 0, 0, 0);
      this.time.delayedCall(200, () => {
        this.scene.start('GameScene');
      });
    });

    // Menu button
    const menuButton = this.add
      .rectangle(width / 2, height / 2 + 140, 200, 60, 0x4a4a6a)
      .setInteractive({ useHandCursor: true });

    const menuText = this.add
      .text(width / 2, height / 2 + 140, 'MENU', {
        fontSize: '28px',
        fontFamily: 'Arial, sans-serif',
        color: '#ffffff',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);

    menuButton.on('pointerover', () => {
      menuButton.setFillStyle(0x5a5a7a);
      menuButton.setScale(1.05);
    });

    menuButton.on('pointerout', () => {
      menuButton.setFillStyle(0x4a4a6a);
      menuButton.setScale(1);
    });

    menuButton.on('pointerdown', () => {
      menuButton.setScale(0.95);
    });

    menuButton.on('pointerup', () => {
      menuButton.setScale(1);
      this.cameras.main.fade(200, 0, 0, 0);
      this.time.delayedCall(200, () => {
        this.scene.start('MenuScene');
      });
    });

    // Animated particles
    this.createBackgroundParticles();

    // Pulse animation for game over text
    this.tweens.add({
      targets: gameOverText,
      scaleX: 1.05,
      scaleY: 1.05,
      duration: 800,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    // Camera fade in
    this.cameras.main.fadeIn(300);
  }

  private createBackgroundParticles(): void {
    const { width, height } = this.cameras.main;

    for (let i = 0; i < 15; i++) {
      const x = Phaser.Math.Between(0, width);
      const y = Phaser.Math.Between(0, height);
      const size = Phaser.Math.Between(2, 5);
      const particle = this.add.circle(x, y, size, 0xff3366, 0.3);

      this.tweens.add({
        targets: particle,
        y: y - Phaser.Math.Between(100, 300),
        alpha: 0,
        duration: Phaser.Math.Between(3000, 6000),
        repeat: -1,
        onRepeat: () => {
          particle.setPosition(
            Phaser.Math.Between(0, width),
            height + size
          );
          particle.setAlpha(0.3);
        },
      });
    }
  }
}
