import Phaser from 'phaser';
import { bosses } from '../data/GameData';
import { Boss } from '../entities/Boss';

export class BossManager {
  private group: Phaser.Physics.Arcade.Group;
  private spawnedMinutes = new Set<number>();

  constructor(
    scene: Phaser.Scene,
    private player: Phaser.GameObjects.Components.Transform,
  ) {
    this.group = scene.physics.add.group({
      classType: Boss,
      runChildUpdate: true,
      maxSize: bosses.length,
    });
  }

  update(elapsedMs: number) {
    const elapsedMinute = Math.floor(elapsedMs / 60000);
    for (const bossData of bosses) {
      if (elapsedMinute >= bossData.minute && !this.spawnedMinutes.has(bossData.minute)) {
        this.spawnedMinutes.add(bossData.minute);
        this.spawnBoss(bossData.minute);
      }
    }
  }

  getGroup() {
    return this.group;
  }

  private spawnBoss(minute: number) {
    const bossData = bosses.find((boss) => boss.minute === minute);
    if (!bossData) return;

    const angle = Math.random() * Math.PI * 2;
    const distance = 430;
    const x = this.player.x + Math.cos(angle) * distance;
    const y = this.player.y + Math.sin(angle) * distance;
    const boss = this.group.get() as Boss | null;
    boss?.spawn(x, y, this.player, bossData);
  }
}
