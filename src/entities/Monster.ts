import Phaser from 'phaser';

export class Monster extends Phaser.Physics.Arcade.Sprite {
  private hp: number = 10;
  private maxHp: number = 10;
  private moveSpeed: number = 50;
  private target!: Phaser.GameObjects.Components.Transform;
  private isElite: boolean = false;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'monster');
  }

  spawn(
    x: number,
    y: number,
    target: Phaser.GameObjects.Components.Transform,
    hpMultiplier: number = 1,
    speedMultiplier: number = 1,
    elite: boolean = false,
  ) {
    this.enableBody(true, x, y, true, true);
    this.target = target;
    this.isElite = elite;
    const monsterTextures = ['monster-zombie', 'monster-bat', 'monster-skeleton'];
    this.setTexture(Phaser.Utils.Array.GetRandom(monsterTextures));
    this.maxHp = Math.floor((elite ? 42 : 10) * hpMultiplier);
    this.hp = this.maxHp;
    this.moveSpeed = (elite ? 62 : 50) * speedMultiplier;
    this.setScale(elite ? 1.35 : 1);
    this.setTint(elite ? 0xffc04a : 0xffffff);
  }

  update() {
    if (!this.active) return;

    if (this.target) {
      this.scene.physics.moveToObject(this, this.target, this.moveSpeed);
      
      if (this.body!.velocity.x < 0) this.setFlipX(true);
      else if (this.body!.velocity.x > 0) this.setFlipX(false);
    }
  }

  takeDamage(amount: number) {
    this.hp -= amount;
    if (this.hp <= 0) {
      this.die();
    }
    
    // Flash effect
    this.setTint(0xffffff);
    this.scene.time.delayedCall(70, () => {
      if (this.active) this.setTint(this.isElite ? 0xffc04a : 0xffffff);
    });
  }

  private die() {
    this.disableBody(true, true);
    this.scene.events.emit('monsterDie', this.x, this.y, this.isElite);
  }
}
