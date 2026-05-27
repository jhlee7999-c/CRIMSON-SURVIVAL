import Phaser from 'phaser';
import { createCroppedTexture, createGothicButton, gothicText } from './CropUtils';

type CharacterKey = 'LILITH' | 'CAIN';

export class CharacterSelectScene extends Phaser.Scene {
  private selected: CharacterKey = 'LILITH';

  constructor() {
    super('CharacterSelectScene');
  }

  preload() {
    this.load.image('reference-ui', '/assets/crimson-reference-ui.png');
    this.load.image('character-concept', '/assets/crimson-character-concept.png');
    this.load.image('lilith-menu-large', '/assets/remastered/lilith-player.png');
    this.load.image('cain-menu-large', '/assets/remastered/cain-player.png');
  }

  create() {
    createCroppedTexture(this, 'reference-ui', 'character-select-panel', 12, 438, 424, 258);
    this.cameras.main.setBackgroundColor(0x050308);
    this.add.rectangle(640, 360, 1280, 720, 0x050308, 1);
    this.add.image(640, 348, 'character-select-panel').setDisplaySize(1060, 645);

    const title = this.add.text(640, 34, 'CHARACTER SELECT', gothicText(34, '#f3c57a')).setOrigin(0.5);
    const selectedText = this.add.text(640, 660, 'LILITH SELECTED', gothicText(22, '#ffcf62')).setOrigin(0.5);

    const lilithFrame = this.add.rectangle(390, 352, 360, 500, 0x000000, 0).setStrokeStyle(2, 0xb56b2c, 0.5);
    const cainFrame = this.add.rectangle(890, 352, 360, 500, 0x000000, 0).setStrokeStyle(2, 0x6c2a30, 0.5);
    this.add.image(390, 326, this.textures.exists('lilith-menu-large') ? 'lilith-menu-large' : 'character-select-panel').setDisplaySize(230, 310);
    this.add.image(890, 326, this.textures.exists('cain-menu-large') ? 'cain-menu-large' : 'character-select-panel').setDisplaySize(230, 310);

    this.addHitArea(210, 120, 360, 500, () => {
      this.selected = 'LILITH';
      selectedText.setText('LILITH SELECTED');
      lilithFrame.setStrokeStyle(3, 0xf0a84a, 1);
      cainFrame.setStrokeStyle(2, 0x6c2a30, 0.5);
    });
    this.addHitArea(710, 120, 360, 500, () => {
      this.selected = 'CAIN';
      selectedText.setText('CAIN SELECTED');
      cainFrame.setStrokeStyle(3, 0xf0a84a, 1);
      lilithFrame.setStrokeStyle(2, 0xb56b2c, 0.5);
    });
    createGothicButton(this, 640, 620, 280, 46, 'START RUN', () => this.startRun());

    this.input.keyboard?.once('keydown-SPACE', () => this.startRun());
    this.input.keyboard?.once('keydown-ESC', () => this.scene.start('MainMenuScene'));
    title.setDepth(2);
    selectedText.setDepth(2);
  }

  private startRun() {
    this.registry.set('selectedCharacter', this.selected);
    this.scene.start('GameScene');
  }

  private addHitArea(x: number, y: number, width: number, height: number, callback: () => void) {
    this.add.rectangle(x + width / 2, y + height / 2, width, height, 0xffffff, 0.001)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', callback);
  }
}
