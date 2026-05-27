import Phaser from 'phaser';
import { createCroppedTexture, createGothicButton } from './CropUtils';

export class ResultScene extends Phaser.Scene {
  constructor() {
    super('ResultScene');
  }

  preload() {
    this.load.image('reference-ui', '/assets/crimson-reference-ui.png');
  }

  create() {
    createCroppedTexture(this, 'reference-ui', 'result-panel', 1074, 438, 454, 258);
    this.add.rectangle(640, 360, 1280, 720, 0x050308, 1);
    this.add.image(640, 340, 'result-panel').setDisplaySize(1120, 636);
    createGothicButton(this, 640, 668, 260, 42, 'MAIN MENU', () => this.scene.start('MainMenuScene'));
    this.input.keyboard?.once('keydown-SPACE', () => this.scene.start('MainMenuScene'));
  }
}
