import Phaser from 'phaser';
import { Player } from '../entities/Player';
import { MonsterManager } from '../systems/MonsterManager';
import { WeaponSystem } from '../systems/WeaponSystem';
import { ExperienceManager } from '../systems/ExperienceManager';
import { CorruptionSystem } from '../systems/CorruptionSystem';
import { BossManager } from '../systems/BossManager';
import { difficulties, passives, weapons, DifficultyKey, PassiveKey, WeaponKey } from '../data/GameData';
import { MetaProgression } from '../systems/MetaProgression';

export class GameScene extends Phaser.Scene {
  private player!: Player;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd!: Record<string, Phaser.Input.Keyboard.Key>;
  private monsterManager!: MonsterManager;
  private bossManager!: BossManager;
  private weaponSystem!: WeaponSystem;
  private expManager!: ExperienceManager;
  private corruptionSystem!: CorruptionSystem;
  private startTime: number = 0;
  private runEnded: boolean = false;
  private meta = new MetaProgression();
  private difficulty = difficulties.NORMAL;

  constructor() {
    super('GameScene');
  }

  preload() {
    this.load.image('reference-ui', '/assets/crimson-reference-ui.png');
    this.load.image('character-concept', '/assets/crimson-character-concept.png');
    this.load.image('weapon-passive-sheet', '/assets/crimson-weapon-passive-sheet.png');
    this.load.image('player-lilith', '/assets/remastered/lilith-player.png');
    this.load.image('player-cain', '/assets/remastered/cain-player.png');
    this.load.image('portrait-lilith', '/assets/remastered/lilith-portrait.png');
    this.load.image('portrait-cain', '/assets/remastered/cain-portrait.png');
    [
      'weapon-dark_orb',
      'weapon-bat_swarm',
      'weapon-lightning_book',
      'weapon-death_scythe',
      'weapon-cursed_garlic',
      'weapon-ice_crystal',
      'weapon-holy_water',
      'weapon-ghost_candle',
      'passive-grimoire',
      'passive-black_heart',
      'passive-clock',
      'passive-candelabra',
      'passive-bat_wings',
      'passive-iron_cross',
      'passive-blood_chalice',
      'passive-golden_crown',
    ].forEach((key) => this.load.image(`icon-${key}`, `/assets/remastered/${key}.png`));
    this.createPlaceholders();
  }

  create() {
    this.meta.load();
    this.difficulty = this.resolveDifficulty();
    this.physics.world.setBounds(-10000, -10000, 20000, 20000);
    this.createArtTextures();
    this.paintBackground();
    const selectedCharacter = this.registry.get('selectedCharacter') === 'CAIN' ? 'CAIN' : 'LILITH';
    this.player = new Player(this, 640, 360, selectedCharacter === 'CAIN' ? 'player-cain' : 'player-lilith');
    this.player.setDisplaySize(46, 62);
    
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.wasd = this.input.keyboard!.addKeys('W,A,S,D') as Record<string, Phaser.Input.Keyboard.Key>;

    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
    this.input.keyboard?.on('keydown-ESC', () => {
      this.scene.pause();
      this.scene.pause('UIScene');
      this.scene.launch('PauseScene');
    });

    // Initial animations
    this.anims.create({
      key: 'idle',
      frames: [{ key: 'player', frame: 0 }],
      frameRate: 1
    });
    this.anims.create({
      key: 'run',
      frames: [{ key: 'player', frame: 0 }],
      frameRate: 10,
      repeat: -1
    });

    // Initialize systems
    this.monsterManager = new MonsterManager(this, this.player, this.difficulty);
    this.bossManager = new BossManager(this, this.player);
    this.weaponSystem = new WeaponSystem(this, this.player, this.monsterManager.getGroup(), this.bossManager.getGroup());
    this.expManager = new ExperienceManager(this, this.player);
    this.corruptionSystem = new CorruptionSystem(this, 300000 / this.difficulty.corruptionSpeed);
    this.startTime = this.time.now;

    // Event listeners
    this.events.on('monsterDie', (x: number, y: number, elite: boolean) => {
      this.expManager.spawnGem(x, y);
      if (elite) {
        this.meta.addBloodCoin(1);
        this.events.emit('bloodCoinChange', this.meta.getData().bloodCoin);
      }
    });

    this.events.on('corruptionChange', (stage: number) => {
      this.player.setDemonStage(stage);
      this.monsterManager.setCorruptionStage(stage);
      this.events.emit('corruptionUiChange', stage);
    });

    this.events.on('levelUp', () => {
      this.events.emit('upgradeChoices', this.rollUpgradeChoices());
    });

    this.events.on('upgradeSelected', (kind: 'weapon' | 'passive', key: WeaponKey | PassiveKey) => {
      if (kind === 'weapon') this.weaponSystem.addWeapon(key as WeaponKey);
      else this.applyPassive(key as PassiveKey);
      this.events.emit('loadoutChange', this.weaponSystem.getLoadoutSummary());
    });

    this.events.on('bossDefeated', (_name: string, x: number, y: number) => {
      this.expManager.spawnGem(x, y);
      this.meta.addBloodCoin(25);
      this.events.emit('bloodCoinChange', this.meta.getData().bloodCoin);
    });

    this.scene.launch('UIScene');
    this.events.emit('runInfo', {
      difficulty: this.difficulty.name,
      map: this.difficulty.mapName,
      bloodCoin: this.meta.getData().bloodCoin,
    });
    this.events.emit('loadoutChange', this.weaponSystem.getLoadoutSummary());
  }

