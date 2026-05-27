import Phaser from 'phaser';
import { MetaProgression } from '../systems/MetaProgression';
import { createCroppedTexture, createGothicButton, gothicText } from './CropUtils';

const upgradeRows = [
  { key: 'maxHp', label: 'MAX HP' },
  { key: 'attack', label: 'POWER' },
  { key: 'moveSpeed', label: 'SPEED' },
  { key: 'expGain', label: 'EXP GAIN' },
  { key: 'starterWeapon', label: 'STARTER' },
] as const;

export class MetaUpgradeScene extends Phaser.Scene {
  private meta = new MetaProgression();
  private coinText?: Phaser.GameObjects.Text;
  private rowTexts: Phaser.GameObjects.Text[] = [];

  constructor() {
    super('MetaUpgradeScene');
  }

  preload() {
    this.load.image('reference-ui', '/assets/crimson-reference-ui.png');
  }

  create() {
    createCroppedTexture(this, 'reference-ui', 'meta-upgrade-panel', 12, 704, 396, 214);
    this.meta.load();
    this.cameras.main.setBackgroundColor(0x050308);
    this.add.rectangle(640, 360, 1280, 720, 0x050308, 1);
    this.add.image(640, 350, 'meta-upgrade-panel').setDisplaySize(980, 530);
    this.add.text(640, 70, 'META UPGRADES', gothicText(34, '#f3c57a')).setOrigin(0.5);

    this.coinText = this.add.text(838, 194, '', gothicText(20, '#ffd98a')).setOrigin(1, 0.5);
    upgradeRows.forEach((row, index) => {
      const y = 246 + index * 48;
      const text = this.add.text(485, y, '', gothicText(18, '#f2d7b5'));
      this.rowTexts.push(text);
      createGothicButton(this, 820, y + 8, 110, 30, 'BUY', () => {
        this.meta.buyUpgrade(row.key);
        this.refresh();
      });
    });

    createGothicButton(this, 640, 630, 220, 38, 'BACK', () => this.scene.start('MainMenuScene'));
    this.input.keyboard?.once('keydown-ESC', () => this.scene.start('MainMenuScene'));
    this.refresh();
  }

  private refresh() {
    const data = this.meta.getData();
    this.coinText?.setText(`${data.bloodCoin}`);
    upgradeRows.forEach((row, index) => {
      const level = data.upgrades[row.key] ?? 0;
      const cap = row.key === 'starterWeapon' ? 1 : 5;
      const cost = level >= cap ? 'MAX' : `${120 * (level + 1)} C`;
      this.rowTexts[index]?.setText(`${row.label}    Lv. ${level}/${cap}    ${cost}`);
    });
  }
}
