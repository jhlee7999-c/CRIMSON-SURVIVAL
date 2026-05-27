import Phaser from 'phaser';

export class ExperienceGem extends Phaser.Physics.Arcade.Sprite {
  private amount: number = 10;
  private attractSpeed: number = 400;
  private isAttracted: boolean = false;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'exp');
  }

  spawn(x: number, y: number) {
    this.enableBody(true, x, y, true, true);
    this.isAttracted = false;
    this.setVelocity(0, 0);
  }

  attract(player: Phaser.GameObjects.Components.Transform) {
    if (this.isAttracted) return;
    this.isAttracted = true;
    this.scene.physics.moveToObject(this, player, this.attractSpeed);
  }

  getAmount() {
    return this.amount;
  }

  collect() {
    this.disableBody(true, true);
  }
}