  update(time: number, delta: number) {
    const input = {
      ...this.cursors,
      W: this.wasd.W,
      A: this.wasd.A,
      S: this.wasd.S,
      D: this.wasd.D
    };
    this.player.update(input);
    
    const elapsed = time - this.startTime;
    if (!this.runEnded && elapsed >= 1800000) {
      this.runEnded = true;
      this.scene.stop('UIScene');
      this.scene.start('ResultScene');
      return;
    }
    this.monsterManager.update(elapsed, delta);
    this.bossManager.update(elapsed);
    this.weaponSystem.update(time, delta);
    this.expManager.update();
    this.corruptionSystem.update(elapsed, delta);
    this.events.emit('timeChange', elapsed);
  }

  private createPlaceholders() {
    const graphics = this.make.graphics({ x: 0, y: 0 });

    // Lilith: cute dark-fantasy vampire, kept at 32x32 for pixel readability.
    graphics.fillStyle(0x000000, 0);
    graphics.fillRect(0, 0, 32, 32);
    graphics.fillStyle(0x2b172b);
    graphics.fillRect(10, 2, 12, 4);
    graphics.fillRect(7, 6, 18, 9);
    graphics.fillStyle(0xf4d5dc);
    graphics.fillRect(10, 9, 12, 9);
    graphics.fillStyle(0x2b172b);
    graphics.fillRect(6, 10, 4, 10);
    graphics.fillRect(22, 10, 4, 10);
    graphics.fillStyle(0xb1122b);
    graphics.fillRect(11, 12, 3, 2);
    graphics.fillRect(18, 12, 3, 2);
    graphics.fillStyle(0xffffff);
    graphics.fillRect(13, 17, 2, 3);
    graphics.fillRect(17, 17, 2, 3);
    graphics.fillStyle(0x5f0d22);
    graphics.fillRect(9, 20, 14, 8);
    graphics.fillStyle(0x19101b);
    graphics.fillRect(6, 22, 5, 6);
    graphics.fillRect(21, 22, 5, 6);
    graphics.fillStyle(0x2c1830);
    graphics.fillRect(11, 28, 4, 3);
    graphics.fillRect(17, 28, 4, 3);
    graphics.generateTexture('player', 32, 32);

    graphics.clear();
    graphics.fillStyle(0x213d2e);
    graphics.fillRect(3, 3, 10, 13);
    graphics.fillStyle(0x7aa06a);
    graphics.fillRect(4, 1, 8, 6);
    graphics.fillStyle(0xffe0a3);
    graphics.fillRect(5, 4, 2, 1);
    graphics.fillRect(10, 4, 2, 1);
    graphics.fillStyle(0x3d1f29);
    graphics.fillRect(1, 9, 4, 5);
    graphics.fillRect(11, 9, 4, 5);
    graphics.generateTexture('monster-zombie', 16, 16);

    graphics.clear();
    graphics.fillStyle(0x1c1022);
    graphics.fillRect(6, 5, 4, 5);
    graphics.fillStyle(0x582140);
    graphics.fillRect(1, 3, 5, 4);
    graphics.fillRect(10, 3, 5, 4);
    graphics.fillRect(2, 7, 4, 3);
    graphics.fillRect(10, 7, 4, 3);
    graphics.fillStyle(0xff4c62);
    graphics.fillRect(6, 6, 1, 1);
    graphics.fillRect(9, 6, 1, 1);
    graphics.generateTexture('monster-bat', 16, 16);

    graphics.clear();
    graphics.fillStyle(0xc9c0ad);
    graphics.fillRect(4, 1, 8, 7);
    graphics.fillRect(6, 8, 4, 5);
    graphics.fillStyle(0x151219);
    graphics.fillRect(5, 4, 2, 2);
    graphics.fillRect(9, 4, 2, 2);
    graphics.fillStyle(0xded6c8);
    graphics.fillRect(2, 8, 3, 6);
    graphics.fillRect(11, 8, 3, 6);
    graphics.generateTexture('monster-skeleton', 16, 16);

    graphics.clear();
    graphics.fillStyle(0x7aa06a);
    graphics.fillRect(0, 0, 16, 16);
    graphics.generateTexture('monster', 16, 16);

    graphics.clear();
    graphics.fillStyle(0x37ecff);
    graphics.fillCircle(4, 4, 4);
    graphics.fillStyle(0xffffff, 0.65);
    graphics.fillCircle(3, 3, 1);
    graphics.generateTexture('exp', 8, 8);

    graphics.clear();
    graphics.fillStyle(0x2a0f44, 0.95);
    graphics.fillCircle(6, 6, 6);
    graphics.fillStyle(0xb947ff);
    graphics.fillCircle(6, 6, 4);
    graphics.fillStyle(0xffd6ff);
    graphics.fillCircle(4, 4, 1);
    graphics.generateTexture('dark-orb', 12, 12);

    graphics.clear();
    graphics.fillStyle(0x111111);
    graphics.fillRect(0, 0, 26, 34);
    graphics.fillStyle(0xe7e4dc);
    graphics.fillRect(5, 4, 16, 5);
    graphics.generateTexture('boss', 26, 34);
  }

