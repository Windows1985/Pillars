// TIME HANDLING RULES
// ====================
// 1. Local civil time only. Birth times are entered and stored as the local clock
//    time where the person was born. No timezone normalization is applied.
// 2. No astronomical longitude correction. This app does not adjust for the
//    difference between the birth location's geographic longitude and the
//    standard meridian. That correction is a separate interpretive layer beyond
//    the scope of this implementation.
// 3. No DST or UTC conversion. All date arithmetic is done in the Proleptic
//    Gregorian calendar with no timezone offset applied.
// 4. Integer-only date arithmetic. All day counting uses the pure-integer
//    Proleptic Gregorian Day Number (Rata Die variant) below. No JS Date
//    objects are used for day-difference calculations to avoid:
//    - DST ambiguity (some local clocks skip or repeat hours)
//    - Browser-dependent timestamp behaviour
//    - Floating-point rounding in millisecond subtraction

// LUCK PILLAR START-AGE RULES
// ============================
// - daysDiff = |toDayNumber(birthDate) - toDayNumber(nearestSolarTermDate)|
//   Both sides use calendar dates only; birth hour is not used in this count.
// - startingAge (years) = daysDiff / 3   (each 3 calendar days = 1 year)
// - Stored internally as a float with full precision (e.g. 9.333...)
// - Displayed rounded to 1 decimal place (e.g. "9.3")
// - For a display of years + months: months = round((fractional part) * 12)
// - Luck pillar n (0-indexed) spans ages:
//     start = startingAge + n*10
//     end   = startingAge + (n+1)*10  (exclusive)
// - Counting starts from the birth calendar date, not the birth moment.

// Convert a Proleptic Gregorian date to an integer day number (Rata Die variant).
// Pure integer arithmetic — no Date objects, no floating point.
// Verified: toDayNumber(2000,1,7) = 698358; toDayNumber(2011,4,2) = 702461; diff = 4103 ✓
export function toDayNumber(year, month, day) {
  const correction = month <= 2 ? -1 : 0;
  const yr = year + correction;
  const mo = month + (correction === -1 ? 12 : 0);
  return (
    365 * yr +
    Math.floor(yr / 4) -
    Math.floor(yr / 100) +
    Math.floor(yr / 400) +
    Math.floor((153 * mo + 8) / 5) +
    day - 32167
  );
}
