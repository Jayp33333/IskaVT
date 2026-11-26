import { describe, expect, it } from "vitest";
import type { VisitorPeriod } from "../types";
import { aggregateTimelineData } from "./aggregateTimeline";

/**
 * Characterization tests: these document CURRENT behaviour, including quirks
 * that are likely to change in a later wave.
 *
 * Inputs use local-time ISO strings without a "Z" ("YYYY-MM-DDTHH:mm:ss"),
 * which JS parses as local time, so bucketing is timezone-independent.
 * Date-only strings ("YYYY-MM-DD") are parsed as UTC midnight, which makes
 * some labels shift a day/month in timezones west of UTC; those assertions
 * only run where the local offset is UTC or east of it.
 */

type Point = { date: string; count: number };

const localNoon = (y: number, m: number, d: number) =>
  `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}T12:00:00`;

// true when local time is UTC or ahead of it (e.g. UTC+8), i.e. a date-only
// string parsed as UTC midnight still falls on the same local calendar day.
const utcOrEast = new Date(2025, 0, 1).getTimezoneOffset() <= 0;

describe("aggregateTimelineData", () => {
  describe("empty / unknown input", () => {
    it.each<VisitorPeriod>(["daily", "weekly", "monthly", "yearly"])(
      "returns [] for an empty timeline (%s)",
      (period) => {
        expect(aggregateTimelineData([], period)).toEqual([]);
      }
    );

    it("returns [] for an unknown period", () => {
      const timeline: Point[] = [{ date: localNoon(2025, 1, 6), count: 3 }];
      expect(
        aggregateTimelineData(timeline, "hourly" as unknown as VisitorPeriod)
      ).toEqual([]);
    });
  });

  describe("daily", () => {
    it("keeps date/count and adds a short weekday label", () => {
      const timeline: Point[] = [
        { date: localNoon(2025, 1, 6), count: 3 }, // Monday
        { date: localNoon(2025, 1, 7), count: 5 }, // Tuesday
      ];
      expect(aggregateTimelineData(timeline, "daily")).toEqual([
        { date: localNoon(2025, 1, 6), count: 3, label: "Mon" },
        { date: localNoon(2025, 1, 7), count: 5, label: "Tue" },
      ]);
    });

    it("takes the LAST 7 ENTRIES, not the last 7 calendar days (gaps are not filled)", () => {
      // 10 entries spread over ~3 weeks with gaps
      const days = [1, 2, 3, 5, 8, 10, 13, 15, 18, 21];
      const timeline: Point[] = days.map((d, i) => ({
        date: localNoon(2025, 1, d),
        count: i + 1,
      }));

      const result = aggregateTimelineData(timeline, "daily");

      expect(result).toHaveLength(7);
      expect(result.map((p) => p.count)).toEqual([4, 5, 6, 7, 8, 9, 10]);
      expect(result[0].date).toBe(localNoon(2025, 1, 5));
      expect(result[6].date).toBe(localNoon(2025, 1, 21));
    });

    it("does not sort: preserves input order", () => {
      const timeline: Point[] = [
        { date: localNoon(2025, 1, 8), count: 1 },
        { date: localNoon(2025, 1, 6), count: 2 },
      ];
      expect(
        aggregateTimelineData(timeline, "daily").map((p) => p.count)
      ).toEqual([1, 2]);
    });

    it("does not merge duplicate dates", () => {
      const timeline: Point[] = [
        { date: localNoon(2025, 1, 6), count: 1 },
        { date: localNoon(2025, 1, 6), count: 2 },
      ];
      expect(aggregateTimelineData(timeline, "daily")).toHaveLength(2);
    });

    it.runIf(utcOrEast)(
      "labels date-only strings by their UTC date (UTC or east of UTC)",
      () => {
        const result = aggregateTimelineData(
          [{ date: "2025-01-06", count: 1 }],
          "daily"
        );
        expect(result[0].label).toBe("Mon");
      }
    );
  });

  describe("weekly", () => {
    it("buckets by Sunday-start weeks and sums counts", () => {
      const timeline: Point[] = [
        { date: localNoon(2025, 1, 5), count: 1 }, // Sun -> week of Jan 5
        { date: localNoon(2025, 1, 8), count: 2 }, // Wed -> week of Jan 5
        { date: localNoon(2025, 1, 11), count: 3 }, // Sat -> week of Jan 5
        { date: localNoon(2025, 1, 12), count: 4 }, // Sun -> week of Jan 12
        { date: localNoon(2025, 1, 13), count: 5 }, // Mon -> week of Jan 12
      ];

      const result = aggregateTimelineData(timeline, "weekly");

      expect(result.map(({ date, count }) => ({ date, count }))).toEqual([
        { date: "2025-01-05", count: 6 },
        { date: "2025-01-12", count: 9 },
      ]);
    });

    it("sorts weeks chronologically regardless of input order", () => {
      const timeline: Point[] = [
        { date: localNoon(2025, 1, 15), count: 1 },
        { date: localNoon(2025, 1, 1), count: 2 },
      ];
      expect(
        aggregateTimelineData(timeline, "weekly").map((p) => p.date)
      ).toEqual(["2024-12-29", "2025-01-12"]);
    });

    it("keeps only the latest 12 weeks", () => {
      // 14 consecutive Sundays starting 2025-01-05
      const timeline: Point[] = Array.from({ length: 14 }, (_, i) => {
        const d = new Date(2025, 0, 5 + i * 7, 12);
        return {
          date: localNoon(d.getFullYear(), d.getMonth() + 1, d.getDate()),
          count: i + 1,
        };
      });

      const result = aggregateTimelineData(timeline, "weekly");

      expect(result).toHaveLength(12);
      expect(result[0].count).toBe(3);
      expect(result[11].count).toBe(14);
    });

    it("produces a 'Mon D - Mon D' range label", () => {
      const result = aggregateTimelineData(
        [{ date: localNoon(2025, 1, 8), count: 1 }],
        "weekly"
      );
      expect(result[0].label).toMatch(/^[A-Z][a-z]{2} \d{1,2} - [A-Z][a-z]{2} \d{1,2}$/);
    });

    it.runIf(utcOrEast)(
      "labels the week as start..start+6 (UTC or east of UTC)",
      () => {
        const result = aggregateTimelineData(
          [
            { date: localNoon(2025, 1, 8), count: 1 },
            { date: localNoon(2024, 12, 31), count: 1 },
          ],
          "weekly"
        );
        expect(result.map((p) => p.label)).toEqual([
          "Dec 29 - Jan 4",
          "Jan 5 - Jan 11",
        ]);
      }
    );
  });

  describe("monthly", () => {
    it("buckets by local calendar month and sums counts", () => {
      const timeline: Point[] = [
        { date: localNoon(2025, 1, 1), count: 1 },
        { date: localNoon(2025, 1, 31), count: 2 },
        { date: localNoon(2025, 2, 1), count: 4 },
      ];

      const result = aggregateTimelineData(timeline, "monthly");

      expect(result.map(({ date, count }) => ({ date, count }))).toEqual([
        { date: "2025-01-01", count: 3 },
        { date: "2025-02-01", count: 4 },
      ]);
    });

    it("does NOT sort months: output follows first-seen insertion order", () => {
      const timeline: Point[] = [
        { date: localNoon(2025, 3, 10), count: 1 },
        { date: localNoon(2025, 1, 10), count: 2 },
        { date: localNoon(2025, 3, 11), count: 3 },
      ];
      expect(
        aggregateTimelineData(timeline, "monthly").map((p) => p.date)
      ).toEqual(["2025-03-01", "2025-01-01"]);
    });

    it("keeps only the last 12 months by insertion order", () => {
      // 14 consecutive months, Jan 2024 .. Feb 2025
      const timeline: Point[] = Array.from({ length: 14 }, (_, i) => {
        const d = new Date(2024, i, 15, 12);
        return {
          date: localNoon(d.getFullYear(), d.getMonth() + 1, d.getDate()),
          count: i + 1,
        };
      });

      const result = aggregateTimelineData(timeline, "monthly");

      expect(result).toHaveLength(12);
      expect(result[0].date).toBe("2024-03-01");
      expect(result[11].date).toBe("2025-02-01");
    });

    it.runIf(utcOrEast)("labels as 'Mon YYYY' (UTC or east of UTC)", () => {
      const result = aggregateTimelineData(
        [{ date: localNoon(2025, 3, 10), count: 1 }],
        "monthly"
      );
      expect(result[0].label).toBe("Mar 2025");
    });
  });

  describe("yearly", () => {
    it("buckets by local year, sums counts, and sorts ascending", () => {
      const timeline: Point[] = [
        { date: localNoon(2025, 6, 1), count: 5 },
        { date: localNoon(2023, 1, 1), count: 1 },
        { date: localNoon(2025, 12, 31), count: 2 },
        { date: localNoon(2024, 7, 4), count: 3 },
      ];

      expect(aggregateTimelineData(timeline, "yearly")).toEqual([
        { date: "2023-01-01", count: 1, label: "2023" },
        { date: "2024-01-01", count: 3, label: "2024" },
        { date: "2025-01-01", count: 7, label: "2025" },
      ]);
    });

    it("does not cap the number of years", () => {
      const timeline: Point[] = Array.from({ length: 15 }, (_, i) => ({
        date: localNoon(2000 + i, 6, 1),
        count: 1,
      }));
      expect(aggregateTimelineData(timeline, "yearly")).toHaveLength(15);
    });
  });
});
