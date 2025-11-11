import Phaser from 'phaser';

export default class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });
  }

  create(): void {
    const { width, height } = this.cameras.main;

    // Background
    this.add.rectangle(0, 0, width, height, 0x1a1a2e).setOrigin(0);

    // Title with glow effect
    const title = this.add
      .text(width / 2, height / 3, 'JUMP\nMASTER', {
        fontSize: '72px',
        fontFamily: 'Arial, sans-serif',
        color: '#00ff88',
        align: 'center',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);
    title.setShadow(0, 0, '#00ff88', 20, false, true);

    // High score
    const highScore = localStorage.getItem('jumpmaster-highscore') || '0';
    this.add
      .text(width / 2, height / 2 - 20, `High Score: ${highScore}`, {
        fontSize: '24px',
        fontFamily: 'Arial, sans-serif',
        color: '#ffffff',
      })
      .setOrigin(0.5);

    // Instructions
    const instructionText = this.add
      .text(
        width / 2,
        height / 2 + 40,
        'TAP LEFT/RIGHT TO MOVE\nAVOID THE SPIKES!',
        {
          fontSize: '20px',
          fontFamily: 'Arial, sans-serif',
          color: '#aaaaaa',
          align: 'center',
        }
      )
      .setOrigin(0.5);

    // Play button
    const playButton = this.add
      .rectangle(width / 2, height / 1.5, 200, 60, 0x00ff88)
      .setInteractive({ useHandCursor: true });

    const playText = this.add
      .text(width / 2, height / 1.5, 'PLAY', {
        fontSize: '32px',
        fontFamily: 'Arial, sans-serif',
        color: '#1a1a2e',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);

    // Button hover effect
    playButton.on('pointerover', () => {
      playButton.setFillStyle(0x00cc66);
      playButton.setScale(1.05);
    });

    playButton.on('pointerout', () => {
      playButton.setFillStyle(0x00ff88);
      playButton.setScale(1);
    });

    playButton.on('pointerdown', () => {
      playButton.setScale(0.95);
    });

    playButton.on('pointerup', () => {
      playButton.setScale(1);
      this.cameras.main.fade(200, 0, 0, 0);
      this.time.delayedCall(200, () => {
        this.scene.start('GameScene');
      });
    });

    // Animated background particles
    this.createBackgroundParticles();

    // Pulsing animation for title
    this.tweens.add({
      targets: title,
      scaleX: 1.05,
      scaleY: 1.05,
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    // Floating animation for instructions
    this.tweens.add({
      targets: instructionText,
      y: height / 2 + 50,
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    // Camera fade in
    this.cameras.main.fadeIn(500);
  }

  private createBackgroundParticles(): void {
    const { width, height } = this.cameras.main;

    // Create some floating particles
    for (let i = 0; i < 20; i++) {
      const x = Phaser.Math.Between(0, width);
      const y = Phaser.Math.Between(0, height);
      const size = Phaser.Math.Between(2, 6);
      const particle = this.add.circle(x, y, size, 0x00ff88, 0.3);

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
