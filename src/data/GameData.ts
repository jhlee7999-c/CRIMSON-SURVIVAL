export type DifficultyKey = 'NORMAL' | 'NIGHTMARE' | 'DEMON';
export type WeaponKey =
  | 'dark_orb'
  | 'bat_swarm'
  | 'lightning_book'
  | 'death_scythe'
  | 'cursed_garlic'
  | 'ice_crystal'
  | 'holy_water'
  | 'ghost_candle';
export type PassiveKey =
  | 'grimoire'
  | 'black_heart'
  | 'clock'
  | 'candelabra'
  | 'bat_wings'
  | 'iron_cross'
  | 'blood_chalice'
  | 'golden_crown';

export interface DifficultyData {
  key: DifficultyKey;
  name: string;
  mapName: string;
  spawnMultiplier: number;
  enemyHpMultiplier: number;
  enemySpeedMultiplier: number;
  corruptionSpeed: number;
  palette: {
    ground: number;
    fog: number;
    accent: number;
  };
}

export interface WeaponData {
  key: WeaponKey;
  name: string;
  role: string;
  maxLevel: number;
  baseDamage: number;
  cooldownMs: number;
  projectileSpeed: number;
  color: number;
  evolvedName?: string;
  evolutionPassive?: PassiveKey;
}

export interface PassiveData {
  key: PassiveKey;
  name: string;
  effect: string;
  maxLevel: number;
}

export interface BossData {
  minute: number;
  name: string;
  hp: number;
  speed: number;
  color: number;
  pattern: 'charge' | 'bullet' | 'reaper';
}

export const difficulties: Record<DifficultyKey, DifficultyData> = {
  NORMAL: {
    key: 'NORMAL',
    name: '붉은 밤',
    mapName: '공동묘지',
    spawnMultiplier: 1,
    enemyHpMultiplier: 1,
    enemySpeedMultiplier: 1,
    corruptionSpeed: 1,
    palette: { ground: 0x101827, fog: 0x21314f, accent: 0x8a1c2a },
  },
  NIGHTMARE: {
    key: 'NIGHTMARE',
    name: '피의 달',
    mapName: '붉은 성',
    spawnMultiplier: 1.35,
    enemyHpMultiplier: 1.25,
    enemySpeedMultiplier: 1.1,
    corruptionSpeed: 1.1,
    palette: { ground: 0x190b16, fog: 0x401320, accent: 0xd13b46 },
  },
  DEMON: {
    key: 'DEMON',
    name: '종말',
    mapName: '종말의 성역',
    spawnMultiplier: 1.8,
    enemyHpMultiplier: 1.5,
    enemySpeedMultiplier: 1.2,
    corruptionSpeed: 1.2,
    palette: { ground: 0x130708, fog: 0x4f0808, accent: 0xff3a1c },
  },
};

export const weapons: WeaponData[] = [
  {
    key: 'dark_orb',
    name: '암흑 구체',
    role: '가장 가까운 적 자동 추적',
    maxLevel: 8,
    baseDamage: 14,
    cooldownMs: 760,
    projectileSpeed: 430,
    color: 0xb947ff,
  },
  {
    key: 'bat_swarm',
    name: '박쥐 떼',
    role: '흡혈형 다중 투사체',
    maxLevel: 8,
    baseDamage: 8,
    cooldownMs: 980,
    projectileSpeed: 360,
    color: 0x7e1228,
    evolvedName: '흡혈 군단',
    evolutionPassive: 'blood_chalice',
  },
  {
    key: 'lightning_book',
    name: '번개서',
    role: '폭딜 낙뢰',
    maxLevel: 8,
    baseDamage: 22,
    cooldownMs: 1250,
    projectileSpeed: 700,
    color: 0x83d7ff,
    evolvedName: '천벌 폭풍',
    evolutionPassive: 'clock',
  },
  {
    key: 'death_scythe',
    name: '사신의 낫',
    role: '근접 회전 베기',
    maxLevel: 8,
    baseDamage: 26,
    cooldownMs: 1120,
    projectileSpeed: 300,
    color: 0xe7e4dc,
    evolvedName: '월식의 대낫',
    evolutionPassive: 'black_heart',
  },
  { key: 'cursed_garlic', name: '저주 마늘', role: '생존 오라', maxLevel: 8, baseDamage: 5, cooldownMs: 300, projectileSpeed: 0, color: 0xb4d77a },
  { key: 'ice_crystal', name: '얼음 수정', role: '빙결 감속', maxLevel: 8, baseDamage: 11, cooldownMs: 900, projectileSpeed: 390, color: 0x8ae8ff },
  { key: 'holy_water', name: '성수병', role: '장판 피해', maxLevel: 8, baseDamage: 16, cooldownMs: 1400, projectileSpeed: 250, color: 0xfff2a6 },
  { key: 'ghost_candle', name: '유령 촛불', role: '화상 지속 피해', maxLevel: 8, baseDamage: 10, cooldownMs: 840, projectileSpeed: 330, color: 0xff7a2f },
];

export const passives: PassiveData[] = [
  { key: 'grimoire', name: '마도서', effect: '투사체 +1', maxLevel: 5 },
  { key: 'black_heart', name: '검은 심장', effect: '치명타 확률 증가', maxLevel: 5 },
  { key: 'clock', name: '시계', effect: '쿨다운 감소', maxLevel: 5 },
  { key: 'candelabra', name: '촛대', effect: '범위 증가', maxLevel: 5 },
  { key: 'bat_wings', name: '박쥐 날개', effect: '이동속도 증가', maxLevel: 5 },
  { key: 'iron_cross', name: '철십자가', effect: '피해 감소', maxLevel: 5 },
  { key: 'blood_chalice', name: '흡혈 성배', effect: '회복량 증가', maxLevel: 5 },
  { key: 'golden_crown', name: '황금 왕관', effect: '경험치 획득 증가', maxLevel: 5 },
];

export const bosses: BossData[] = [
  { minute: 10, name: '거대 박쥐', hp: 420, speed: 88, color: 0x8d2130, pattern: 'charge' },
  { minute: 20, name: '붉은 백작', hp: 920, speed: 72, color: 0xd43f52, pattern: 'bullet' },
  { minute: 30, name: '사신', hp: 1800, speed: 105, color: 0x111111, pattern: 'reaper' },
];

