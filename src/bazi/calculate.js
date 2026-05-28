import {
  STEMS, BRANCHES, HIDDEN_STEMS,
  MONTH_STEM_BASE, HOUR_STEM_BASE,
  TEN_GODS, PRODUCES, CONTROLS,
  HEAVENLY_NOBLE, ACADEMIC_STAR,
  PEACH_BLOSSOM, TRAVELLING_HORSE, CANOPY_STAR,
  getBranchGroupIdx, ELEMENTS,
} from './constants.js';
import { getMonthInfo, getNearestSolarTerm } from './solarTerms.js';
import { findInteractions } from './interactions.js';

// Day pillar reference: Jan 7, 2000 = 甲子 = cycle index 0.
// Verified: April 2, 2011 → 4103 days → cycle 23 = 丁亥 ✓
const REF_DATE = new Date(2000, 0, 7); // Jan 7, 2000

function daysSinceRef(year, month, day) {
  const d = new Date(year, month - 1, day);
  return Math.round((d - REF_DATE) / 86400000);
}

function getTenGod(dmStemIdx, otherStemIdx) {
  const dm = STEMS[dmStemIdx];
  const other = STEMS[otherStemIdx];
  if (dm.element === other.element) {
    const polarityKey = dm.polarity === other.polarity ? 'same_same' : 'same_diff';
    return TEN_GODS[polarityKey];
  }
  const samePolarity = dm.polarity === other.polarity;
  if (PRODUCES[dm.element] === other.element) {
    return TEN_GODS[samePolarity ? 'produces_same' : 'produces_diff'];
  }
  if (CONTROLS[dm.element] === other.element) {
    return TEN_GODS[samePolarity ? 'controls_same' : 'controls_diff'];
  }
  if (PRODUCES[other.element] === dm.element) {
    return TEN_GODS[samePolarity ? 'produced_same' : 'produced_diff'];
  }
  if (CONTROLS[other.element] === dm.element) {
    return TEN_GODS[samePolarity ? 'controlledby_same' : 'controlledby_diff'];
  }
  return null;
}

function checkSpecialStars(dmStemIdx, pillars) {
  const stars = [];
  const pillarNames = ['Year', 'Month', 'Day', 'Hour'];

  pillars.forEach((p, idx) => {
    const name = pillarNames[idx];
    const bi = p.branchIdx;

    // 天乙贵人
    if (HEAVENLY_NOBLE[dmStemIdx]?.includes(bi)) {
      stars.push({ star: '天乙贵人', pinyin: 'Tiānyǐ Guìrén', english: 'Heavenly Noble', pillar: name });
    }

    // 文昌贵人
    if (ACADEMIC_STAR[dmStemIdx] === bi) {
      stars.push({ star: '文昌贵人', pinyin: 'Wénchāng Guìrén', english: 'Academic Star', pillar: name });
    }

    // Stars based on branch group (use year and day branches as triggers per convention)
    const triggerBranches = [pillars[0].branchIdx, pillars[2].branchIdx]; // year, day
    for (const trigBi of triggerBranches) {
      const groupIdx = getBranchGroupIdx(trigBi);
      if (groupIdx === -1) continue;

      if (PEACH_BLOSSOM[groupIdx] === bi) {
        if (!stars.find(s => s.star === '桃花' && s.pillar === name)) {
          stars.push({ star: '桃花', pinyin: 'Táohuā', english: 'Peach Blossom', pillar: name });
        }
      }
      if (TRAVELLING_HORSE[groupIdx] === bi) {
        if (!stars.find(s => s.star === '驿马' && s.pillar === name)) {
          stars.push({ star: '驿马', pinyin: 'Yìmǎ', english: 'Travelling Horse', pillar: name });
        }
      }
      if (CANOPY_STAR[groupIdx] === bi) {
        if (!stars.find(s => s.star === '华盖' && s.pillar === name)) {
          stars.push({ star: '华盖', pinyin: 'Huágài', english: 'Canopy Star', pillar: name });
        }
      }
    }
  });

  return stars;
}

