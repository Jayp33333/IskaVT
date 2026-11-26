import { describe, expect, it } from "vitest";
import type { VisitorPeriod } from "../types";
import { aggregateTimelineData, todayIn, type TimelineSource } from "./aggregateTimeline";

/**
 * Every test pins both `now` and `timezone`, and the implementation never
 * formats in the machine's local zone, so results are the same wherever the
 * suite runs. The one exception is the "invalid timezone" fallback test,
 * which builds `now` from local components on purpose.
 */

const MANILA = "Asia/Manila";

// 2025-01-08T20:00Z is Thu 2025-01-09 04:00 in Manila but still Wed Jan 8 in UTC.
const NOW = new Date("2025-01-08T20:00:00Z");

const src = (
  visitsTimeline: TimelineSource["visitsTimeline"],
  extra: Partial<TimelineSource> = {}
): TimelineSource => ({ timezone: MANILA, visitsTimeline, ...extra });

describe("todayIn", () => {
  it("uses the stats timezone, not the machine's", () => {
    expect(todayIn(MANILA, NOW)).toEqual({ year: 2025, month: 1, day: 9 });
    expect(todayIn("UTC", NOW)).toEqual({ year: 2025, month: 1, day: 8 });
  });

  it("falls back to the local date for a missing or unknown timezone", () => {
    const localNow = new Date(2025, 2, 15, 12, 0, 0);
    const expected = { year: 2025, month: 3, day: 15 };
    expect(todayIn(undefined, localNow)).toEqual(expected);
    expect(todayIn("Not/AZone", localNow)).toEqual(expected);
  });
});

