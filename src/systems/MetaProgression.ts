export interface MetaSaveData {
  bloodCoin: number;
  upgrades: Record<string, number>;
}

const SAVE_KEY = 'crimson-survival-meta';

export class MetaProgression {
  private data: MetaSaveData = {
    bloodCoin: 0,
    upgrades: {
      maxHp: 0,
      attack: 0,
      moveSpeed: 0,
      expGain: 0,
      starterWeapon: 0,
    },
  };

  load() {
    const raw = window.localStorage.getItem(SAVE_KEY);
    if (!raw) return this.data;

    try {
      const parsed = JSON.parse(raw) as MetaSaveData;
      this.data = {
        bloodCoin: Math.max(0, parsed.bloodCoin ?? 0),
        upgrades: { ...this.data.upgrades, ...(parsed.upgrades ?? {}) },
      };
    } catch {
      this.save();
    }
    return this.data;
  }

  addBloodCoin(amount: number) {
    this.data.bloodCoin += Math.max(0, Math.floor(amount));
    this.save();
  }

  buyUpgrade(key: keyof MetaSaveData['upgrades']) {
    const currentLevel = this.data.upgrades[key] ?? 0;
    const cap = key === 'starterWeapon' ? 1 : 5;
    if (currentLevel >= cap) return false;

    const cost = 120 * (currentLevel + 1);
    if (this.data.bloodCoin < cost) return false;

    this.data.bloodCoin -= cost;
    this.data.upgrades[key] = currentLevel + 1;
    this.save();
    return true;
  }

  getData() {
    return this.data;
  }

  private save() {
    window.localStorage.setItem(SAVE_KEY, JSON.stringify(this.data));
  }
}

