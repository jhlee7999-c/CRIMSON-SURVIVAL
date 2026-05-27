import Phaser from 'phaser';

export class CorruptionSystem {
  private scene: Phaser.Scene;
  private currentStage: number = 0;
  private timer: number = 0;
  private overlay: Phaser.GameObjects.Rectangle;

  constructor(scene: Phaser.Scene, private stageInterval: number = 300000) {
    this.scene = scene;
    this.overlay = scene.add.rectangle(0, 0, 2000, 2000, 0xff0000, 0);
    this.overlay.setScrollFactor(0);
    this.overlay.setDepth(100);
  }

  update(_time: number, delta: number) {
    this.timer += delta;
    const newStage = Math.floor(this.timer / this.stageInterval);

    if (newStage > this.currentStage) {
      this.currentStage = newStage;
      this.applyCorruption(this.currentStage);
    }
  }

  private applyCorruption(stage: number) {
    console.log(`Corruption Level: ${stage}`);
    
    switch(stage) {
      case 1: this.overlay.setFillStyle(0xff0000, 0.1); break;
      case 2: this.overlay.setFillStyle(0xff0000, 0.2); break;
      case 3: this.overlay.setFillStyle(0xff0000, 0.3); break;
      case 4: this.overlay.setFillStyle(0xff0000, 0.4); break;
      case 5: this.overlay.setFillStyle(0xff0000, 0.5); break;
      case 6: 
        this.overlay.setFillStyle(0xff0000, 0.6);
        this.scene.cameras.main.shake(1000, 0.05);
        break;
    }

    this.scene.events.emit('corruptionChange', Math.min(stage, 6));
  }

  getStage() {
    return this.currentStage;
  }
}
