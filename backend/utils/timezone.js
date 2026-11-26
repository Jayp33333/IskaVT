// Timezone helpers built on Intl only (no dependencies).
//
// All "start of X" helpers return a real instant (Date) that corresponds to
// local midnight in the given IANA zone. They are DST-safe: the UTC offset is
// looked up at the target wall-clock time and re-checked once, so the result
// is correct on both sides of a transition.

export const DEFAULT_TIMEZONE = 'Asia/Manila';

const formatterCache = new Map();

function getFormatter(tz) {
  let formatter = formatterCache.get(tz);
  if (!formatter) {
    formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: tz,
      hourCycle: 'h23',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
    formatterCache.set(tz, formatter);
  }
  return formatter;
}

export function isValidTimezone(tz) {
  if (typeof tz !== 'string' || tz.trim() === '') return false;
  try {
    getFormatter(tz);
    return true;
  } catch {
    return false;
  }
}

// APP_TIMEZONE if it is a valid IANA zone, otherwise Asia/Manila.
export function getAppTimezone(env = process.env) {
  const candidate = env?.APP_TIMEZONE?.trim();
  return candidate && isValidTimezone(candidate) ? candidate : DEFAULT_TIMEZONE;
}

// Wall-clock parts of `date` in `tz`. month is 1-12, weekday is 0=Sun..6=Sat.
export function zonedParts(date, tz) {
  const parts = {};
  for (const { type, value } of getFormatter(tz).formatToParts(new Date(date))) {
    if (type !== 'literal') parts[type] = Number(value);
  }
  const hour = parts.hour === 24 ? 0 : parts.hour;
  return {
    year: parts.year,
    month: parts.month,
    day: parts.day,
    hour,
    minute: parts.minute,
    second: parts.second,
    weekday: new Date(Date.UTC(parts.year, parts.month - 1, parts.day)).getUTCDay(),
  };
}

// Offset of `tz` from UTC at instant `date`, in milliseconds (Manila = +8h).
export function getTimezoneOffsetMs(date, tz) {
  const ms = new Date(date).getTime();
  const p = zonedParts(ms, tz);
  const asUtc = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second);
  const truncated = ms - (((ms % 1000) + 1000) % 1000);
  return asUtc - truncated;
}

// Instant at which the wall clock in `tz` reads the given time. Out-of-range
// fields roll over like Date.UTC (day 0 = last day of previous month, etc.).
// For a wall time skipped by a DST gap, the time after the gap is returned.
export function zonedTimeToUtc(
  { year, month, day = 1, hour = 0, minute = 0, second = 0, millisecond = 0 },
  tz
) {
  const wallAsUtc = Date.UTC(year, month - 1, day, hour, minute, second, millisecond);
  const firstOffset = getTimezoneOffsetMs(wallAsUtc, tz);
  let instant = wallAsUtc - firstOffset;
  const secondOffset = getTimezoneOffsetMs(instant, tz);
  if (secondOffset !== firstOffset) {
    const corrected = wallAsUtc - secondOffset;
    // If the corrected instant still disagrees, the wall time falls in a DST
    // gap (it never occurs). Use the first instant after the gap, which is
    // also the real start of the day in zones that switch at midnight.
    instant =
      getTimezoneOffsetMs(corrected, tz) === secondOffset
        ? corrected
        : Math.max(instant, corrected);
  }
  return new Date(instant);
}

export function startOfDayInZone(date, tz) {
  const p = zonedParts(date, tz);
  return zonedTimeToUtc({ year: p.year, month: p.month, day: p.day }, tz);
}

// ISO week: Monday is the first day.
export function startOfIsoWeekInZone(date, tz) {
  const p = zonedParts(date, tz);
  const diffToMonday = (p.weekday + 6) % 7;
  return zonedTimeToUtc({ year: p.year, month: p.month, day: p.day - diffToMonday }, tz);
}

export function startOfMonthInZone(date, tz) {
  const p = zonedParts(date, tz);
  return zonedTimeToUtc({ year: p.year, month: p.month, day: 1 }, tz);
}

// Shift by whole calendar days in `tz`, keeping the local wall-clock time.
export function addDaysInZone(date, days, tz) {
  const p = zonedParts(date, tz);
  const ms = new Date(date).getUTCMilliseconds();
  return zonedTimeToUtc(
    { ...p, day: p.day + days, millisecond: ms },
    tz
  );
}

// Start of the month `months` away from the month containing `date` (in tz).
export function addMonthsToStartOfMonthInZone(date, months, tz) {
  const p = zonedParts(date, tz);
  return zonedTimeToUtc({ year: p.year, month: p.month + months, day: 1 }, tz);
}

function pad2(n) {
  return String(n).padStart(2, '0');
}

// 'YYYY-MM-DD' of `date` in `tz` (matches Mongo $dateToString '%Y-%m-%d').
export function formatDateKeyInZone(date, tz) {
  const p = zonedParts(date, tz);
  return `${p.year}-${pad2(p.month)}-${pad2(p.day)}`;
}

// 'YYYY-MM' of `date` in `tz` (matches Mongo $dateToString '%Y-%m').
export function formatMonthKeyInZone(date, tz) {
  const p = zonedParts(date, tz);
  return `${p.year}-${pad2(p.month)}`;
}
