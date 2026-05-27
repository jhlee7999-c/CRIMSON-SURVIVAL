import Phaser from 'phaser';
import { MainMenuScene } from './scenes/MainMenuScene';
import { CharacterSelectScene } from './scenes/CharacterSelectScene';
import { MetaUpgradeScene } from './scenes/MetaUpgradeScene';
import { SettingsScene } from './scenes/SettingsScene';
import { PauseScene } from './scenes/PauseScene';
import { ResultScene } from './scenes/ResultScene';
import { GameScene } from './scenes/GameScene';
import { UIScene } from './scenes/UIScene';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 1280,
  height: 720,
  parent: 'game',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 0 },
      debug: false
    }
  },
  scene: [MainMenuScene, CharacterSelectScene, MetaUpgradeScene, SettingsScene, GameScene, UIScene, PauseScene, ResultScene],
  pixelArt: true,
  antialias: false,
};

new Phaser.Game(config);
