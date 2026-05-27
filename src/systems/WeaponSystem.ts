import Phaser from 'phaser';
import { Projectile } from '../entities/Projectile';
import { Monster } from '../entities/Monster';
import { Boss } from '../entities/Boss';
import { WeaponData, weapons, WeaponKey, PassiveKey } from '../data/GameData';

export class WeaponSystem {
  private player: Phaser.GameObjects.Components.Transform;
  private monsters: Phaser.Physics.Arcade.Group;
  private bosses: Phaser.Physics.Arcade.Group;
  private projectiles: Phaser.Physics.Arcade.Group;
  private attackTimer: number = 0;
  private ownedWeapons = new Map<WeaponKey, number>([['dark_orb', 1]]);
  private ownedPassives = new Map<PassiveKey, number>();
  private cooldownMultiplier = 1;

  constructor(
    scene: Phaser.Scene,
    player: Phaser.GameObjects.Components.Transform,
    monsters: Phaser.Physics.Arcade.Group,
    bosses: Phaser.Physics.Arcade.Group,
  ) {
    this.player = player;
    this.monsters = monsters;
    this.bosses = bosses;
    this.projectiles = scene.physics.add.group({
      classType: Projectile,
      maxSize: 100,
      runChildUpdate: true
    });

    // Collision handling
    scene.physics.add.overlap(this.projectiles, this.monsters, (p, m) => {
      const projectile = p as Projectile;
      const monster = m as Monster;
      monster.takeDamage(projectile.getDamage());
      projectile.deactivate();
    });

    scene.physics.add.overlap(this.projectiles, this.bosses, (p, b) => {
      const projectile = p as Projectile;
      const boss = b as Boss;
      boss.takeDamage(projectile.getDamage());
      projectile.deactivate();
    });
  }

  update(_time: number, delta: number) {
    this.attackTimer += delta;
    const activeWeapon = this.getPrimaryWeapon();
    const attackInterval = Math.max(120, activeWeapon.cooldownMs * this.cooldownMultiplier);
    if (this.attackTimer >= attackInterval) {
      this.attackTimer = 0;
      this.fireClosest(activeWeapon);
    }
  }

  addWeapon(key: WeaponKey) {
    const currentLevel = this.ownedWeapons.get(key) ?? 0;
    if (currentLevel >= 8) return;
    this.ownedWeapons.set(key, currentLevel + 1);
  }

  addPassive(key: PassiveKey) {
    const currentLevel = this.ownedPassives.get(key) ?? 0;
    if (currentLevel >= 5) return;
    this.ownedPassives.set(key, currentLevel + 1);
    if (key === 'clock') {
      this.cooldownMultiplier = Math.max(0.55, 1 - (currentLevel + 1) * 0.07);
    }
  }

  getLoadoutSummary() {
    const weaponText = [...this.ownedWeapons.entries()]
      .map(([key, level]) => `${weapons.find((weapon) => weapon.key === key)?.name ?? key} Lv.${level}`)
      .join(' / ');
    const passiveText = [...this.ownedPassives.entries()]
      .map(([key, level]) => `${key} Lv.${level}`)
      .join(' / ');
    return { weaponText, passiveText };
  }

  private getPrimaryWeapon(): WeaponData {
    const [key, level] = [...this.ownedWeapons.entries()][0];
    const data = weapons.find((weapon) => weapon.key === key) ?? weapons[0];
    return {
      ...data,
      baseDamage: data.baseDamage + (level - 1) * 4,
      cooldownMs: data.cooldownMs * Math.max(0.65, 1 - (level - 1) * 0.045),
    };
  }

  private fireClosest(weapon: WeaponData) {
    let targetX = 0;
    let targetY = 0;
    let hasTarget = false;
    let minDistance = Infinity;

    const candidates = [...this.monsters.getChildren(), ...this.bosses.getChildren()];
    candidates.forEach((target) => {
      const sprite = target as Phaser.Physics.Arcade.Sprite;
      if (!sprite.active) return;

      const distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, sprite.x, sprite.y);
      if (distance < minDistance) {
        minDistance = distance;
        targetX = sprite.x;
        targetY = sprite.y;
        hasTarget = true;
      }
    });

    if (hasTarget) {
      const projectile = this.projectiles.get() as Projectile;
      if (projectile) {
        projectile.fire(
          this.player.x,
          this.player.y,
          new Phaser.Math.Vector2(targetX, targetY),
          weapon.baseDamage,
          weapon.projectileSpeed,
          weapon.color,
        );
      }
    }
  }
}