  private createArtTextures() {
    this.createCroppedArtTexture('character-concept', 'player-lilith', 52, 202, 138, 176, 92, 118);
    this.createCroppedArtTexture('character-concept', 'player-cain', 206, 204, 136, 176, 92, 118);
    this.createCroppedArtTexture('character-concept', 'portrait-lilith', 52, 202, 138, 176, 76, 96);
    this.createCroppedArtTexture('character-concept', 'portrait-cain', 206, 204, 136, 176, 76, 96);
  }

  private createCroppedArtTexture(
    sourceKey: string,
    textureKey: string,
    x: number,
    y: number,
    width: number,
    height: number,
    outputWidth: number,
    outputHeight: number,
  ) {
    if (this.textures.exists(textureKey)) return;

    const source = this.textures.get(sourceKey).getSourceImage() as HTMLImageElement;
    const texture = this.textures.createCanvas(textureKey, outputWidth, outputHeight);
    const context = texture?.getContext();
    if (!texture || !context) return;

    context.drawImage(source, x, y, width, height, 0, 0, outputWidth, outputHeight);
    texture.refresh();
  }

  private resolveDifficulty() {
    const params = new URLSearchParams(window.location.search);
    const key = params.get('difficulty')?.toUpperCase() as DifficultyKey | null;
    return key && difficulties[key] ? difficulties[key] : difficulties.NORMAL;
  }

  private paintBackground() {
    this.cameras.main.setBackgroundColor(this.difficulty.palette.ground);
    const graphics = this.add.graphics();
    graphics.setDepth(-10);

    graphics.fillStyle(0x07070d, 1);
    graphics.fillRect(-10000, -10000, 20000, 20000);

    for (let i = 0; i < 900; i++) {
      const x = Phaser.Math.Between(-10000, 10000);
      const y = Phaser.Math.Between(-10000, 10000);
      const alpha = Phaser.Math.FloatBetween(0.08, 0.22);
      graphics.fillStyle(this.difficulty.palette.fog, alpha);
      graphics.fillRect(x, y, Phaser.Math.Between(42, 120), Phaser.Math.Between(6, 14));
    }

    for (let i = 0; i < 720; i++) {
      const x = Phaser.Math.Between(-9800, 9800);
      const y = Phaser.Math.Between(-9800, 9800);
      const w = Phaser.Math.Between(10, 22);
      const h = Phaser.Math.Between(14, 32);
      graphics.fillStyle(i % 7 === 0 ? this.difficulty.palette.accent : this.difficulty.palette.fog, 0.78);
      graphics.fillRect(x, y, w, h);
      graphics.fillRect(x - 3, y + h - 4, w + 6, 4);
    }

    graphics.fillStyle(this.difficulty.palette.accent, 0.25);
    graphics.fillCircle(1280, -1120, 180);
    graphics.fillStyle(0x08060a, 0.72);
    graphics.fillCircle(1220, -1170, 170);
  }

  private rollUpgradeChoices() {
    const weaponChoices = Phaser.Utils.Array.Shuffle([...weapons]).slice(0, 2).map((weapon) => ({
      kind: 'weapon' as const,
      key: weapon.key,
      name: weapon.name,
      description: weapon.role,
    }));
    const passiveChoice = Phaser.Utils.Array.GetRandom(passives);

    return [
      ...weaponChoices,
      {
        kind: 'passive' as const,
        key: passiveChoice.key,
        name: passiveChoice.name,
        description: passiveChoice.effect,
      },
    ];
  }

  private applyPassive(key: PassiveKey) {
    this.weaponSystem.addPassive(key);
    const metaData = this.meta.getData();
    if (key === 'bat_wings') this.player.applyMoveSpeedBonus(metaData.upgrades.moveSpeed + 1);
    if (key === 'golden_crown') this.expManager.setExpBonus(metaData.upgrades.expGain + 1);
  }
}
