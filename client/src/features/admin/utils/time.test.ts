import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { formatTimeAgo, toDateInputValue, toDatetimeLocal } from "./time";

describe("toDatetimeLocal", () => {
  it.each([undefined, null, ""])("returns '' for %j", (value) => {
    expect(toDatetimeLocal(value)).toBe("");
  });

  it("returns '' for an unparseable string", () => {
    expect(toDatetimeLocal("not-a-date")).toBe("");
  });

  it("formats an ISO instant as local YYYY-MM-DDTHH:mm (seconds dropped)", () => {
    const iso = new Date(2025, 0, 8, 9, 5, 59).toISOString();
    expect(toDatetimeLocal(iso)).toBe("2025-01-08T09:05");
  });

  it("round-trips a datetime-local value (parsed as local time)", () => {
    expect(toDatetimeLocal("2025-12-31T23:07")).toBe("2025-12-31T23:07");
  });

  it("zero-pads month, day, hour and minute", () => {
    const iso = new Date(2025, 2, 4, 1, 2).toISOString();
    expect(toDatetimeLocal(iso)).toBe("2025-03-04T01:02");
  });
});

describe("toDateInputValue", () => {
  it.each([undefined, null, ""])("returns '' for %j", (value) => {
    expect(toDateInputValue(value)).toBe("");
  });

  it("returns '' for an unparseable string", () => {
    expect(toDateInputValue("nope")).toBe("");
  });

  it("returns the UTC calendar date (toISOString), not the local date", () => {
    expect(toDateInputValue("2025-01-08T00:30:00.000Z")).toBe("2025-01-08");
    expect(toDateInputValue("2025-01-08T23:30:00.000Z")).toBe("2025-01-08");
    const local = new Date(2025, 0, 8, 12, 0);
    expect(toDateInputValue(local.toISOString())).toBe(
      local.toISOString().slice(0, 10)
    );
  });
});

describe("formatTimeAgo", () => {
  const NOW = new Date(2025, 0, 8, 12, 0, 0);
  const ago = (ms: number) => new Date(NOW.getTime() - ms).toISOString();
  const SEC = 1000;
  const MIN = 60 * SEC;
  const HOUR = 60 * MIN;
  const DAY = 24 * HOUR;

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(NOW);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns '' for an unparseable timestamp", () => {
    expect(formatTimeAgo("garbage")).toBe("");
  });

  it.each([
    [0, "Just now"],
    [29 * SEC, "Just now"],
    [30 * SEC, "30s ago"],
    [59 * SEC, "59s ago"],
    [60 * SEC, "1m ago"],
    [59 * MIN + 59 * SEC, "59m ago"],
    [HOUR, "1h ago"],
    [23 * HOUR + 59 * MIN, "23h ago"],
    [DAY, "1d ago"],
    [6 * DAY + 23 * HOUR, "6d ago"],
  ])("%i ms ago -> %s", (ms, expected) => {
    expect(formatTimeAgo(ago(ms))).toBe(expected);
  });

  it("clamps future timestamps to 'Just now'", () => {
    expect(formatTimeAgo(ago(-10 * MIN))).toBe("Just now");
  });

  it("falls back to toLocaleDateString() at 7 days or more", () => {
    const iso = ago(7 * DAY);
    expect(formatTimeAgo(iso)).toBe(new Date(iso).toLocaleDateString());
  });
});
