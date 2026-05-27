import Phaser from 'phaser';
import { createCroppedTexture, createGothicButton } from './CropUtils';

export class PauseScene extends Phaser.Scene {
  constructor() {
    super('PauseScene');
  }

  preload() {
    this.load.image('reference-ui', '/assets/crimson-reference-ui.png');
  }

  create() {
    createCroppedTexture(this, 'reference-ui', 'pause-panel', 417, 705, 154, 214);
    this.add.rectangle(640, 360, 1280, 720, 0x000000, 0.5);
    this.add.image(640, 360, 'pause-panel').setDisplaySize(390, 542);
    createGothicButton(this, 640, 250, 270, 48, 'CONTINUE', () => this.resumeGame());
    createGothicButton(this, 640, 320, 270, 48, 'RESTART', () => this.restartGame());
    createGothicButton(this, 640, 390, 270, 48, 'SETTINGS', () => {
      this.registry.set('settingsReturn', 'PauseScene');
      this.scene.launch('SettingsScene');
    });
    createGothicButton(this, 640, 460, 270, 48, 'MAIN MENU', () => this.mainMenu());
    this.input.keyboard?.once('keydown-ESC', () => this.resumeGame());
  }

  private resumeGame() {
    this.scene.stop();
    this.scene.resume('GameScene');
    this.scene.resume('UIScene');
  }

  private restartGame() {
    this.scene.stop('UIScene');
    this.scene.stop('GameScene');
    this.scene.start('GameScene');
  }

  private mainMenu() {
    this.scene.stop('UIScene');
    this.scene.stop('GameScene');
    this.scene.start('MainMenuScene');
  }
}
