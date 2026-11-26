import type { LogbookStatsSummary } from "../../../services/api";
import type { AggregatedTimelinePoint, VisitorPeriod } from "../types";

/**
 * Builds the bars for the dashboard "Visitors" chart.
 *
 * All date math happens on calendar dates ("YYYY-MM-DD" keys), never on
 * instants, so a date-only string is never shifted by the viewer's UTC offset.
 * Internally a calendar date is represented as a UTC-midnight timestamp and is
 * always formatted with `timeZone: "UTC"`, which makes the result independent
 * of the machine's timezone. "Today" is taken from the stats timezone (the one
 * the server bucketed in), falling back to the viewer's local date.
 */

export type TimelineSource = Pick<LogbookStatsSummary, "visitsTimeline"> &
  Partial<
    Pick<LogbookStatsSummary, "timezone" | "visitsByMonth" | "visitsByYear">
  >;

export type TimelineBar = AggregatedTimelinePoint & {
  /** Longer label for tooltips, e.g. "Monday, Jan 6" or "Jan 6 – Jan 12, 2025". */
  tooltipLabel: string;
};

const DAY_MS = 24 * 60 * 60 * 1000;
const DAILY_DAYS = 7;
const WEEKLY_WEEKS = 12;
const MONTHLY_MONTHS = 12;

type CalendarDate = { year: number; month: number; day: number };

const pad2 = (n: number) => String(n).padStart(2, "0");

function toEpoch({ year, month, day }: CalendarDate): number {
  return Date.UTC(year, month - 1, day);
}

function epochToKey(epoch: number): string {
  const d = new Date(epoch);
  return `${d.getUTCFullYear()}-${pad2(d.getUTCMonth() + 1)}-${pad2(
    d.getUTCDate()
  )}`;
}

/** Parses 'YYYY-MM-DD' (or the date part of an ISO string) as a calendar date. */
function parseDateKey(value: string): CalendarDate | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
  if (!match) return null;
  return { year: +match[1], month: +match[2], day: +match[3] };
}

function format(epoch: number, opts: Intl.DateTimeFormatOptions): string {
  return new Date(epoch).toLocaleDateString("en-US", { ...opts, timeZone: "UTC" });
}

