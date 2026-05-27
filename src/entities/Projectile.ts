import Phaser from 'phaser';

export class Projectile extends Phaser.Physics.Arcade.Sprite {
  private damage: number = 10;
  private speed: number = 400;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'dark-orb');
    this.setTint(0xff0000);
  }

  fire(x: number, y: number, target: Phaser.Math.Vector2, damage: number, speed: number, color: number) {
    this.enableBody(true, x, y, true, true);
    this.damage = damage;
    this.speed = speed;
    this.setTint(color);
    
    const angle = Phaser.Math.Angle.Between(x, y, target.x, target.y);
    this.setRotation(angle);
    
    const velocity = new Phaser.Math.Vector2();
    this.scene.physics.velocityFromRotation(angle, this.speed, velocity);
    this.setVelocity(velocity.x, velocity.y);
  }

  getDamage() {
    return this.damage;
  }

  deactivate() {
    this.disableBody(true, true);
  }
}
