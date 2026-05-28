export const STEMS = [
  { char: '甲', pinyin: 'Jiǎ', english: 'Yang Wood',  element: 'Wood',  polarity: 'yang' },
  { char: '乙', pinyin: 'Yǐ',  english: 'Yin Wood',   element: 'Wood',  polarity: 'yin'  },
  { char: '丙', pinyin: 'Bǐng', english: 'Yang Fire',  element: 'Fire',  polarity: 'yang' },
  { char: '丁', pinyin: 'Dīng', english: 'Yin Fire',   element: 'Fire',  polarity: 'yin'  },
  { char: '戊', pinyin: 'Wù',  english: 'Yang Earth', element: 'Earth', polarity: 'yang' },
  { char: '己', pinyin: 'Jǐ',  english: 'Yin Earth',  element: 'Earth', polarity: 'yin'  },
  { char: '庚', pinyin: 'Gēng', english: 'Yang Metal', element: 'Metal', polarity: 'yang' },
  { char: '辛', pinyin: 'Xīn', english: 'Yin Metal',  element: 'Metal', polarity: 'yin'  },
  { char: '壬', pinyin: 'Rén', english: 'Yang Water', element: 'Water', polarity: 'yang' },
  { char: '癸', pinyin: 'Guǐ', english: 'Yin Water',  element: 'Water', polarity: 'yin'  },
];

export const BRANCHES = [
  { char: '子', pinyin: 'Zǐ',   english: 'Rat',     element: 'Water', polarity: 'yang' },
  { char: '丑', pinyin: 'Chǒu', english: 'Ox',      element: 'Earth', polarity: 'yin'  },
  { char: '寅', pinyin: 'Yín',  english: 'Tiger',   element: 'Wood',  polarity: 'yang' },
  { char: '卯', pinyin: 'Mǎo',  english: 'Rabbit',  element: 'Wood',  polarity: 'yin'  },
  { char: '辰', pinyin: 'Chén', english: 'Dragon',  element: 'Earth', polarity: 'yang' },
  { char: '巳', pinyin: 'Sì',   english: 'Snake',   element: 'Fire',  polarity: 'yin'  },
  { char: '午', pinyin: 'Wǔ',   english: 'Horse',   element: 'Fire',  polarity: 'yang' },
  { char: '未', pinyin: 'Wèi',  english: 'Goat',    element: 'Earth', polarity: 'yin'  },
  { char: '申', pinyin: 'Shēn', english: 'Monkey',  element: 'Metal', polarity: 'yang' },
  { char: '酉', pinyin: 'Yǒu',  english: 'Rooster', element: 'Metal', polarity: 'yin'  },
  { char: '戌', pinyin: 'Xū',   english: 'Dog',     element: 'Earth', polarity: 'yang' },
  { char: '亥', pinyin: 'Hài',  english: 'Pig',     element: 'Water', polarity: 'yin'  },
];

// Hidden stems (藏干) per branch: [{stemIdx, position, weight}]
// Positions: 'main' (本气 0.6), 'middle' (中气 0.3), 'residual' (余气 0.1)
export const HIDDEN_STEMS = [
  // 子
  [{ stemIdx: 9, position: 'main', weight: 0.6 }],
  // 丑
  [{ stemIdx: 5, position: 'main', weight: 0.6 }, { stemIdx: 9, position: 'middle', weight: 0.3 }, { stemIdx: 7, position: 'residual', weight: 0.1 }],
  // 寅
  [{ stemIdx: 0, position: 'main', weight: 0.6 }, { stemIdx: 2, position: 'middle', weight: 0.3 }, { stemIdx: 4, position: 'residual', weight: 0.1 }],
  // 卯
  [{ stemIdx: 1, position: 'main', weight: 0.6 }],
  // 辰
  [{ stemIdx: 4, position: 'main', weight: 0.6 }, { stemIdx: 1, position: 'middle', weight: 0.3 }, { stemIdx: 9, position: 'residual', weight: 0.1 }],
  // 巳
  [{ stemIdx: 2, position: 'main', weight: 0.6 }, { stemIdx: 6, position: 'middle', weight: 0.3 }, { stemIdx: 4, position: 'residual', weight: 0.1 }],
  // 午
  [{ stemIdx: 3, position: 'main', weight: 0.6 }, { stemIdx: 5, position: 'middle', weight: 0.3 }],
  // 未
  [{ stemIdx: 5, position: 'main', weight: 0.6 }, { stemIdx: 3, position: 'middle', weight: 0.3 }, { stemIdx: 1, position: 'residual', weight: 0.1 }],
  // 申
  [{ stemIdx: 6, position: 'main', weight: 0.6 }, { stemIdx: 8, position: 'middle', weight: 0.3 }, { stemIdx: 4, position: 'residual', weight: 0.1 }],
  // 酉
  [{ stemIdx: 7, position: 'main', weight: 0.6 }],
  // 戌
  [{ stemIdx: 4, position: 'main', weight: 0.6 }, { stemIdx: 7, position: 'middle', weight: 0.3 }, { stemIdx: 3, position: 'residual', weight: 0.1 }],
  // 亥
  [{ stemIdx: 8, position: 'main', weight: 0.6 }, { stemIdx: 0, position: 'middle', weight: 0.3 }],
];