/** Today's calendar date in `timeZone` (falls back to the local date). */
export function todayIn(timeZone: string | undefined, now: Date): CalendarDate {
  if (timeZone) {
    try {
      const parts = new Intl.DateTimeFormat("en-US", {
        timeZone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).formatToParts(now);
      const get = (type: string) =>
        Number(parts.find((p) => p.type === type)?.value);
      const result = { year: get("year"), month: get("month"), day: get("day") };
      if (
        Number.isFinite(result.year) &&
        Number.isFinite(result.month) &&
        Number.isFinite(result.day)
      ) {
        return result;
      }
    } catch {
      // Unknown timezone: fall through to the local date.
    }
  }
  return {
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    day: now.getDate(),
  };
}

/** Sums the timeline per calendar-day key (merges duplicates, ignores junk). */
function dailyCounts(timeline: TimelineSource["visitsTimeline"]): Map<string, number> {
  const map = new Map<string, number>();
  for (const item of timeline ?? []) {
    const parsed = parseDateKey(item.date);
    if (!parsed) continue;
    const key = epochToKey(toEpoch(parsed));
    map.set(key, (map.get(key) ?? 0) + (item.count || 0));
  }
  return map;
}

function aggregateDaily(
  counts: Map<string, number>,
  todayEpoch: number
): TimelineBar[] {
  const bars: TimelineBar[] = [];
  for (let i = DAILY_DAYS - 1; i >= 0; i -= 1) {
    const epoch = todayEpoch - i * DAY_MS;
    const key = epochToKey(epoch);
    bars.push({
      date: key,
      count: counts.get(key) ?? 0,
      label: format(epoch, { weekday: "short" }),
      tooltipLabel: format(epoch, {
        weekday: "long",
        month: "short",
        day: "numeric",
      }),
    });
  }
  return bars;
}

function aggregateWeekly(
  counts: Map<string, number>,
  todayEpoch: number
): TimelineBar[] {
  // ISO weeks: Monday = 0 … Sunday = 6
  const isoDow = (new Date(todayEpoch).getUTCDay() + 6) % 7;
  const currentWeekStart = todayEpoch - isoDow * DAY_MS;
  const short = (epoch: number) => format(epoch, { month: "short", day: "numeric" });

  const bars: TimelineBar[] = [];
  for (let w = WEEKLY_WEEKS - 1; w >= 0; w -= 1) {
    const start = currentWeekStart - w * 7 * DAY_MS;
    const end = start + 6 * DAY_MS;
    let count = 0;
    for (let d = 0; d < 7; d += 1) {
      count += counts.get(epochToKey(start + d * DAY_MS)) ?? 0;
    }
    bars.push({
      date: epochToKey(start),
      count,
      label: `${short(start)} - ${short(end)}`,
      tooltipLabel: `${short(start)} – ${short(end)}, ${new Date(
        end
      ).getUTCFullYear()}`,
    });
  }
  return bars;
}

function aggregateMonthly(
  source: TimelineSource,
  counts: Map<string, number>,
  today: CalendarDate
): TimelineBar[] {
  const byMonth = new Map<string, number>();
  if (Array.isArray(source.visitsByMonth)) {
    for (const item of source.visitsByMonth) {
      const match = /^(\d{4})-(\d{2})/.exec(item.month);
      if (!match) continue;
      const key = `${match[1]}-${match[2]}`;
      byMonth.set(key, (byMonth.get(key) ?? 0) + (item.count || 0));
    }
  } else {
    for (const [dayKey, count] of counts) {
      const key = dayKey.slice(0, 7);
      byMonth.set(key, (byMonth.get(key) ?? 0) + count);
    }
  }

  const bars: TimelineBar[] = [];
  for (let i = MONTHLY_MONTHS - 1; i >= 0; i -= 1) {
    const epoch = Date.UTC(today.year, today.month - 1 - i, 1);
    const key = epochToKey(epoch).slice(0, 7);
    bars.push({
      date: `${key}-01`,
      count: byMonth.get(key) ?? 0,
      label: format(epoch, { month: "short", year: "numeric" }),
      tooltipLabel: format(epoch, { month: "long", year: "numeric" }),
    });
  }
  return bars;
}

function aggregateYearly(
  source: TimelineSource,
  counts: Map<string, number>,
  today: CalendarDate
): TimelineBar[] {
  const byYear = new Map<number, number>();
  if (Array.isArray(source.visitsByYear)) {
    for (const item of source.visitsByYear) {
      if (!Number.isInteger(item.year)) continue;
      byYear.set(item.year, (byYear.get(item.year) ?? 0) + (item.count || 0));
    }
  } else {
    for (const [dayKey, count] of counts) {
      const year = Number(dayKey.slice(0, 4));
      byYear.set(year, (byYear.get(year) ?? 0) + count);
    }
  }
  if (byYear.size === 0) return [];

  const years = Array.from(byYear.keys());
  const first = Math.min(...years);
  const last = Math.max(...years, today.year);

  const bars: TimelineBar[] = [];
  for (let year = first; year <= last; year += 1) {
    bars.push({
      date: `${year}-01-01`,
      count: byYear.get(year) ?? 0,
      label: String(year),
      tooltipLabel: String(year),
    });
  }
  return bars;
}

/**
 * - daily:   the last 7 calendar days ending today (missing days = 0)
 * - weekly:  the last 12 ISO weeks (Monday start) ending this week
 * - monthly: the last 12 calendar months ending this month, from
 *            `visitsByMonth` when the backend sends it, else from the timeline
 * - yearly:  every year from the first with data through this year, from
 *            `visitsByYear` when present, else from the timeline
 *
 * `now` is injectable for tests.
 */
export function aggregateTimelineData(
  source: TimelineSource | null | undefined,
  period: VisitorPeriod,
  now: Date = new Date()
): TimelineBar[] {
  if (!source) return [];

  const today = todayIn(source.timezone, now);
  const todayEpoch = toEpoch(today);
  const counts = dailyCounts(source.visitsTimeline);

  switch (period) {
    case "daily":
      return aggregateDaily(counts, todayEpoch);
    case "weekly":
      return aggregateWeekly(counts, todayEpoch);
    case "monthly":
      return aggregateMonthly(source, counts, today);
    case "yearly":
      return aggregateYearly(source, counts, today);
    default:
      return [];
  }
}
