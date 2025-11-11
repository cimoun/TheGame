import Phaser from 'phaser';

export default class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });
  }

  create(): void {
    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;

    // Title
    const title = this.add.text(centerX, centerY - 100, 'THE GAME', {
      fontSize: '64px',
      color: '#ffffff',
      fontFamily: 'Arial',
    });
    title.setOrigin(0.5);

    // Play button
    const playButton = this.add.text(centerX, centerY, 'PLAY', {
      fontSize: '32px',
      color: '#00ff00',
      fontFamily: 'Arial',
    });
    playButton.setOrigin(0.5);
    playButton.setInteractive({ useHandCursor: true });
    playButton.on('pointerover', () => {
      playButton.setColor('#ffffff');
    });
    playButton.on('pointerout', () => {
      playButton.setColor('#00ff00');
    });
    playButton.on('pointerdown', () => {
      this.scene.start('LevelSelectScene');
    });

    // Quit button
    const quitButton = this.add.text(centerX, centerY + 60, 'QUIT', {
      fontSize: '32px',
      color: '#ff0000',
      fontFamily: 'Arial',
    });
    quitButton.setOrigin(0.5);
    quitButton.setInteractive({ useHandCursor: true });
    quitButton.on('pointerover', () => {
      quitButton.setColor('#ffffff');
    });
    quitButton.on('pointerout', () => {
      quitButton.setColor('#ff0000');
    });
    quitButton.on('pointerdown', () => {
      // In a browser environment, we can't really quit, so just show a message
      const quitText = this.add.text(centerX, centerY + 120, 'Close the browser tab to quit', {
        fontSize: '16px',
        color: '#888888',
        fontFamily: 'Arial',
      });
      quitText.setOrigin(0.5);
    });
  }
}
