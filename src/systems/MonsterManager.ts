import Phaser from 'phaser';
import { Monster } from '../entities/Monster';
import { DifficultyData } from '../data/GameData';

export class MonsterManager {
  private group: Phaser.Physics.Arcade.Group;
  private spawnTimer: number = 0;
  private spawnInterval: number = 1000; // 1 second
  private player: Phaser.GameObjects.Components.Transform;
  private corruptionStage: number = 0;

  constructor(
    scene: Phaser.Scene,
    player: Phaser.GameObjects.Components.Transform,
    private difficulty: DifficultyData,
  ) {
    this.player = player;
    this.group = scene.physics.add.group({
      classType: Monster,
      runChildUpdate: true,
      maxSize: 500
    });
  }

  update(time: number, delta: number) {
    this.spawnTimer += delta;
    if (this.spawnTimer >= this.spawnInterval) {
      this.spawnTimer = 0;
      const burstCount = 1 + Math.floor(this.corruptionStage / 3);
      for (let i = 0; i < burstCount; i++) this.spawnMonster(time);
    }

    // Dynamic difficulty: increase spawn rate over time
    const minutes = time / 60000;
    const baseInterval = Math.max(130, 1000 - minutes * 55);
    this.spawnInterval = baseInterval / this.difficulty.spawnMultiplier;
  }

  setCorruptionStage(stage: number) {
    this.corruptionStage = stage;
  }

  private spawnMonster(time: number) {
    const angle = Math.random() * Math.PI * 2;
    const distance = 500; // Outside camera view
    const x = this.player.x + Math.cos(angle) * distance;
    const y = this.player.y + Math.sin(angle) * distance;

    const monster = this.group.get() as Monster;
    if (monster) {
      const minutes = time / 60000;
      const eliteChance = Math.min(0.18, 0.015 + minutes * 0.004 + this.corruptionStage * 0.01);
      const hpMultiplier = this.difficulty.enemyHpMultiplier * (1 + this.corruptionStage * 0.12);
      const speedMultiplier = this.difficulty.enemySpeedMultiplier * (1 + this.corruptionStage * 0.04);
      monster.spawn(x, y, this.player, hpMultiplier, speedMultiplier, Math.random() < eliteChance);
    }
  }

  getGroup() {
    return this.group;
  }
}
