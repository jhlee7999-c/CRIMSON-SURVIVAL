import Phaser from 'phaser';

export class Player extends Phaser.Physics.Arcade.Sprite {
  private moveSpeed: number = 200;
  private acceleration: number = 1000;
  private drag: number = 800;
  private demonStage: number = 0;

  constructor(scene: Phaser.Scene, x: number, y: number, textureKey: string = 'player') {
    super(scene, x, y, scene.textures.exists(textureKey) ? textureKey : 'player');
    
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setCollideWorldBounds(true);
    this.setDrag(this.drag);
    this.setMaxVelocity(this.moveSpeed);
  }

  update(cursors: Phaser.Types.Input.Keyboard.CursorKeys & Record<string, Phaser.Input.Keyboard.Key>) {
    let moveX = 0;
    let moveY = 0;

    if (cursors.left.isDown || cursors.A?.isDown) moveX = -1;
    else if (cursors.right.isDown || cursors.D?.isDown) moveX = 1;

    if (cursors.up.isDown || cursors.W?.isDown) moveY = -1;
    else if (cursors.down.isDown || cursors.S?.isDown) moveY = 1;

    const vector = new Phaser.Math.Vector2(moveX, moveY).normalize().scale(this.acceleration);
    this.setAcceleration(vector.x, vector.y);

    if (moveX < 0) this.setFlipX(true);
    else if (moveX > 0) this.setFlipX(false);

    if (vector.length() > 0) {
      this.play('run', true);
    } else {
      this.play('idle', true);
    }
  }

  applyMoveSpeedBonus(level: number) {
    this.setMaxVelocity(this.moveSpeed + level * 18);
  }

  setDemonStage(stage: number) {
    this.demonStage = stage;
    this.updateAppearance();
  }

  private updateAppearance() {
    switch(this.demonStage) {
      case 0: this.setTint(0xffffff); this.setScale(1); break;
      case 1: this.setTint(0xffaaaa); break;
      case 2: this.setTint(0xff7777); this.setScale(1.1); break;
      case 3: this.setTint(0xff4444); break;
      case 4: this.setTint(0xff2222); this.setScale(1.2); break;
      case 5: this.setTint(0xff0000); this.setScale(1.3); break;
      case 6: this.setTint(0x111111); this.setScale(1.5); break;
    }
  }
}
