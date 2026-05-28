import { STEMS, BRANCHES } from './constants.js';
// Source for all branch/stem interaction tables: standard classical BaZi references
// (三命通会, 渊海子平). Special star tables in constants.js use the same sources.
// Keep tables in these two files only — do not duplicate or derive in components.

// ─── BRANCH INTERACTIONS ────────────────────────────────────────────────────

const SIX_COMBINATIONS = [
  { pair: [0, 1],  element: 'Earth', name: '子丑合' },
  { pair: [2, 11], element: 'Wood',  name: '寅亥合' },
  { pair: [3, 10], element: 'Fire',  name: '卯戌合' },
  { pair: [4, 9],  element: 'Metal', name: '辰酉合' },
  { pair: [5, 8],  element: 'Water', name: '巳申合' },
  { pair: [6, 7],  element: 'Earth', name: '午未合' },
];

const THREE_COMBINATIONS = [
  { triplet: [8, 0, 4],  element: 'Water', name: '申子辰' },
  { triplet: [2, 6, 10], element: 'Fire',  name: '寅午戌' },
  { triplet: [11, 3, 7], element: 'Wood',  name: '亥卯未' },
  { triplet: [5, 9, 1],  element: 'Metal', name: '巳酉丑' },
];

const HARMS_PAIRS = [
  { pair: [0, 7],  name: '子未害' },
  { pair: [1, 6],  name: '丑午害' },
  { pair: [2, 5],  name: '寅巳害' },
  { pair: [3, 4],  name: '卯辰害' },
  { pair: [8, 11], name: '申亥害' },
  { pair: [9, 10], name: '酉戌害' },
];

// 六破 (Six Breaks): pairs of branches that "break" each other
const BREAK_PAIRS = [
  { pair: [0, 9],  name: '子酉破' },
  { pair: [1, 4],  name: '丑辰破' },
  { pair: [3, 6],  name: '卯午破' },
  { pair: [2, 11], name: '寅亥破' },
  { pair: [8, 5],  name: '申巳破' },
  { pair: [7, 10], name: '未戌破' },
];

// 三刑 (Three Punishments)
// Type 1 — 持势刑 (Dominating): cycle 寅→巳→申→寅
const PUNISHMENT_TRIPLE_1 = { branches: [2, 5, 8], name: '寅巳申刑', type: '持势刑', typePinyin: 'Chíshì xíng', typeEnglish: 'Dominating Punishment' };
// Type 2 — 无礼刑 (Unruly): cycle 丑→戌→未→丑
const PUNISHMENT_TRIPLE_2 = { branches: [1, 10, 7], name: '丑戌未刑', type: '无礼刑', typePinyin: 'Wúlǐ xíng', typeEnglish: 'Unruly Punishment' };
// Type 3 — 无恩刑 (Ungrateful): mutual 子↔卯
const PUNISHMENT_MUTUAL = { pair: [0, 3], name: '子卯刑', type: '无恩刑', typePinyin: 'Wúēn xíng', typeEnglish: 'Ungrateful Punishment' };
// Type 4 — 自刑 (Self-punishment): branch appears in multiple pillars
const SELF_PUNISHMENT_BRANCHES = new Set([4, 6, 9, 11]); // 辰, 午, 酉, 亥

