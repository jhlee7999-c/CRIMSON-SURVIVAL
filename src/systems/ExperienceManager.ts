import Phaser from 'phaser';
import { ExperienceGem } from '../entities/ExperienceGem';

export class ExperienceManager {
  private scene: Phaser.Scene;
  private gems: Phaser.Physics.Arcade.Group;
  private player: Phaser.GameObjects.Components.Transform & Phaser.Physics.Arcade.Body;
  
  private currentExp: number = 0;
  private nextLevelExp: number = 100;
  private level: number = 1;
  private expMultiplier: number = 1;

  constructor(scene: Phaser.Scene, player: any) {
    this.scene = scene;
    this.player = player;
    this.gems = scene.physics.add.group({
      classType: ExperienceGem,
      maxSize: 1000
    });

    // Collection overlap
    scene.physics.add.overlap(this.player, this.gems, (_, g) => {
      const gem = g as ExperienceGem;
      this.collectGem(gem);
    });
  }

  spawnGem(x: number, y: number) {
    const gem = this.gems.get() as ExperienceGem;
    if (gem) {
      gem.spawn(x, y);
    }
  }

  update() {
    this.gems.getChildren().forEach((g) => {
      const gem = g as ExperienceGem;
      if (!gem.active) return;

      const distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, gem.x, gem.y);
      if (distance < 100) { // Attraction range
        gem.attract(this.player);
      }
    });
  }

  private collectGem(gem: ExperienceGem) {
    this.currentExp += Math.floor(gem.getAmount() * this.expMultiplier);
    gem.collect();

    this.scene.events.emit('expChange', this.currentExp / this.nextLevelExp);

    if (this.currentExp >= this.nextLevelExp) {
      this.levelUp();
    }
  }

  private levelUp() {
    this.level++;
    this.currentExp -= this.nextLevelExp;
    this.nextLevelExp = Math.floor(this.nextLevelExp * 1.2);
    
    this.scene.events.emit('expChange', this.currentExp / this.nextLevelExp);
    this.scene.events.emit('levelUp', this.level);
  }

  setExpBonus(level: number) {
    this.expMultiplier = 1 + level * 0.08;
  }
}
