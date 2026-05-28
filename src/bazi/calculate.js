import {
  STEMS, BRANCHES, HIDDEN_STEMS,
  MONTH_STEM_BASE, HOUR_STEM_BASE,
  TEN_GODS, PRODUCES, CONTROLS,
  HEAVENLY_NOBLE, ACADEMIC_STAR,
  PEACH_BLOSSOM, TRAVELLING_HORSE, CANOPY_STAR,
  getBranchGroupIdx,
} from './constants.js';
import { toDayNumber } from './dateUtils.js';
import { getMonthInfo, getNearestSolarTerm } from './solarTerms.js';
import { findBranchInteractions, findStemCombinations } from './interactions.js';

// Day pillar anchor: Jan 7, 2000 = 甲子 = cycle index 0.
// toDayNumber(2000,1,7) = 698358  (pure integer, no Date objects)
// Verified: April 2 2011 → 702461 - 698358 = 4103 days → cycle 23 = 丁亥 ✓
const ANCHOR_DAY_NUMBER = toDayNumber(2000, 1, 7); // 698358

function daysSinceAnchor(year, month, day) {
  return toDayNumber(year, month, day) - ANCHOR_DAY_NUMBER;
}

function getTenGod(dmStemIdx, otherStemIdx) {
  const dm = STEMS[dmStemIdx];
  const other = STEMS[otherStemIdx];
  if (dm.element === other.element) {
    return TEN_GODS[dm.polarity === other.polarity ? 'same_same' : 'same_diff'];
  }
  const same = dm.polarity === other.polarity;
  if (PRODUCES[dm.element] === other.element) return TEN_GODS[same ? 'produces_same' : 'produces_diff'];
  if (CONTROLS[dm.element] === other.element) return TEN_GODS[same ? 'controls_same' : 'controls_diff'];
  if (PRODUCES[other.element] === dm.element) return TEN_GODS[same ? 'produced_same' : 'produced_diff'];
  if (CONTROLS[other.element] === dm.element) return TEN_GODS[same ? 'controlledby_same' : 'controlledby_diff'];
  return null;
}

function checkSpecialStars(dmStemIdx, pillars) {
  const stars = [];
  const pillarNames = ['Year', 'Month', 'Day', 'Hour'];

  pillars.forEach((p, idx) => {
    const name = pillarNames[idx];
    const bi = p.branchIdx;

    if (HEAVENLY_NOBLE[dmStemIdx]?.includes(bi)) {
      stars.push({ star: '天乙贵人', pinyin: 'Tiānyǐ Guìrén', english: 'Heavenly Noble', pillar: name });
    }
    if (ACADEMIC_STAR[dmStemIdx] === bi) {
      stars.push({ star: '文昌贵人', pinyin: 'Wénchāng Guìrén', english: 'Academic Star', pillar: name });
    }

    // Trigger from year branch and day branch per standard convention
    const triggerBranches = [pillars[0].branchIdx, pillars[2].branchIdx];
    for (const trigBi of triggerBranches) {
      const g = getBranchGroupIdx(trigBi);
      if (g === -1) continue;
      const dedup = (star, pillar) => !stars.find(s => s.star === star && s.pillar === pillar);
      if (PEACH_BLOSSOM[g] === bi && dedup('桃花', name))
        stars.push({ star: '桃花', pinyin: 'Táohuā', english: 'Peach Blossom', pillar: name });
      if (TRAVELLING_HORSE[g] === bi && dedup('驿马', name))
        stars.push({ star: '驿马', pinyin: 'Yìmǎ', english: 'Travelling Horse', pillar: name });
      if (CANOPY_STAR[g] === bi && dedup('华盖', name))
        stars.push({ star: '华盖', pinyin: 'Huágài', english: 'Canopy Star', pillar: name });
    }
  });

  return stars;
}

function computeElementBalance(pillars, dmStemIdx) {
  const totals = { Wood: 0, Fire: 0, Earth: 0, Metal: 0, Water: 0 };

  for (const p of pillars) {
    totals[STEMS[p.stemIdx].element] += 1.0;
    for (const h of HIDDEN_STEMS[p.branchIdx]) {
      totals[STEMS[h.stemIdx].element] += h.weight;
    }
  }

  const total = Object.values(totals).reduce((a, b) => a + b, 0);
  const dmElement = STEMS[dmStemIdx].element;
  const resourceElement = Object.keys(PRODUCES).find(k => PRODUCES[k] === dmElement);
  const strong = (totals[dmElement] + totals[resourceElement]) / total > 0.5;

  // Suggested Balancing Element heuristic:
  // Strong DM → needs the element that controls or drains it (Officer or Output)
  // Weak DM   → needs the element that produces it (Resource) or its own element (Parallel)
  let balancingElement;
  if (strong) {
    balancingElement = {
      primaryElement: Object.keys(CONTROLS).find(k => CONTROLS[k] === dmElement),
      secondaryElement: PRODUCES[dmElement],
      reason: 'controls or drains the Day Master',
    };
  } else {
    balancingElement = {
      primaryElement: resourceElement,
      secondaryElement: dmElement,
      reason: 'produces or supports the Day Master',
    };
  }

  return { totals, total, strong, balancingElement };
}

