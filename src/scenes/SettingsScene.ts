import Phaser from 'phaser';
import { createCroppedTexture, createGothicButton, gothicText } from './CropUtils';

export class SettingsScene extends Phaser.Scene {
  constructor() {
    super('SettingsScene');
  }

  preload() {
    this.load.image('reference-ui', '/assets/crimson-reference-ui.png');
  }

  create() {
    createCroppedTexture(this, 'reference-ui', 'settings-panel', 582, 705, 270, 214);
    this.cameras.main.setBackgroundColor(0x050308);
    this.add.rectangle(640, 360, 1280, 720, 0x050308, 1);
    this.add.image(640, 350, 'settings-panel').setDisplaySize(760, 600);
    this.add.text(640, 76, 'SETTINGS', gothicText(34, '#f3c57a')).setOrigin(0.5);
    createGothicButton(this, 640, 635, 220, 38, 'BACK', () => this.goBack());
    this.input.keyboard?.once('keydown-ESC', () => this.goBack());
  }

  private goBack() {
    if (this.registry.get('settingsReturn') === 'PauseScene') {
      this.scene.stop();
      return;
    }

    this.scene.start('MainMenuScene');
  }
}
