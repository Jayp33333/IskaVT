import { describe, expect, it } from "vitest";
import {
  todayLocalDate,
  validateVisitorForm,
  VISITOR_FULL_NAME_MAX,
  VISITOR_PURPOSE_MAX,
  type VisitorFormValues,
} from "./visitorForm";

const timeIn = new Date(2025, 0, 8, 9, 0).toISOString();
const valid: VisitorFormValues = {
  fullName: "  Juan Dela Cruz ",
  visitorType: "Student",
  destination: "PUP Gymnasium",
  purpose: " Enrollment ",
  date: "2025-01-08",
  timeIn,
};

describe("todayLocalDate", () => {
  it("uses the local calendar date, not UTC", () => {
    expect(todayLocalDate(new Date(2025, 0, 8, 0, 15))).toBe("2025-01-08");
    expect(todayLocalDate(new Date(2025, 0, 8, 23, 45))).toBe("2025-01-08");
  });
});

describe("validateVisitorForm", () => {
  it("trims text fields and normalizes the entry (add mode)", () => {
    const result = validateVisitorForm(valid, { mode: "add" });
    expect(result).toEqual({
      ok: true,
      value: {
        fullName: "Juan Dela Cruz",
        visitorType: "Student",
        destination: "PUP Gymnasium",
        purpose: "Enrollment",
        date: "2025-01-08",
        timeIn,
        timeOut: undefined,
      },
    });
  });

  it("returns '' for a blank timeOut in edit mode so the backend clears it", () => {
    const result = validateVisitorForm({ ...valid, timeOut: "" }, { mode: "edit" });
    expect(result.ok && result.value.timeOut).toBe("");
  });

  it("reports every missing required field at once", () => {
    const result = validateVisitorForm(
      { fullName: " ", visitorType: "", destination: undefined, purpose: "\n", timeIn },
      { mode: "add" }
    );
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(Object.keys(result.errors).sort()).toEqual(
      ["destination", "fullName", "purpose", "visitorType"].sort()
    );
  });

  it("enforces backend max lengths on fullName and purpose", () => {
    const ok = validateVisitorForm(
      {
        ...valid,
        fullName: "a".repeat(VISITOR_FULL_NAME_MAX),
        purpose: "b".repeat(VISITOR_PURPOSE_MAX),
      },
      { mode: "add" }
    );
    expect(ok.ok).toBe(true);

    const tooLong = validateVisitorForm(
      {
        ...valid,
        fullName: "a".repeat(VISITOR_FULL_NAME_MAX + 1),
        purpose: "b".repeat(VISITOR_PURPOSE_MAX + 1),
      },
      { mode: "add" }
    );
    expect(tooLong.ok).toBe(false);
    if (tooLong.ok) return;
    expect(tooLong.errors.fullName).toMatch(/120/);
    expect(tooLong.errors.purpose).toMatch(/500/);
  });

  it.each([undefined, "", "not-a-date"])("requires a valid timeIn (%j)", (value) => {
    const result = validateVisitorForm({ ...valid, timeIn: value }, { mode: "add" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors.timeIn).toBeTruthy();
  });

  it("rejects a timeOut before timeIn", () => {
    const before = new Date(2025, 0, 8, 8, 59).toISOString();
    const result = validateVisitorForm({ ...valid, timeOut: before }, { mode: "edit" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors.timeOut).toBeTruthy();
  });

  it("accepts a timeOut equal to or after timeIn", () => {
    const after = new Date(2025, 0, 8, 17, 0).toISOString();
    expect(validateVisitorForm({ ...valid, timeOut: timeIn }, { mode: "edit" }).ok).toBe(true);
    const result = validateVisitorForm({ ...valid, timeOut: after }, { mode: "edit" });
    expect(result.ok && result.value.timeOut).toBe(after);
  });

  it("rejects an unparseable timeOut", () => {
    const result = validateVisitorForm({ ...valid, timeOut: "garbage" }, { mode: "add" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors.timeOut).toBeTruthy();
  });

  it("normalizes a full ISO date to the local YYYY-MM-DD", () => {
    const iso = new Date(2025, 5, 3, 7, 30).toISOString();
    const result = validateVisitorForm({ ...valid, date: iso }, { mode: "edit" });
    expect(result.ok && result.value.date).toBe("2025-06-03");
  });

  it("falls back to the local date of timeIn when date is blank", () => {
    const result = validateVisitorForm({ ...valid, date: "" }, { mode: "add" });
    expect(result.ok && result.value.date).toBe("2025-01-08");
  });

  it("rejects an invalid date", () => {
    const result = validateVisitorForm({ ...valid, date: "2025-13-40" }, { mode: "add" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors.date).toBeTruthy();
  });
});
