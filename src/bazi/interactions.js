import { BRANCHES, ELEMENTS } from './constants.js';

// Six Combinations 六合 (Liùhé): pairs → resulting element
const SIX_COMBINATIONS = [
  { pair: [0, 1],   element: 'Earth',  name: '子丑合' },
  { pair: [2, 11],  element: 'Wood',   name: '寅亥合' },
  { pair: [3, 10],  element: 'Fire',   name: '卯戌合' },
  { pair: [4, 9],   element: 'Metal',  name: '辰酉合' },
  { pair: [5, 8],   element: 'Water',  name: '巳申合' },
  { pair: [6, 7],   element: 'Earth',  name: '午未合' },
];

// Three Combinations 三合 (Sānhé): triplets → resulting element
const THREE_COMBINATIONS = [
  { triplet: [8, 0, 4],  element: 'Water', name: '申子辰' },
  { triplet: [2, 6, 10], element: 'Fire',  name: '寅午戌' },
  { triplet: [11, 3, 7], element: 'Wood',  name: '亥卯未' },
  { triplet: [5, 9, 1],  element: 'Metal', name: '巳酉丑' },
];

// Six Clashes 六冲 (Liùchōng): each branch clashes with the one 6 positions away
// Six Harms 相害 (Xiānghài)
const SIX_HARMS = [
  [0, 11],  // 子未 — wait, that's index 7; let me recheck
  // 子未, 丑午, 寅巳, 卯辰, 申亥, 酉戌
  // 子(0)未(7), 丑(1)午(6), 寅(2)巳(5), 卯(3)辰(4), 申(8)亥(11), 酉(9)戌(10)
];
const HARMS_PAIRS = [
  { pair: [0, 7],  name: '子未害' },
  { pair: [1, 6],  name: '丑午害' },
  { pair: [2, 5],  name: '寅巳害' },
  { pair: [3, 4],  name: '卯辰害' },
  { pair: [8, 11], name: '申亥害' },
  { pair: [9, 10], name: '酉戌害' },
];

export function findInteractions(branchIndices) {
  const results = [];
  const branches = branchIndices; // array of 4 indices [year, month, day, hour]
  const pillarNames = ['Year', 'Month', 'Day', 'Hour'];

  // Helper: find which pillars contain a given branch index
  function pillarsWithBranch(bi) {
    return branches
      .map((b, i) => (b === bi ? pillarNames[i] : null))
      .filter(Boolean);
  }

  // Six Combinations
  for (const { pair, element, name } of SIX_COMBINATIONS) {
    const [a, b] = pair;
    if (branches.includes(a) && branches.includes(b)) {
      results.push({
        type: '六合',
        typePinyin: 'Liùhé',
        typeEnglish: 'Six Combination',
        name,
        branches: [BRANCHES[a].char, BRANCHES[b].char],
        pillars: [...pillarsWithBranch(a), ...pillarsWithBranch(b)],
        element,
        effect: `Forms ${element}`,
      });
    }
  }

  // Three Combinations and Half Combinations
  for (const { triplet, element, name } of THREE_COMBINATIONS) {
    const [a, b, c] = triplet;
    const has = triplet.map(bi => branches.includes(bi));
    const count = has.filter(Boolean).length;

    if (count === 3) {
      results.push({
        type: '三合',
        typePinyin: 'Sānhé',
        typeEnglish: 'Three Combination',
        name,
        branches: triplet.map(bi => BRANCHES[bi].char),
        pillars: triplet.flatMap(bi => pillarsWithBranch(bi)),
        element,
        effect: `Full ${element} frame`,
      });
    } else if (count === 2) {
      const present = triplet.filter((_, i) => has[i]);
      results.push({
        type: '半合',
        typePinyin: 'Bànhé',
        typeEnglish: 'Half Combination',
        name: present.map(bi => BRANCHES[bi].char).join('') + '半合',
        branches: present.map(bi => BRANCHES[bi].char),
        pillars: present.flatMap(bi => pillarsWithBranch(bi)),
        element,
        effect: `Partial ${element} frame`,
      });
    }
  }

  // Six Clashes
  for (let i = 0; i < branches.length; i++) {
    for (let j = i + 1; j < branches.length; j++) {
      if (Math.abs(branches[i] - branches[j]) === 6) {
        const a = branches[i];
        const b = branches[j];
        results.push({
          type: '六冲',
          typePinyin: 'Liùchōng',
          typeEnglish: 'Six Clash',
          name: BRANCHES[a].char + BRANCHES[b].char + '冲',
          branches: [BRANCHES[a].char, BRANCHES[b].char],
          pillars: [pillarNames[i], pillarNames[j]],
          element: null,
          effect: 'Clashes and destabilises',
        });
      }
    }
  }

  // Six Harms
  for (const { pair, name } of HARMS_PAIRS) {
    const [a, b] = pair;
    if (branches.includes(a) && branches.includes(b)) {
      results.push({
        type: '相害',
        typePinyin: 'Xiānghài',
        typeEnglish: 'Six Harm',
        name,
        branches: [BRANCHES[a].char, BRANCHES[b].char],
        pillars: [...pillarsWithBranch(a), ...pillarsWithBranch(b)],
        element: null,
        effect: 'Undermines and harms',
      });
    }
  }

  return results;
}
