import Phaser from 'phaser';
import { PassiveKey, WeaponKey } from '../data/GameData';

interface UpgradeChoice {
  kind: 'weapon' | 'passive';
  key: WeaponKey | PassiveKey;
  name: string;
  description: string;
}

const ICON_SIZE = 76;

const weaponIconCrops: Partial<Record<WeaponKey, { x: number; y: number }>> = {
  dark_orb: { x: 350, y: 314 },
  bat_swarm: { x: 42, y: 314 },
  lightning_book: { x: 808, y: 138 },
  death_scythe: { x: 1114, y: 138 },
  cursed_garlic: { x: 500, y: 138 },
  ice_crystal: { x: 806, y: 314 },
  holy_water: { x: 196, y: 492 },
  ghost_candle: { x: 1112, y: 314 },
};

const passiveIconCrops: Partial<Record<PassiveKey, { x: number; y: number }>> = {
  grimoire: { x: 654, y: 138 },
  black_heart: { x: 42, y: 492 },
  clock: { x: 654, y: 666 },
  candelabra: { x: 500, y: 314 },
  bat_wings: { x: 1264, y: 666 },
  iron_cross: { x: 502, y: 492 },
  blood_chalice: { x: 196, y: 492 },
  golden_crown: { x: 1418, y: 492 },
};

export class UIScene extends Phaser.Scene {
  private timerText!: Phaser.GameObjects.Text;
  private levelText!: Phaser.GameObjects.Text;
  private runText!: Phaser.GameObjects.Text;
  private coinText!: Phaser.GameObjects.Text;
  private corruptionText!: Phaser.GameObjects.Text;
  private loadoutText!: Phaser.GameObjects.Text;
  private bossText!: Phaser.GameObjects.Text;
  private expBar!: Phaser.GameObjects.Graphics;
  private bossBar!: Phaser.GameObjects.Graphics;
  private hudFrame!: Phaser.GameObjects.Graphics;
  private corruptionGems: Phaser.GameObjects.Polygon[] = [];
  private choiceLayer?: Phaser.GameObjects.Container;

  constructor() {
    super('UIScene');
  }

  create() {
    this.createSheetIcons();
    this.createReferencePanelTextures();
    this.hudFrame = this.add.graphics();
    this.drawStaticHud();

    const selectedCharacter = this.registry.get('selectedCharacter') === 'CAIN' ? 'CAIN' : 'LILITH';
    const portraitKey = selectedCharacter === 'CAIN' ? 'portrait-cain' : 'portrait-lilith';
    this.add.image(54, 58, this.textures.exists(portraitKey) ? portraitKey : 'player').setDisplaySize(54, 68).setDepth(2);
    this.timerText = this.add.text(640, 24, '00:00', this.textStyle(30, '#f8ead2')).setOrigin(0.5);
    this.levelText = this.add.text(548, 684, 'LV. 1', this.textStyle(18, '#f8d893')).setOrigin(0.5);
    this.runText = this.add.text(102, 25, 'NORMAL / 공동묘지', this.textStyle(14, '#f4bd5c'));
    this.coinText = this.add.text(1164, 20, '0', this.textStyle(17, '#ffd98a')).setOrigin(1, 0);
    this.corruptionText = this.add.text(640, 52, 'CORRUPTION LV. 0', this.textStyle(13, '#ffcf62')).setOrigin(0.5);
    this.loadoutText = this.add.text(432, 642, '암흑 구체 Lv.1', this.textStyle(13, '#f4e3de'));
    this.bossText = this.add.text(640, 76, '', this.textStyle(18, '#ffccd2')).setOrigin(0.5);

    this.expBar = this.add.graphics();
    this.bossBar = this.add.graphics();
    this.drawExpBar(0);

    const gameScene = this.scene.get('GameScene');
    gameScene.events.on('levelUp', (level: number) => {
      this.levelText.setText(`LV. ${level}`);
    });

    gameScene.events.on('expChange', (ratio: number) => {
      this.drawExpBar(ratio);
    });

    gameScene.events.on('timeChange', (elapsed: number) => {
      this.drawTimer(elapsed);
    });

    gameScene.events.on('runInfo', (info: { difficulty: string; map: string; bloodCoin: number }) => {
      this.runText.setText(`${info.difficulty} / ${info.map}`);
      this.coinText.setText(`${info.bloodCoin}`);
    });

    gameScene.events.on('bloodCoinChange', (amount: number) => {
      this.coinText.setText(`${amount}`);
    });

    gameScene.events.on('corruptionUiChange', (stage: number) => {
      this.corruptionText.setText(`CORRUPTION LV. ${stage}`);
      this.updateCorruptionGems(stage);
    });

    gameScene.events.on('loadoutChange', (summary: { weaponText: string; passiveText: string }) => {
      const passiveText = summary.passiveText ? ` | ${summary.passiveText}` : '';
      this.loadoutText.setText(`${summary.weaponText}${passiveText}`);
    });

    gameScene.events.on('upgradeChoices', (choices: UpgradeChoice[]) => {
      this.showUpgradeChoices(choices);
    });

    gameScene.events.on('bossSpawned', (name: string, ratio: number) => {
      this.bossText.setText(name);
      this.drawBossBar(ratio);
      this.showTimedPanel('boss-warning-panel', 500, 258, 1800);
    });

    gameScene.events.on('bossHpChange', (ratio: number) => {
      this.drawBossBar(ratio);
      if (ratio <= 0) this.bossText.setText('');
    });

    gameScene.events.on('bossDefeated', () => {
      this.bossText.setText('');
      this.drawBossBar(0);
      this.showTimedPanel('evolution-panel', 640, 360, 1700);
    });
  }

