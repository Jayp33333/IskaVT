import { describe, expect, it } from "vitest";
import { DESTINATIONS } from "../sampleData";
import {
  LOGBOOK_DESTINATIONS,
  LOGBOOK_VISITOR_TYPES,
  withCurrentOption,
} from "./logbookOptions";

describe("LOGBOOK_DESTINATIONS", () => {
  it("matches sampleData DESTINATIONS names exactly (same names, same order)", () => {
    expect([...LOGBOOK_DESTINATIONS]).toEqual(DESTINATIONS.map((d) => d.name));
  });

  it("has no duplicate names (they are used as option keys)", () => {
    expect(new Set(LOGBOOK_DESTINATIONS).size).toBe(LOGBOOK_DESTINATIONS.length);
  });
});

describe("LOGBOOK_VISITOR_TYPES", () => {
  it("is the public form's visitor-type list", () => {
    expect([...LOGBOOK_VISITOR_TYPES]).toEqual([
      "Student",
      "Faculty",
      "Staff",
      "Visitor",
      "Alumni",
      "Guest",
    ]);
  });
});

describe("withCurrentOption", () => {
  const options = ["A", "B"] as const;

  it("returns the same list when current is already an option", () => {
    expect(withCurrentOption(options, "B")).toBe(options);
  });

  it.each([undefined, null, "", "   "])("returns the same list for blank current %j", (current) => {
    expect(withCurrentOption(options, current)).toBe(options);
  });

  it("appends a legacy value that is not in the list, without mutating the input", () => {
    expect(withCurrentOption(options, "Lab 1")).toEqual(["A", "B", "Lab 1"]);
    expect(options).toEqual(["A", "B"]);
  });
});
