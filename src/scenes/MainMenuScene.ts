import Phaser from 'phaser';
import { createCroppedTexture, createGothicButton, gothicText } from './CropUtils';

export class MainMenuScene extends Phaser.Scene {
  constructor() {
    super('MainMenuScene');
  }

  preload() {
    this.load.image('reference-ui', '/assets/crimson-reference-ui.png');
  }

  create() {
    createCroppedTexture(this, 'reference-ui', 'main-menu-panel', 1074, 60, 456, 368);
    this.cameras.main.setBackgroundColor(0x050308);

    this.add.rectangle(640, 360, 1280, 720, 0x050308, 1);
    this.add.image(640, 360, 'main-menu-panel').setDisplaySize(960, 720);
    this.add.text(640, 668, 'SPACE START  /  BUTTONS WORK', gothicText(22, '#f3c57a')).setOrigin(0.5);

    createGothicButton(this, 640, 304, 220, 38, 'START', () => this.scene.start('CharacterSelectScene'));
    createGothicButton(this, 640, 354, 220, 38, 'UPGRADES', () => this.scene.start('MetaUpgradeScene'));
    createGothicButton(this, 640, 404, 220, 38, 'CHARACTERS', () => this.scene.start('CharacterSelectScene'));
    createGothicButton(this, 640, 454, 220, 38, 'SETTINGS', () => {
      this.registry.set('settingsReturn', 'MainMenuScene');
      this.scene.start('SettingsScene');
    });
    createGothicButton(this, 640, 504, 220, 38, 'EXIT', () => this.scene.start('MainMenuScene'));
    this.input.keyboard?.once('keydown-SPACE', () => this.scene.start('CharacterSelectScene'));
  }
}