  private drawTimer(elapsed: number) {
    const minutes = Math.floor(elapsed / 60000);
    const seconds = Math.floor((elapsed % 60000) / 1000);
    this.timerText.setText(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
  }

  private drawExpBar(ratio: number) {
    this.expBar.clear();
    this.expBar.fillStyle(0x12070d, 0.96);
    this.expBar.fillRect(572, 684, 300, 8);
    this.expBar.lineStyle(1, 0xb56b2c, 1);
    this.expBar.strokeRect(572, 684, 300, 8);
    this.expBar.fillStyle(0x8e20d6);
    this.expBar.fillRect(573, 685, 298 * Phaser.Math.Clamp(ratio, 0, 1), 6);
  }

  private drawBossBar(ratio: number) {
    this.bossBar.clear();
    if (ratio <= 0) return;
    this.bossBar.fillStyle(0x25070b, 0.9);
    this.bossBar.fillRect(420, 98, 440, 12);
    this.bossBar.lineStyle(1, 0xd08a39, 1);
    this.bossBar.strokeRect(420, 98, 440, 12);
    this.bossBar.fillStyle(0xd93746);
    this.bossBar.fillRect(421, 99, 438 * Phaser.Math.Clamp(ratio, 0, 1), 10);
  }

  private showUpgradeChoices(choices: UpgradeChoice[]) {
    this.choiceLayer?.destroy(true);
    const gameScene = this.scene.get('GameScene');
    gameScene.scene.pause();

    const layer = this.add.container(0, 0);
    const veil = this.add.rectangle(640, 360, 1280, 720, 0x080408, 0.84);
    const panel = this.add.rectangle(640, 360, 620, 418, 0x080509, 0.76).setStrokeStyle(1, 0x9f632e);
    const title = this.add.text(640, 146, 'LEVEL UP!', this.textStyle(34, '#f3c57a')).setOrigin(0.5);
    const ornament = this.add.text(640, 181, '◆  ◆  ◆', this.textStyle(18, '#d9253a')).setOrigin(0.5);
    layer.add([veil, panel, title, ornament]);

    choices.forEach((choice, index) => {
      const x = 430 + index * 210;
      const y = 360;
      const borderColor = choice.kind === 'weapon' ? 0xb68a37 : 0x7f42c8;
      const bg = this.add.rectangle(x, y, 164, 250, 0x10090d, 0.97).setStrokeStyle(2, borderColor);
      const iconBox = this.add.rectangle(x, y - 78, 86, 78, 0x160b14, 0.98).setStrokeStyle(1, 0x4d2c28);
      const icon = this.add.image(x, y - 78, this.getIconTexture(choice.kind, choice.key)).setDisplaySize(68, 68);
      const name = this.add.text(x, y + 8, choice.name, this.textStyle(18, choice.kind === 'weapon' ? '#7fb6ff' : '#ffd278')).setOrigin(0.5);
      const type = this.add.text(x, y + 35, choice.kind === 'weapon' ? 'NEW WEAPON' : 'PASSIVE', this.textStyle(12, '#d49045')).setOrigin(0.5);
      const desc = this.add.text(x, y + 66, choice.description, {
        ...this.textStyle(13, '#f0d6c6'),
        align: 'center',
        wordWrap: { width: 126 },
      }).setOrigin(0.5, 0);
      const rarity = this.add.text(x, y + 113, choice.kind === 'weapon' ? '+ RARE +' : 'COMMON', this.textStyle(12, '#a58057')).setOrigin(0.5);
      bg.setInteractive({ useHandCursor: true });
      bg.on('pointerdown', () => {
        gameScene.events.emit('upgradeSelected', choice.kind, choice.key);
        this.choiceLayer?.destroy(true);
        this.choiceLayer = undefined;
        gameScene.scene.resume();
      });
      layer.add([bg, iconBox, icon, name, type, desc, rarity]);
    });

    this.choiceLayer = layer;
  }

  private drawStaticHud() {
    this.hudFrame.clear();
    this.hudFrame.fillStyle(0x070408, 0.82);
    this.hudFrame.fillRect(18, 14, 324, 86);
    this.hudFrame.lineStyle(1, 0x9f632e, 1);
    this.hudFrame.strokeRect(18, 14, 324, 86);
    this.hudFrame.strokeCircle(54, 58, 33);

    this.hudFrame.fillStyle(0x19070d, 1);
    this.hudFrame.fillRect(96, 46, 176, 12);
    this.hudFrame.fillStyle(0xb82031, 1);
    this.hudFrame.fillRect(98, 48, 172, 8);
    this.hudFrame.lineStyle(1, 0x4d131b, 1);
    this.hudFrame.strokeRect(96, 46, 176, 12);
    this.add.text(182, 43, '100 / 100', this.textStyle(13, '#ffffff')).setOrigin(0.5, 0);

    this.hudFrame.fillStyle(0x10060d, 0.94);
    this.hudFrame.fillRect(410, 632, 460, 62);
    this.hudFrame.lineStyle(1, 0x9f632e, 1);
    this.hudFrame.strokeRect(410, 632, 460, 62);

    for (let i = 0; i < 6; i++) {
      const x = 38 + i * 44;
      this.hudFrame.fillStyle(0x0d070c, 0.95);
      this.hudFrame.fillRect(x, 634, 34, 34);
      this.hudFrame.lineStyle(1, 0xb56b2c, 1);
      this.hudFrame.strokeRect(x, 634, 34, 34);
    }

    for (let i = 0; i < 6; i++) {
      const x = 1008 + i * 44;
      this.hudFrame.fillStyle(0x0d070c, 0.95);
      this.hudFrame.fillRect(x, 634, 34, 34);
      this.hudFrame.lineStyle(1, 0xb56b2c, 1);
      this.hudFrame.strokeRect(x, 634, 34, 34);
    }

    this.add.image(55, 651, 'icon-weapon-dark_orb').setDisplaySize(28, 28);
    this.add.image(1027, 651, 'icon-passive-blood_chalice').setDisplaySize(28, 28);

    for (let i = 0; i < 6; i++) {
      const gem = this.add.polygon(584 + i * 24, 73, [0, -8, 7, 0, 0, 8, -7, 0], 0x14080b).setStrokeStyle(1, 0x9f632e);
      this.corruptionGems.push(gem);
    }
    this.updateCorruptionGems(0);

    this.add.text(1182, 20, '●', this.textStyle(13, '#d99a37'));
    this.add.text(1182, 44, '☠', this.textStyle(15, '#d8c1a1'));
  }

  private updateCorruptionGems(stage: number) {
    this.corruptionGems.forEach((gem, index) => {
      gem.setFillStyle(index < stage ? 0xd9253a : 0x14080b, 1);
      gem.setStrokeStyle(1, index < stage ? 0xff8b65 : 0x9f632e, 1);
    });
  }

  private createSheetIcons() {
    Object.entries(weaponIconCrops).forEach(([key, crop]) => {
      this.createCroppedTexture(`icon-weapon-${key}`, crop.x, crop.y);
    });
    Object.entries(passiveIconCrops).forEach(([key, crop]) => {
      this.createCroppedTexture(`icon-passive-${key}`, crop.x, crop.y);
    });
  }

  private createReferencePanelTextures() {
    this.createReferenceCrop('boss-warning-panel', 447, 438, 286, 258);
    this.createReferenceCrop('evolution-panel', 744, 438, 318, 258);
  }

  private createReferenceCrop(textureKey: string, x: number, y: number, width: number, height: number) {
    if (this.textures.exists(textureKey)) return;

    const source = this.textures.get('reference-ui').getSourceImage() as HTMLImageElement;
    const texture = this.textures.createCanvas(textureKey, width, height);
    const context = texture?.getContext();
    if (!texture || !context) return;

    context.drawImage(source, x, y, width, height, 0, 0, width, height);
    texture.refresh();
  }

  private showTimedPanel(textureKey: string, width: number, height: number, duration: number) {
    const panel = this.add.image(640, 360, textureKey).setDisplaySize(width, height).setDepth(40);
    this.time.delayedCall(duration, () => panel.destroy());
  }

  private createCroppedTexture(textureKey: string, x: number, y: number) {
    if (this.textures.exists(textureKey)) return;

    const sheet = this.textures.get('weapon-passive-sheet');
    const sourceImage = sheet.getSourceImage() as HTMLImageElement;
    const canvasTexture = this.textures.createCanvas(textureKey, ICON_SIZE, ICON_SIZE);
    const context = canvasTexture?.getContext();
    if (!canvasTexture || !context) return;

    context.drawImage(sourceImage, x, y, ICON_SIZE, ICON_SIZE, 0, 0, ICON_SIZE, ICON_SIZE);
    canvasTexture.refresh();
  }

  private getIconTexture(kind: 'weapon' | 'passive', key: WeaponKey | PassiveKey) {
    const textureKey = `icon-${kind}-${key}`;
    return this.textures.exists(textureKey) ? textureKey : kind === 'weapon' ? 'dark-orb' : 'exp';
  }

  private textStyle(size: number, color: string): Phaser.Types.GameObjects.Text.TextStyle {
    return {
      fontFamily: 'Georgia, "Times New Roman", serif',
      fontSize: `${size}px`,
      color,
      shadow: { offsetX: 1, offsetY: 1, color: '#000000', blur: 2, fill: true },
    };
  }
}
