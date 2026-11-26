import { describe, expect, it } from "vitest";
import type { VisitorRecord } from "../../types";
import {
  filterVisitorsByRange,
  getRangeFileTag,
  getRangeStart,
  getRangeTitle,
} from "./dateRanges";

// All dates are built with local-time constructors so assertions hold in any TZ.

function visitor(id: string, timeIn: Date | string): VisitorRecord {
  const iso = typeof timeIn === "string" ? timeIn : timeIn.toISOString();
  return {
    _id: id,
    fullName: `Visitor ${id}`,
    visitorType: "Guest",
    purpose: "Tour",
    destination: "Main Building",
    date: iso.slice(0, 10),
    timeIn: iso,
    timeOut: null,
    createdAt: iso,
    updatedAt: iso,
  };
}

describe("getRangeStart", () => {
  it("today -> local midnight of the same day", () => {
    const now = new Date(2025, 0, 8, 15, 30, 45, 123); // Wed
    expect(getRangeStart("today", now)).toEqual(new Date(2025, 0, 8, 0, 0, 0, 0));
  });

  it("week -> local midnight of the Monday of the current week (mid-week)", () => {
    const now = new Date(2025, 0, 8, 15, 30); // Wed Jan 8
    expect(getRangeStart("week", now)).toEqual(new Date(2025, 0, 6));
  });

  it("week -> on a Monday, starts that same Monday", () => {
    const now = new Date(2025, 0, 6, 10, 0); // Mon Jan 6
    expect(getRangeStart("week", now)).toEqual(new Date(2025, 0, 6));
  });

  it("week -> on a Sunday, starts the PREVIOUS Monday (ISO week)", () => {
    const now = new Date(2025, 0, 12, 23, 59); // Sun Jan 12
    expect(getRangeStart("week", now)).toEqual(new Date(2025, 0, 6));
  });

  it("week -> crosses month/year boundaries", () => {
    const now = new Date(2025, 0, 1, 9, 0); // Wed Jan 1 2025
    expect(getRangeStart("week", now)).toEqual(new Date(2024, 11, 30));
  });

  it("month -> local midnight of the 1st of the month", () => {
    const now = new Date(2025, 1, 28, 18, 0);
    expect(getRangeStart("month", now)).toEqual(new Date(2025, 1, 1));
  });

  it("does not mutate the provided `now`", () => {
    const now = new Date(2025, 0, 8, 15, 30);
    const copy = new Date(now);
    getRangeStart("today", now);
    getRangeStart("week", now);
    getRangeStart("month", now);
    expect(now).toEqual(copy);
  });
});

describe("filterVisitorsByRange", () => {
  const now = new Date(2025, 0, 8, 15, 0); // Wed Jan 8 2025, 15:00 local

  const records = [
    visitor("prev-month", new Date(2024, 11, 31, 12, 0)),
    visitor("month-start", new Date(2025, 0, 1, 0, 0)),
    visitor("last-week-sun", new Date(2025, 0, 5, 23, 59)),
    visitor("week-start", new Date(2025, 0, 6, 0, 0)),
    visitor("yesterday", new Date(2025, 0, 7, 9, 0)),
    visitor("today-start", new Date(2025, 0, 8, 0, 0)),
    visitor("today", new Date(2025, 0, 8, 10, 0)),
    visitor("exactly-now", new Date(2025, 0, 8, 15, 0)),
    visitor("later-today", new Date(2025, 0, 8, 16, 0)),
    visitor("invalid", "not-a-date"),
  ];

  const ids = (rs: VisitorRecord[]) => rs.map((r) => r._id);

  it("today: [local midnight, now], inclusive on both ends", () => {
    expect(ids(filterVisitorsByRange(records, "today", now))).toEqual([
      "today-start",
      "today",
      "exactly-now",
    ]);
  });

  it("week: from Monday 00:00 to now", () => {
    expect(ids(filterVisitorsByRange(records, "week", now))).toEqual([
      "week-start",
      "yesterday",
      "today-start",
      "today",
      "exactly-now",
    ]);
  });

  it("month: from the 1st 00:00 to now", () => {
    expect(ids(filterVisitorsByRange(records, "month", now))).toEqual([
      "month-start",
      "last-week-sun",
      "week-start",
      "yesterday",
      "today-start",
      "today",
      "exactly-now",
    ]);
  });

  it("excludes records after `now` and records with an unparseable timeIn", () => {
    const result = ids(filterVisitorsByRange(records, "month", now));
    expect(result).not.toContain("later-today");
    expect(result).not.toContain("invalid");
  });

  it("returns [] for an empty list", () => {
    expect(filterVisitorsByRange([], "today", now)).toEqual([]);
  });
});

describe("getRangeTitle / getRangeFileTag", () => {
  it.each([
    ["today", "Visitor Records - Today", "today"],
    ["week", "Visitor Records - This Week", "this-week"],
    ["month", "Visitor Records - This Month", "this-month"],
  ] as const)("%s", (range, title, tag) => {
    expect(getRangeTitle(range)).toBe(title);
    expect(getRangeFileTag(range)).toBe(tag);
  });
});