function computeElementBalance(pillars, dmStemIdx) {
  const totals = { Wood: 0, Fire: 0, Earth: 0, Metal: 0, Water: 0 };

  pillars.forEach(p => {
    // Surface stem
    totals[STEMS[p.stemIdx].element] += 1.0;
    // Surface branch (primary element)
    totals[BRANCHES[p.branchIdx].element] += 0;  // branch element counted through hidden stems
    // Hidden stems
    HIDDEN_STEMS[p.branchIdx].forEach(h => {
      totals[STEMS[h.stemIdx].element] += h.weight;
    });
  });

  const total = Object.values(totals).reduce((a, b) => a + b, 0);
  const dmElement = STEMS[dmStemIdx].element;
  const resourceElement = Object.keys(PRODUCES).find(k => PRODUCES[k] === dmElement);
  const supportScore = (totals[dmElement] + totals[resourceElement]) / total;
  const strong = supportScore > 0.5;

  // Useful god
  let usefulGod;
  if (strong) {
    // Control or drain: officer element (controls DM) or output element (DM produces)
    const officerEl = Object.keys(CONTROLS).find(k => CONTROLS[k] === dmElement);
    const outputEl = PRODUCES[dmElement];
    usefulGod = { strong: true, primaryElement: officerEl, secondaryElement: outputEl };
  } else {
    const outputEl = resourceElement;
    usefulGod = { strong: false, primaryElement: outputEl, secondaryElement: dmElement };
  }

  return { totals, total, strong, usefulGod };
}

function buildLuckPillars(monthStemIdx, monthBranchIdx, yearStemIdx, gender, birthYear, birthMonth, birthDay) {
  const isYang = yearStemIdx % 2 === 0;
  const isMale = gender === 'male';
  // forward: male+yang or female+yin
  const forward = (isMale && isYang) || (!isMale && !isYang);

  // Find nearest solar term in the direction
  const direction = forward ? 'forward' : 'backward';
  const nearest = getNearestSolarTerm(birthYear, birthMonth, birthDay, direction);
  const startingAge = nearest ? +(nearest.daysDiff / 3).toFixed(1) : 0;

  // Build 8 luck pillars stepping through 60-cycle from month pillar
  const monthCycleIdx = monthStemIdx + (monthBranchIdx % 2 === monthStemIdx % 2 ? 0 : 0);
  // Recalculate: month cycle index where stem=monthStemIdx, branch=monthBranchIdx
  // cycleIdx: find n where n%10=monthStemIdx and n%12=monthBranchIdx
  let monthlyCycleIdx = -1;
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
      startAge: +(startingAge + (i - 1) * 10).toFixed(1),
      endAge: +(startingAge + i * 10 - 0.1).toFixed(1),
    });
  }

  return { forward, startingAge, pillars };
}

export function calculateChart({ year, month, day, hourBranch, isLateZiHour, gender, name }) {
  // Day pillar: apply midnight boundary for 子 hour
  const dayOffset = (hourBranch === 0 && isLateZiHour) ? 1 : 0;
  const dayCount = daysSinceRef(year, month, day) + dayOffset;
  const dayCycleIdx = ((dayCount % 60) + 60) % 60;
  const dayStemIdx = dayCycleIdx % 10;
  const dayBranchIdx = dayCycleIdx % 12;

  // Year pillar (adjusted for 立春)
  const { branchIdx: monthBranchIdx, baziYear } = getMonthInfo(year, month, day);
  const yearStemIdx = ((baziYear - 4) % 10 + 10) % 10;
  const yearBranchIdx = ((baziYear - 4) % 12 + 12) % 12;

  // Month pillar
  // monthBranchIdx is already the earthly branch index (0=子..11=亥)
  // Convert to offset from 寅(2): steps from 寅 = (monthBranchIdx - 2 + 12) % 12
  const stepsFromYin = (monthBranchIdx - 2 + 12) % 12;
  const monthStemIdx = (MONTH_STEM_BASE[yearStemIdx % 5] + stepsFromYin) % 10;

  // Hour pillar
  const hourStemIdx = (HOUR_STEM_BASE[dayStemIdx % 5] + hourBranch) % 10;

  const pillars = [
    { label: 'Year',  stemIdx: yearStemIdx,  branchIdx: yearBranchIdx  },
    { label: 'Month', stemIdx: monthStemIdx, branchIdx: monthBranchIdx },
    { label: 'Day',   stemIdx: dayStemIdx,   branchIdx: dayBranchIdx   },
    { label: 'Hour',  stemIdx: hourStemIdx,  branchIdx: hourBranch     },
  ];

  // Annotate with ten gods (relative to day master)
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
  const interactions = findInteractions(pillars.map(p => p.branchIdx));
  const luckPillars = buildLuckPillars(
    monthStemIdx, monthBranchIdx, yearStemIdx, gender, year, month, day
  );

  return {
    name,
    gender,
    birthDate: { year, month, day },
    baziYear,
    pillars: annotated,
    dayMaster: { stemIdx: dayStemIdx, stem: STEMS[dayStemIdx] },
    elementBalance,
    specialStars,
    interactions,
    luckPillars,
    currentYear: new Date().getFullYear(),
  };
}