function buildLuckPillars(monthStemIdx, monthBranchIdx, yearStemIdx, gender, birthYear, birthMonth, birthDay) {
  const isYangYear = yearStemIdx % 2 === 0;
  const isMale = gender === 'male';
  // forward: male+yang-year or female+yin-year
  const forward = (isMale && isYangYear) || (!isMale && !isYangYear);
  const direction = forward ? 'forward' : 'backward';

  const nearest = getNearestSolarTerm(birthYear, birthMonth, birthDay, direction);
  // startingAgeExact: stored as full-precision float; display rounds to 1dp
  const startingAgeExact = nearest ? nearest.daysDiff / 3 : 0;
  const startingAge = +startingAgeExact.toFixed(1);

  // Find the 60-cycle index of the month pillar
  let monthlyCycleIdx = 0;
  for (let n = 0; n < 60; n++) {
    if (n % 10 === monthStemIdx && n % 12 === monthBranchIdx) {
      monthlyCycleIdx = n;
      break;
    }
  }

  const pillars = [];
  for (let i = 1; i <= 8; i++) {
    const step = forward ? i : -i;
    const ci = ((monthlyCycleIdx + step) % 60 + 60) % 60;
    pillars.push({
      stemIdx: ci % 10,
      branchIdx: ci % 12,
      // start/end stored as floats; display should round to 1dp
      startAge: +(startingAgeExact + (i - 1) * 10).toFixed(1),
      endAge: +(startingAgeExact + i * 10).toFixed(1),
    });
  }

  return { forward, startingAge, pillars };
}

export function calculateChart({ year, month, day, hourBranch, isLateZiHour, gender, name }) {
  // 子 hour midnight rule: if the user indicates 23:00–00:00, count as next calendar day.
  // This uses pure integer day arithmetic (no Date objects).
  const dayOffset = (hourBranch === 0 && isLateZiHour) ? 1 : 0;
  const dayCount = daysSinceAnchor(year, month, day) + dayOffset;
  const dayCycleIdx = ((dayCount % 60) + 60) % 60;
  const dayStemIdx = dayCycleIdx % 10;
  const dayBranchIdx = dayCycleIdx % 12;

  const { branchIdx: monthBranchIdx, baziYear } = getMonthInfo(year, month, day);
  const yearStemIdx = ((baziYear - 4) % 10 + 10) % 10;
  const yearBranchIdx = ((baziYear - 4) % 12 + 12) % 12;

  const stepsFromYin = (monthBranchIdx - 2 + 12) % 12;
  const monthStemIdx = (MONTH_STEM_BASE[yearStemIdx % 5] + stepsFromYin) % 10;

  const hourStemIdx = (HOUR_STEM_BASE[dayStemIdx % 5] + hourBranch) % 10;

  const pillars = [
    { label: 'Year',  stemIdx: yearStemIdx,  branchIdx: yearBranchIdx  },
    { label: 'Month', stemIdx: monthStemIdx, branchIdx: monthBranchIdx },
    { label: 'Day',   stemIdx: dayStemIdx,   branchIdx: dayBranchIdx   },
    { label: 'Hour',  stemIdx: hourStemIdx,  branchIdx: hourBranch     },
  ];

  const annotated = pillars.map((p, i) => ({
    ...p,
    stem: STEMS[p.stemIdx],
    branch: BRANCHES[p.branchIdx],
    tenGod: i === 2 ? null : getTenGod(dayStemIdx, p.stemIdx),
    hiddenStems: HIDDEN_STEMS[p.branchIdx].map(h => ({
      ...h,
      stem: STEMS[h.stemIdx],
      tenGod: getTenGod(dayStemIdx, h.stemIdx),
    })),
  }));

  const elementBalance = computeElementBalance(pillars, dayStemIdx);
  const specialStars = checkSpecialStars(dayStemIdx, pillars);
  const branchInteractions = findBranchInteractions(pillars.map(p => p.branchIdx));
  const stemCombinations = findStemCombinations(pillars.map(p => p.stemIdx));
  const luckPillars = buildLuckPillars(
    monthStemIdx, monthBranchIdx, yearStemIdx, gender, year, month, day
  );

  // currentYear via integer math: count up from anchor year
  const todayDN = toDayNumber(
    new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate()
  );
  const currentYear = new Date().getFullYear();

  return {
    name,
    gender,
    birthDate: { year, month, day },
    baziYear,
    pillars: annotated,
    dayMaster: { stemIdx: dayStemIdx, stem: STEMS[dayStemIdx] },
    elementBalance,
    specialStars,
    branchInteractions,
    stemCombinations,
    luckPillars,
    currentYear,
  };
}