// Five Tigers (五虎遁年起月法): 寅 month stem index for each year-stem group (yearStemIdx % 5)
// 甲/己→丙(2), 乙/庚→戊(4), 丙/辛→庚(6), 丁/壬→壬(8), 戊/癸→甲(0)
export const MONTH_STEM_BASE = [2, 4, 6, 8, 0];

// Five Rats (五鼠遁日起时法): 子 hour stem index for each day-stem group (dayStemIdx % 5)
// 甲/己→甲(0), 乙/庚→丙(2), 丙/辛→戊(4), 丁/壬→庚(6), 戊/癸→壬(8)
export const HOUR_STEM_BASE = [0, 2, 4, 6, 8];

// Production cycle: element → element it produces
export const PRODUCES = { Wood: 'Fire', Fire: 'Earth', Earth: 'Metal', Metal: 'Water', Water: 'Wood' };
// Control cycle: element → element it controls
export const CONTROLS = { Wood: 'Earth', Earth: 'Water', Water: 'Fire', Fire: 'Metal', Metal: 'Wood' };

// Ten Gods lookup: returns { char, pinyin, english } given relationship
// Keys: 'same_same' (same element, same polarity), 'same_diff', 'produces_same', 'produces_diff',
//       'controls_same', 'controls_diff', 'controlled_same', 'controlled_diff', 'produced_same', 'produced_diff'
export const TEN_GODS = {
  same_same:      { char: '比肩', pinyin: 'Bǐjiān',    english: 'Parallel',         group: 'sibling' },
  same_diff:      { char: '劫财', pinyin: 'Jiécái',    english: 'Competitor',        group: 'sibling' },
  produces_same:  { char: '食神', pinyin: 'Shíshén',   english: 'Eating God',        group: 'output'  },
  produces_diff:  { char: '伤官', pinyin: 'Shāngguān', english: 'Hurting Officer',   group: 'output'  },
  controls_same:  { char: '偏财', pinyin: 'Piāncái',   english: 'Indirect Wealth',   group: 'wealth'  },
  controls_diff:  { char: '正财', pinyin: 'Zhèngcái',  english: 'Direct Wealth',     group: 'wealth'  },
  controlledby_same: { char: '偏官', pinyin: 'Piānguān',  english: 'Seven Killings',    group: 'officer' },
  controlledby_diff: { char: '正官', pinyin: 'Zhèngguān', english: 'Direct Officer',    group: 'officer' },
  produced_same:  { char: '偏印', pinyin: 'Piānyìn',   english: 'Indirect Resource', group: 'resource' },
  produced_diff:  { char: '正印', pinyin: 'Zhèngyìn',  english: 'Direct Resource',   group: 'resource' },
};

// Special stars lookup tables

// 天乙贵人 (Heavenly Noble): day stem → branch indices
export const HEAVENLY_NOBLE = {
  0: [1, 7],   // 甲 → 丑, 未
  1: [0, 8],   // 乙 → 子, 申
  2: [11, 9],  // 丙 → 亥, 酉
  3: [11, 9],  // 丁 → 亥, 酉
  4: [1, 7],   // 戊 → 丑, 未
  5: [0, 8],   // 己 → 子, 申
  6: [1, 7],   // 庚 → 丑, 未
  7: [6, 2],   // 辛 → 午, 寅
  8: [5, 3],   // 壬 → 巳, 卯
  9: [5, 3],   // 癸 → 巳, 卯
};

// 文昌贵人 (Academic Star): day stem → branch index
export const ACADEMIC_STAR = {
  0: 5,   // 甲 → 巳
  1: 6,   // 乙 → 午
  2: 8,   // 丙 → 申
  3: 9,   // 丁 → 酉
  4: 8,   // 戊 → 申
  5: 9,   // 己 → 酉
  6: 11,  // 庚 → 亥
  7: 0,   // 辛 → 子
  8: 2,   // 壬 → 寅
  9: 3,   // 癸 → 卯
};

// Branch groups for 桃花, 驿马, 华盖
// Group key: which branches trigger the star (any one of these in year or day branch)
const BRANCH_GROUPS = [
  [8, 0, 4],   // 申子辰
  [2, 6, 10],  // 寅午戌
  [11, 3, 7],  // 亥卯未
  [5, 9, 1],   // 巳酉丑
];

// 桃花 (Peach Blossom): branch group → triggered branch
export const PEACH_BLOSSOM = [9, 3, 0, 6]; // 酉, 卯, 子, 午 for groups above

// 驿马 (Travelling Horse): branch group → triggered branch
export const TRAVELLING_HORSE = [2, 8, 5, 11]; // 寅, 申, 巳, 亥