export function findBranchInteractions(branchIndices) {
  const results = [];
  const branches = branchIndices;
  const pillarNames = ['Year', 'Month', 'Day', 'Hour'];

  function pillarsWithBranch(bi) {
    return branches.map((b, i) => b === bi ? pillarNames[i] : null).filter(Boolean);
  }

  // Six Combinations 六合
  for (const { pair, element, name } of SIX_COMBINATIONS) {
    const [a, b] = pair;
    if (branches.includes(a) && branches.includes(b)) {
      results.push({
        type: '六合', typePinyin: 'Liùhé', typeEnglish: 'Six Combination',
        name, branches: [BRANCHES[a].char, BRANCHES[b].char],
        pillars: [...pillarsWithBranch(a), ...pillarsWithBranch(b)],
        element, effect: `Combines toward ${element}`,
      });
    }
  }

  // Three Combinations 三合 and Half Combinations 半合
  for (const { triplet, element, name } of THREE_COMBINATIONS) {
    const has = triplet.map(bi => branches.includes(bi));
    const count = has.filter(Boolean).length;
    if (count === 3) {
      results.push({
        type: '三合', typePinyin: 'Sānhé', typeEnglish: 'Three Combination',
        name, branches: triplet.map(bi => BRANCHES[bi].char),
        pillars: triplet.flatMap(bi => pillarsWithBranch(bi)),
        element, effect: `Full ${element} frame`,
      });
    } else if (count === 2) {
      const present = triplet.filter((_, i) => has[i]);
      results.push({
        type: '半合', typePinyin: 'Bànhé', typeEnglish: 'Half Combination',
        name: present.map(bi => BRANCHES[bi].char).join('') + '半合',
        branches: present.map(bi => BRANCHES[bi].char),
        pillars: present.flatMap(bi => pillarsWithBranch(bi)),
        element, effect: `Partial ${element} frame`,
      });
    }
  }

  // Six Clashes 六冲
  for (let i = 0; i < branches.length; i++) {
    for (let j = i + 1; j < branches.length; j++) {
      if (Math.abs(branches[i] - branches[j]) === 6) {
        const a = branches[i], b = branches[j];
        results.push({
          type: '六冲', typePinyin: 'Liùchōng', typeEnglish: 'Six Clash',
          name: BRANCHES[a].char + BRANCHES[b].char + '冲',
          branches: [BRANCHES[a].char, BRANCHES[b].char],
          pillars: [pillarNames[i], pillarNames[j]],
          element: null, effect: 'Clashes and destabilises',
        });
      }
    }
  }

  // Six Harms 相害
  for (const { pair, name } of HARMS_PAIRS) {
    const [a, b] = pair;
    if (branches.includes(a) && branches.includes(b)) {
      results.push({
        type: '相害', typePinyin: 'Xiānghài', typeEnglish: 'Six Harm',
        name, branches: [BRANCHES[a].char, BRANCHES[b].char],
        pillars: [...pillarsWithBranch(a), ...pillarsWithBranch(b)],
        element: null, effect: 'Undermines and weakens',
      });
    }
  }

  // Six Breaks 六破
  for (const { pair, name } of BREAK_PAIRS) {
    const [a, b] = pair;
    if (branches.includes(a) && branches.includes(b)) {
      results.push({
        type: '六破', typePinyin: 'Liùpò', typeEnglish: 'Six Break',
        name, branches: [BRANCHES[a].char, BRANCHES[b].char],
        pillars: [...pillarsWithBranch(a), ...pillarsWithBranch(b)],
        element: null, effect: 'Disrupts and erodes',
      });
    }
  }

  // Three Punishments 三刑
  for (const { branches: g, name, type, typePinyin, typeEnglish } of [PUNISHMENT_TRIPLE_1, PUNISHMENT_TRIPLE_2]) {
    const present = g.filter(bi => branches.includes(bi));
    if (present.length >= 2) {
      results.push({
        type, typePinyin, typeEnglish,
        name: present.map(bi => BRANCHES[bi].char).join('') + '刑',
        branches: present.map(bi => BRANCHES[bi].char),
        pillars: present.flatMap(bi => pillarsWithBranch(bi)),
        element: null,
        effect: present.length === 3 ? 'Full triple punishment' : 'Partial punishment (2 of 3)',
      });
    }
  }

  // Mutual Punishment 无恩刑
  const [pa, pb] = PUNISHMENT_MUTUAL.pair;
  if (branches.includes(pa) && branches.includes(pb)) {
    results.push({
      type: PUNISHMENT_MUTUAL.type,
      typePinyin: PUNISHMENT_MUTUAL.typePinyin,
      typeEnglish: PUNISHMENT_MUTUAL.typeEnglish,
      name: PUNISHMENT_MUTUAL.name,
      branches: [BRANCHES[pa].char, BRANCHES[pb].char],
      pillars: [...pillarsWithBranch(pa), ...pillarsWithBranch(pb)],
      element: null, effect: 'Mutual punishment',
    });
  }

  // Self-punishment 自刑 (same branch in two or more pillars)
  const seen = new Map();
  branches.forEach((bi, i) => {
    if (!seen.has(bi)) seen.set(bi, []);
    seen.get(bi).push(pillarNames[i]);
  });
  for (const [bi, pls] of seen.entries()) {
    if (pls.length >= 2 && SELF_PUNISHMENT_BRANCHES.has(bi)) {
      results.push({
        type: '自刑', typePinyin: 'Zìxíng', typeEnglish: 'Self-Punishment',
        name: BRANCHES[bi].char + '自刑',
        branches: [BRANCHES[bi].char],
        pillars: pls,
        element: null, effect: 'Branch punishes itself',
      });
    }
  }

  return results;
}

// ─── STEM COMBINATIONS ──────────────────────────────────────────────────────
// 天干合 (Tiāngān hé) — Five Stem Combinations.
// Source: standard Ten Stems pairing table.
// Note on 化 (transformation): a combination may transform to produce the
// combined element when that element is dominant in the seasonal month. This
// requires chart-context judgment and is NOT auto-computed here. The
// `transforms` flag is always false until a seasonal weighting layer is added.

const STEM_COMBINATION_TABLE = [
  { pair: [0, 5], element: 'Earth', name: '甲己合' },  // 甲+己→Earth
  { pair: [1, 6], element: 'Metal', name: '乙庚合' },  // 乙+庚→Metal
  { pair: [2, 7], element: 'Water', name: '丙辛合' },  // 丙+辛→Water
  { pair: [3, 8], element: 'Wood',  name: '丁壬合' },  // 丁+壬→Wood
  { pair: [4, 9], element: 'Fire',  name: '戊癸合' },  // 戊+癸→Fire
];

export function findStemCombinations(stemIndices) {
  const results = [];
  const pillarNames = ['Year', 'Month', 'Day', 'Hour'];

  function pillarsWithStem(si) {
    return stemIndices.map((s, i) => s === si ? pillarNames[i] : null).filter(Boolean);
  }

  for (const { pair, element, name } of STEM_COMBINATION_TABLE) {
    const [a, b] = pair;
    if (stemIndices.includes(a) && stemIndices.includes(b)) {
      results.push({
        type: '天干合',
        typePinyin: 'Tiāngān hé',
        typeEnglish: 'Stem Combination',
        name,
        stems: [STEMS[a].char, STEMS[b].char],
        pillars: [...pillarsWithStem(a), ...pillarsWithStem(b)],
        combinedElement: element,
        transforms: false, // requires seasonal weighting to determine
        effect: `Combines toward ${element}; transformation requires seasonal support`,
      });
    }
  }

  return results;
}
