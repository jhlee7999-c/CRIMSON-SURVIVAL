import Phaser from 'phaser';
import { BossData } from '../data/GameData';

export class Boss extends Phaser.Physics.Arcade.Sprite {
  private hp = 100;
  private maxHp = 100;
  private speed = 70;
  private target?: Phaser.GameObjects.Components.Transform;
  private bossData?: BossData;
  private attackTimer = 0;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'boss');
  }

  spawn(x: number, y: number, target: Phaser.GameObjects.Components.Transform, data: BossData) {
    this.enableBody(true, x, y, true, true);
    this.target = target;
    this.bossData = data;
    this.maxHp = data.hp;
    this.hp = data.hp;
    this.speed = data.speed;
    this.setTint(data.color);
    this.setScale(data.pattern === 'reaper' ? 2.1 : 1.7);
    this.scene.events.emit('bossSpawned', data.name, this.hp / this.maxHp);
  }

  update(_time: number, delta: number) {
    if (!this.active || !this.target || !this.bossData) return;

    this.attackTimer += delta;
    const speedBoost = this.bossData.pattern === 'charge' && this.attackTimer % 2400 > 1700 ? 2.4 : 1;
    this.scene.physics.moveToObject(this, this.target, this.speed * speedBoost);

    if (this.body?.velocity.x && this.body.velocity.x < 0) this.setFlipX(true);
    else if (this.body?.velocity.x && this.body.velocity.x > 0) this.setFlipX(false);

    if (this.bossData.pattern === 'reaper' && this.attackTimer > 1600) {
      this.attackTimer = 0;
      this.scene.cameras.main.shake(220, 0.012);
    }
  }

  takeDamage(amount: number) {
    if (!this.active) return;

    this.hp -= amount;
    this.scene.events.emit('bossHpChange', Math.max(0, this.hp / this.maxHp));
    this.setTint(0xffffff);
    this.scene.time.delayedCall(70, () => {
      if (this.active && this.bossData) this.setTint(this.bossData.color);
    });

    if (this.hp <= 0) {
      const defeatedName = this.bossData?.name ?? 'Boss';
      this.disableBody(true, true);
      this.scene.events.emit('bossDefeated', defeatedName, this.x, this.y);
    }
  }
}
