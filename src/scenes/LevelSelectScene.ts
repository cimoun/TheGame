import Phaser from 'phaser';

export default class LevelSelectScene extends Phaser.Scene {
  constructor() {
    super({ key: 'LevelSelectScene' });
  }

  create(): void {
    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;

    // Title
    const title = this.add.text(centerX, 100, 'SELECT LEVEL', {
      fontSize: '48px',
      color: '#ffffff',
      fontFamily: 'Arial',
    });
    title.setOrigin(0.5);

    // Level 1 button
    const level1Button = this.add.text(centerX - 100, centerY, 'LEVEL 1', {
      fontSize: '28px',
      color: '#00ff00',
      fontFamily: 'Arial',
    });
    level1Button.setOrigin(0.5);
    level1Button.setInteractive({ useHandCursor: true });
    level1Button.on('pointerover', () => {
      level1Button.setColor('#ffffff');
    });
    level1Button.on('pointerout', () => {
      level1Button.setColor('#00ff00');
    });
    level1Button.on('pointerdown', () => {
      this.scene.start('LevelScene', { level: 1, deaths: 0 });
    });

    // Level 2 button
    const level2Button = this.add.text(centerX + 100, centerY, 'LEVEL 2', {
      fontSize: '28px',
      color: '#00ff00',
      fontFamily: 'Arial',
    });
    level2Button.setOrigin(0.5);
    level2Button.setInteractive({ useHandCursor: true });
    level2Button.on('pointerover', () => {
      level2Button.setColor('#ffffff');
    });
    level2Button.on('pointerout', () => {
      level2Button.setColor('#00ff00');
    });
    level2Button.on('pointerdown', () => {
      this.scene.start('LevelScene', { level: 2, deaths: 0 });
    });

    // Back button
    const backButton = this.add.text(centerX, centerY + 100, 'BACK TO MENU', {
      fontSize: '24px',
      color: '#888888',
      fontFamily: 'Arial',
    });
    backButton.setOrigin(0.5);
    backButton.setInteractive({ useHandCursor: true });
    backButton.on('pointerover', () => {
      backButton.setColor('#ffffff');
    });
    backButton.on('pointerout', () => {
      backButton.setColor('#888888');
    });
    backButton.on('pointerdown', () => {
      this.scene.start('MenuScene');
    });
  }
}