// 华盖 (Canopy Star): branch group → triggered branch
export const CANOPY_STAR = [4, 10, 7, 1]; // 辰, 戌, 未, 丑

export function getBranchGroupIdx(branchIdx) {
  for (let i = 0; i < BRANCH_GROUPS.length; i++) {
    if (BRANCH_GROUPS[i].includes(branchIdx)) return i;
  }
  return -1;
}

// Hour branch display info: [branchIdx, timeRange]
export const HOUR_BRANCHES = [
  { branchIdx: 0,  timeRange: '23:00–01:00', lateLabel: '(use next day for 23:00–00:00)' },
  { branchIdx: 1,  timeRange: '01:00–03:00' },
  { branchIdx: 2,  timeRange: '03:00–05:00' },
  { branchIdx: 3,  timeRange: '05:00–07:00' },
  { branchIdx: 4,  timeRange: '07:00–09:00' },
  { branchIdx: 5,  timeRange: '09:00–11:00' },
  { branchIdx: 6,  timeRange: '11:00–13:00' },
  { branchIdx: 7,  timeRange: '13:00–15:00' },
  { branchIdx: 8,  timeRange: '15:00–17:00' },
  { branchIdx: 9,  timeRange: '17:00–19:00' },
  { branchIdx: 10, timeRange: '19:00–21:00' },
  { branchIdx: 11, timeRange: '21:00–23:00' },
];

export const ELEMENTS = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];

// SEASONAL MULTIPLIERS (future implementation)
// ─────────────────────────────────────────────
// When seasonal weighting is implemented, each element's effective contribution
// to the chart will be multiplied by SEASONAL_MULTIPLIERS[element][monthBranchIdx].
//
// monthBranchIdx: 0=子 1=丑 2=寅 3=卯 4=辰 5=巳 6=午 7=未 8=申 9=酉 10=戌 11=亥
//
// Season → status (旺相休囚死):
//   Spring 寅卯辰(2,3,4): Wood旺 Fire相 Water休 Metal囚 Earth死
//   Summer 巳午未(5,6,7): Fire旺 Earth相 Wood休 Water囚 Metal死
//   Autumn 申酉戌(8,9,10): Metal旺 Water相 Earth休 Fire囚 Wood死
//   Winter 亥子丑(11,0,1): Water旺 Wood相 Metal休 Earth囚 Fire死
//
// Suggested weight values: 旺=1.5 相=1.2 休=0.8 囚=0.7 死=0.5
// These are not yet applied in element balance calculations.
// To activate: multiply each hidden/surface stem contribution by the
// SEASONAL_MULTIPLIERS value for that stem's element and the birth month branch.
export const SEASONAL_MULTIPLIERS = {
  //              子    丑    寅    卯    辰    巳    午    未    申    酉    戌    亥
  Wood:  [0.8,  1.2,  1.5,  1.5,  1.5,  0.8,  0.8,  0.8,  0.5,  0.5,  0.5,  1.2],
  Fire:  [0.5,  0.5,  1.2,  1.2,  1.2,  1.5,  1.5,  1.5,  0.7,  0.7,  0.7,  0.5],
  Earth: [0.7,  0.7,  0.5,  0.5,  1.5,  1.2,  1.2,  1.5,  0.8,  0.8,  1.5,  0.7],
  Metal: [0.8,  0.8,  0.7,  0.7,  0.7,  0.5,  0.5,  0.5,  1.5,  1.5,  1.5,  0.8],
  Water: [1.5,  1.5,  0.8,  0.8,  0.8,  0.7,  0.7,  0.7,  1.2,  1.2,  1.2,  1.5],
};
export const ELEMENT_COLORS = {
  Wood:  'text-green-400',
  Fire:  'text-red-400',
  Earth: 'text-yellow-500',
  Metal: 'text-gray-300',
  Water: 'text-blue-400',
};
export const ELEMENT_BG = {
  Wood:  'bg-green-400',
  Fire:  'bg-red-400',
  Earth: 'bg-yellow-500',
  Metal: 'bg-gray-300',
  Water: 'bg-blue-400',
};

// Unified element UI tokens — hex colors, glow, bg, Chinese label
export const ELEM = {
  Wood:  { hex: '#6abf7a', glow: 'rgba(106,191,122,0.22)', bg: 'rgba(106,191,122,0.07)', zh: '木' },
  Fire:  { hex: '#d96b54', glow: 'rgba(217,107,84,0.22)',  bg: 'rgba(217,107,84,0.07)',  zh: '火' },
  Earth: { hex: '#c4913a', glow: 'rgba(196,145,58,0.22)',  bg: 'rgba(196,145,58,0.07)',  zh: '土' },
  Metal: { hex: '#9db0c2', glow: 'rgba(157,176,194,0.18)', bg: 'rgba(157,176,194,0.06)', zh: '金' },
  Water: { hex: '#5592b8', glow: 'rgba(85,146,184,0.22)',  bg: 'rgba(85,146,184,0.07)',  zh: '水' },
};