describe("aggregateTimelineData", () => {
  it("returns [] without a source", () => {
    expect(aggregateTimelineData(null, "daily", NOW)).toEqual([]);
    expect(aggregateTimelineData(undefined, "weekly", NOW)).toEqual([]);
  });

  it("returns [] for an unknown period", () => {
    expect(
      aggregateTimelineData(src([]), "hourly" as unknown as VisitorPeriod, NOW)
    ).toEqual([]);
  });

  describe("daily", () => {
    it("returns the last 7 calendar days ending today (stats tz), zero-filled", () => {
      const result = aggregateTimelineData(
        src([
          { date: "2024-12-20", count: 99 }, // outside the window
          { date: "2025-01-04", count: 2 },
          { date: "2025-01-09", count: 5 },
        ]),
        "daily",
        NOW
      );

      expect(result.map(({ date, count, label }) => ({ date, count, label }))).toEqual([
        { date: "2025-01-03", count: 0, label: "Fri" },
        { date: "2025-01-04", count: 2, label: "Sat" },
        { date: "2025-01-05", count: 0, label: "Sun" },
        { date: "2025-01-06", count: 0, label: "Mon" },
        { date: "2025-01-07", count: 0, label: "Tue" },
        { date: "2025-01-08", count: 0, label: "Wed" },
        { date: "2025-01-09", count: 5, label: "Thu" },
      ]);
      expect(result[6].tooltipLabel).toBe("Thursday, Jan 9");
    });

    it("returns 7 zero bars for an empty timeline", () => {
      const result = aggregateTimelineData(src([]), "daily", NOW);
      expect(result).toHaveLength(7);
      expect(result.every((p) => p.count === 0)).toBe(true);
    });

    it("merges duplicate dates and ignores input order", () => {
      const result = aggregateTimelineData(
        src([
          { date: "2025-01-08", count: 1 },
          { date: "2025-01-06", count: 2 },
          { date: "2025-01-08", count: 3 },
        ]),
        "daily",
        NOW
      );
      expect(result.map((p) => p.count)).toEqual([0, 0, 0, 2, 0, 4, 0]);
    });

    it("shifts the window with the timezone", () => {
      const result = aggregateTimelineData(
        src([{ date: "2025-01-09", count: 5 }], { timezone: "UTC" }),
        "daily",
        NOW
      );
      // In UTC "today" is still Jan 8, so Jan 9 is in the future and excluded.
      expect(result[6].date).toBe("2025-01-08");
      expect(result.reduce((s, p) => s + p.count, 0)).toBe(0);
    });
  });

  describe("weekly", () => {
    it("returns the last 12 Monday-start weeks ending this week", () => {
      const result = aggregateTimelineData(src([]), "weekly", NOW);
      expect(result).toHaveLength(12);
      // Today (Manila) is Thu Jan 9 → this week starts Mon Jan 6.
      expect(result[11].date).toBe("2025-01-06");
      expect(result[11].label).toBe("Jan 6 - Jan 12");
      expect(result[0].date).toBe("2024-10-21");
      expect(result[0].label).toBe("Oct 21 - Oct 27");
    });

    it("buckets Sunday into the week that started the previous Monday", () => {
      const result = aggregateTimelineData(
        src([
          { date: "2024-12-30", count: 1 }, // Mon → week of Dec 30
          { date: "2025-01-05", count: 2 }, // Sun → week of Dec 30
          { date: "2025-01-06", count: 4 }, // Mon → week of Jan 6
          { date: "2025-01-09", count: 8 }, // Thu → week of Jan 6
        ]),
        "weekly",
        NOW
      );
      expect(result[10]).toMatchObject({ date: "2024-12-30", count: 3 });
      expect(result[10].label).toBe("Dec 30 - Jan 5");
      expect(result[11]).toMatchObject({ date: "2025-01-06", count: 12 });
    });

    it("zero-fills weeks without data", () => {
      const result = aggregateTimelineData(
        src([{ date: "2024-11-05", count: 7 }]),
        "weekly",
        NOW
      );
      expect(result.filter((p) => p.count > 0)).toEqual([
        expect.objectContaining({ date: "2024-11-04", count: 7 }),
      ]);
    });
  });

  describe("monthly", () => {
    it("uses visitsByMonth when present and gap-fills the last 12 months", () => {
      const result = aggregateTimelineData(
        src([{ date: "2025-01-02", count: 1000 }], {
          visitsByMonth: [
            { month: "2024-01", count: 50 }, // older than 12 months → dropped
            { month: "2024-03", count: 3 },
            { month: "2025-01", count: 9 },
          ],
        }),
        "monthly",
        NOW
      );

      expect(result).toHaveLength(12);
      expect(result[0]).toMatchObject({ date: "2024-02-01", count: 0, label: "Feb 2024" });
      expect(result[1]).toMatchObject({ date: "2024-03-01", count: 3, label: "Mar 2024" });
      expect(result[11]).toMatchObject({ date: "2025-01-01", count: 9, label: "Jan 2025" });
      expect(result.reduce((s, p) => s + p.count, 0)).toBe(12);
    });

    it("derives months from the timeline for an older backend", () => {
      const result = aggregateTimelineData(
        src([
          { date: "2024-12-01", count: 1 },
          { date: "2024-12-31", count: 2 },
          { date: "2025-01-01", count: 4 },
        ]),
        "monthly",
        NOW
      );
      expect(result.slice(-2).map(({ date, count }) => ({ date, count }))).toEqual([
        { date: "2024-12-01", count: 3 },
        { date: "2025-01-01", count: 4 },
      ]);
    });
  });

  describe("yearly", () => {
    it("uses visitsByYear when present, sorted and gap-filled through this year", () => {
      const result = aggregateTimelineData(
        src([], {
          visitsByYear: [
            { year: 2023, count: 5 },
            { year: 2021, count: 1 },
          ],
        }),
        "yearly",
        NOW
      );
      expect(result).toEqual([
        { date: "2021-01-01", count: 1, label: "2021", tooltipLabel: "2021" },
        { date: "2022-01-01", count: 0, label: "2022", tooltipLabel: "2022" },
        { date: "2023-01-01", count: 5, label: "2023", tooltipLabel: "2023" },
        { date: "2024-01-01", count: 0, label: "2024", tooltipLabel: "2024" },
        { date: "2025-01-01", count: 0, label: "2025", tooltipLabel: "2025" },
      ]);
    });

    it("derives years from the timeline for an older backend", () => {
      const result = aggregateTimelineData(
        src([
          { date: "2024-12-31", count: 2 },
          { date: "2025-01-01", count: 3 },
        ]),
        "yearly",
        NOW
      );
      expect(result.map(({ label, count }) => ({ label, count }))).toEqual([
        { label: "2024", count: 2 },
        { label: "2025", count: 3 },
      ]);
    });

    it("returns [] when there is no data at all", () => {
      expect(aggregateTimelineData(src([], { visitsByYear: [] }), "yearly", NOW)).toEqual([]);
    });
  });
});
