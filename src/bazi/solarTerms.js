// Solar term dates computed algorithmically.
// Gives the day-of-month for each of the 12 major 节 (jié) that start BaZi months.
// Term order: 立春(Feb), 惊蛰(Mar), 清明(Apr), 立夏(May), 芒种(Jun), 小暑(Jul),
//             立秋(Aug), 白露(Sep), 寒露(Oct), 立冬(Nov), 大雪(Dec), 小寒(Jan of year+1)
// Months:      [2,        3,        4,        5,        6,        7,
//               8,        9,        10,       11,       12,       1]
// Accuracy: ±1 day for most years; births on transition dates should be verified.

const TERM_MONTHS = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 1];

// Formula coefficients [C_20th, C_21st] for each term
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

// Returns [month, day] for term termIdx in given year.
// Note: termIdx 11 (小寒) returns month=1 of year+1.
export function getSolarTermDate(year, termIdx) {
  const month = TERM_MONTHS[termIdx];
  const day = termDay(year, termIdx);
  return { month, day, year: termIdx === 11 ? year + 1 : year };
}

// Returns the earthly branch index (0=子,1=丑,...,11=亥) for the BaZi month
// containing the given Gregorian date.
// Also returns the BaZi year (adjusted for 立春 boundary).
export function getMonthInfo(year, month, day) {
  // Check Li Chun (立春, term 0) to determine BaZi year
  const lichun = getSolarTermDate(year, 0);
  const beforeLichun = month < lichun.month || (month === lichun.month && day < lichun.day);
  const baziYear = beforeLichun ? year - 1 : year;

  // Find which of the 12 terms the date falls in (within the BaZi solar year)
  // BaZi solar year starts at 立春. Terms in order 0-11 map to branches 寅(2)..丑(1).
  // We check the current year's terms and the previous year's 小寒(11).

  // Build list of [termIdx, month, day, year] for the 12 boundaries of the current BaZi year
  const boundaries = [];
  for (let ti = 0; ti < 12; ti++) {
    const td = getSolarTermDate(baziYear, ti);
    boundaries.push({ termIdx: ti, year: td.year, month: td.month, day: td.day });
  }
  // Also need 小寒 of previous year as the start of 丑 month before 立春
  const prevXiaohan = getSolarTermDate(baziYear - 1, 11);
  boundaries.push({ termIdx: 11, year: prevXiaohan.year, month: prevXiaohan.month, day: prevXiaohan.day });

  // Sort by date
  boundaries.sort((a, b) => {
    if (a.year !== b.year) return a.year - b.year;
    if (a.month !== b.month) return a.month - b.month;
    return a.day - b.day;
  });

  // Find the last boundary on or before the given date
  let activeTerm = 11; // default 丑 (previous year's 小寒)
  for (const b of boundaries) {
    const beforeOrOn =
      b.year < year ||
      (b.year === year && b.month < month) ||
      (b.year === year && b.month === month && b.day <= day);
    if (beforeOrOn) activeTerm = b.termIdx;
  }

  // termIdx 0=立春→寅(2), 1=惊蛰→卯(3), ..., 11=小寒→丑(1)
  const branchIdx = (activeTerm + 2) % 12;
  return { branchIdx, baziYear };
}

// For luck pillar calculation: find the nearest 节 before or after a date.
// direction: 'forward' (next term) or 'backward' (previous term)
// Returns { termYear, termMonth, termDay, daysDiff }
export function getNearestSolarTerm(year, month, day, direction) {
  const dateVal = year * 10000 + month * 100 + day;

  // Scan terms across a range of years
  let best = null;
  for (let y = year - 1; y <= year + 1; y++) {
    for (let ti = 0; ti < 12; ti++) {
      const td = getSolarTermDate(y, ti);
      const tVal = td.year * 10000 + td.month * 100 + td.day;
      if (direction === 'forward' && tVal > dateVal) {
        if (!best || tVal < best.tVal) best = { ...td, tVal };
      } else if (direction === 'backward' && tVal < dateVal) {
        if (!best || tVal > best.tVal) best = { ...td, tVal };
      }
    }
  }

  if (!best) return null;

  const daysDiff = Math.abs(dateDiff(year, month, day, best.year, best.month, best.day));
  return { year: best.year, month: best.month, day: best.day, daysDiff };
}

function dateDiff(y1, m1, d1, y2, m2, d2) {
  const msPerDay = 86400000;
  const a = new Date(y1, m1 - 1, d1).getTime();
  const b = new Date(y2, m2 - 1, d2).getTime();
  return Math.round((b - a) / msPerDay);
}
