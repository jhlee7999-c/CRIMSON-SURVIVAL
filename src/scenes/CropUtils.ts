import Phaser from 'phaser';

export function createCroppedTexture(
  scene: Phaser.Scene,
  sourceKey: string,
  textureKey: string,
  x: number,
  y: number,
  width: number,
  height: number,
) {
  if (scene.textures.exists(textureKey)) return;

  const source = scene.textures.get(sourceKey).getSourceImage() as HTMLImageElement;
  const texture = scene.textures.createCanvas(textureKey, width, height);
  const context = texture?.getContext();
  if (!texture || !context) return;

  context.drawImage(source, x, y, width, height, 0, 0, width, height);
  texture.refresh();
}

export function gothicText(size: number, color: string): Phaser.Types.GameObjects.Text.TextStyle {
  return {
    fontFamily: 'Georgia, "Times New Roman", serif',
    fontSize: `${size}px`,
    color,
    shadow: { offsetX: 1, offsetY: 1, color: '#000000', blur: 3, fill: true },
  };
}

export function createGothicButton(
  scene: Phaser.Scene,
  x: number,
  y: number,
  width: number,
  height: number,
  label: string,
  callback: () => void,
) {
  const container = scene.add.container(x, y);
  const fill = scene.add.rectangle(0, 0, width, height, 0x12070b, 0.86)
    .setStrokeStyle(1, 0xb56b2c, 1)
    .setInteractive({ useHandCursor: true });
  const text = scene.add.text(0, 0, label, gothicText(Math.min(20, Math.floor(height * 0.45)), '#f8d893')).setOrigin(0.5);
  const leftGem = scene.add.polygon(-width / 2 + 14, 0, [0, -5, 5, 0, 0, 5, -5, 0], 0x8f1824);
  const rightGem = scene.add.polygon(width / 2 - 14, 0, [0, -5, 5, 0, 0, 5, -5, 0], 0x8f1824);

  container.add([fill, leftGem, rightGem, text]);

  fill.on('pointerover', () => {
    scene.tweens.add({ targets: container, scaleX: 1.04, scaleY: 1.04, duration: 90, ease: 'Quad.easeOut' });
    fill.setFillStyle(0x1f0b12, 0.96);
    fill.setStrokeStyle(1, 0xf0a84a, 1);
  });
  fill.on('pointerout', () => {
    scene.tweens.add({ targets: container, scaleX: 1, scaleY: 1, y, duration: 90, ease: 'Quad.easeOut' });
    fill.setFillStyle(0x12070b, 0.86);
    fill.setStrokeStyle(1, 0xb56b2c, 1);
  });
  fill.on('pointerdown', () => {
    scene.tweens.add({ targets: container, y: y + 3, duration: 55, ease: 'Quad.easeOut' });
    fill.setFillStyle(0x3a1118, 1);
  });
  fill.on('pointerup', () => {
    scene.tweens.add({ targets: container, y, duration: 70, ease: 'Quad.easeOut' });
    callback();
  });

  return container;
}
