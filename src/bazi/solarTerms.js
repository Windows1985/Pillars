// Solar term (节 jié) dates for the 12 major terms that open each BaZi month.
//
// SOLAR TERM DATA FORMAT
// Each getSolarTermDate call returns { year, month, day, hour, minute }.
// hour and minute are currently 0 — they are placeholders for a future precise
// lookup table. The algorithmic formula below is accurate to ±1 day; it cannot
// provide sub-day precision without a full astronomical data table.
//
// BOUNDARY HANDLING
// getMonthInfo and getNearestSolarTerm accept an optional { hour, minute }
// for the birth time. When the birth date matches a solar term's date exactly,
// the birth time is compared against the term's hour/minute to determine which
// side of the boundary the birth falls on. Until the hour/minute fields are
// populated from a precise table, births on exact solar term days should be
// flagged as uncertain.
//
// Term order (termIdx 0–11):
//   0=立春(Feb)  1=惊蛰(Mar)  2=清明(Apr)  3=立夏(May)
//   4=芒种(Jun)  5=小暑(Jul)  6=立秋(Aug)  7=白露(Sep)
//   8=寒露(Oct)  9=立冬(Nov) 10=大雪(Dec) 11=小寒(Jan of year+1)
//
// termIdx → earthly branch: (termIdx + 2) % 12
//   0→寅(2)  1→卯(3)  2→辰(4)  3→巳(5)  4→午(6)  5→未(7)
//   6→申(8)  7→酉(9)  8→戌(10) 9→亥(11) 10→子(0) 11→丑(1)

import { toDayNumber } from './dateUtils.js';

const TERM_MONTHS = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 1];

// Coefficients [C_20th, C_21st] for day-of-month formula.
// day = floor(Y * 0.2422 + C) - floor(Y / 4)
// where Y = year - 1900 (20th) or year - 2000 (21st).
// Accuracy: ±1 day. Sub-day accuracy requires a full astronomical table.
const COEFFS = [
  [4.02,  3.87],   // 立春
  [6.31,  6.01],   // 惊蛰
  [5.59,  5.15],   // 清明
  [6.18,  5.52],   // 立夏
  [6.5,   6.10],   // 芒种
  [7.19,  7.01],   // 小暑
  [7.00,  7.19],   // 立秋
  [8.44,  7.73],   // 白露
  [8.19,  7.90],   // 寒露
  [7.75,  7.47],   // 立冬
  [7.09,  7.09],   // 大雪
  [6.1,   5.4806], // 小寒
];

function termDay(year, termIdx) {
  const is21st = year >= 2000;
  const Y = year - (is21st ? 2000 : 1900);
  const C = COEFFS[termIdx][is21st ? 1 : 0];
  return Math.floor(Y * 0.2422 + C) - Math.floor(Y / 4);
}

// Returns { year, month, day, hour, minute } for the given solar term.
// hour and minute are 0 until a precise data table is supplied.
// termIdx 11 (小寒) belongs to January of year+1.
export function getSolarTermDate(year, termIdx) {
  const month = TERM_MONTHS[termIdx];
  const day = termDay(year, termIdx);
  const termYear = termIdx === 11 ? year + 1 : year;
  return { year: termYear, month, day, hour: 0, minute: 0 };
}

// Compare a birth date+time against a solar term date+time.
// Returns negative if birth is before term, positive if after, 0 if same.
// When term hour/minute are both 0 (placeholder), only the calendar date is
// compared; a same-day birth is treated as "on the boundary" (returns 0).
function compareToBoundary(bYear, bMonth, bDay, bHour, bMinute, term) {
  const bDN = toDayNumber(bYear, bMonth, bDay);
  const tDN = toDayNumber(term.year, term.month, term.day);
  if (bDN !== tDN) return bDN - tDN;
  // Same calendar day: compare time only when term has precise hour/minute data
  if (term.hour === 0 && term.minute === 0) return 0; // boundary uncertain
  const bMins = bHour * 60 + bMinute;
  const tMins = term.hour * 60 + term.minute;
  return bMins - tMins;
}

// Returns the earthly branch index (0=子…11=亥) for the BaZi month and the
// adjusted BaZi year for the given birth date and local time.
// birthHour and birthMinute default to 0 when not provided.
export function getMonthInfo(year, month, day, birthHour = 0, birthMinute = 0) {
  const lichun = getSolarTermDate(year, 0);
  const cmp = compareToBoundary(year, month, day, birthHour, birthMinute, lichun);
  // cmp < 0: birth is before 立春 → BaZi year = year - 1
  // cmp = 0: same-day boundary uncertainty → treat as previous year (conservative)
  const baziYear = cmp <= 0 ? year - 1 : year;

  // Build the 12 term boundaries covering the BaZi solar year for baziYear.
  // The BaZi solar year runs from 立春(baziYear) through 小寒(baziYear, i.e. Jan of baziYear+1).
  // We also need the previous year's 小寒 to cover January births before 立春.
  const boundaries = [];
  for (let ti = 0; ti < 12; ti++) {
    const td = getSolarTermDate(baziYear, ti);
    boundaries.push({ termIdx: ti, ...td });
  }
  const prevXiaohan = getSolarTermDate(baziYear - 1, 11);
  boundaries.push({ termIdx: 11, ...prevXiaohan });

  boundaries.sort((a, b) => {
    const da = toDayNumber(a.year, a.month, a.day);
    const db = toDayNumber(b.year, b.month, b.day);
    return da - db;
  });

  let activeTerm = 11; // default: 丑 month (小寒 of previous year)
  for (const b of boundaries) {
    const c = compareToBoundary(year, month, day, birthHour, birthMinute, b);
    if (c >= 0) activeTerm = b.termIdx;
  }

  const branchIdx = (activeTerm + 2) % 12;
  return { branchIdx, baziYear };
}

// Finds the nearest solar term in the given direction from the birth date.
// Used to compute luck pillar starting age.
// Returns { year, month, day, daysDiff } where daysDiff is in whole calendar days.
export function getNearestSolarTerm(year, month, day, direction) {
  const birthDN = toDayNumber(year, month, day);
  let best = null;

  for (let y = year - 1; y <= year + 1; y++) {
    for (let ti = 0; ti < 12; ti++) {
      const td = getSolarTermDate(y, ti);
      const termDN = toDayNumber(td.year, td.month, td.day);
      const diff = termDN - birthDN;

      if (direction === 'forward' && diff > 0) {
        if (!best || diff < best.diff) best = { ...td, diff };
      } else if (direction === 'backward' && diff < 0) {
        if (!best || diff > best.diff) best = { ...td, diff };
      }
    }
  }

  if (!best) return null;
  return { year: best.year, month: best.month, day: best.day, daysDiff: Math.abs(best.diff) };
}
