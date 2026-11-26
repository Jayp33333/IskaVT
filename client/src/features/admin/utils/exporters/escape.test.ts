import { describe, expect, it } from "vitest";
import { escapeHtml, neutralizeCsvFormula } from "./escape";

describe("escapeHtml", () => {
  it("escapes the five HTML-significant characters", () => {
    expect(escapeHtml(`<a href="x" title='y'>&</a>`)).toBe(
      "&lt;a href=&quot;x&quot; title=&#39;y&#39;&gt;&amp;&lt;/a&gt;"
    );
  });

  it("escapes & exactly once (no ordering bug)", () => {
    expect(escapeHtml("&lt;")).toBe("&amp;lt;");
  });

  it("returns '' for null and undefined", () => {
    expect(escapeHtml(null)).toBe("");
    expect(escapeHtml(undefined)).toBe("");
  });

  it("stringifies non-string values", () => {
    expect(escapeHtml(42)).toBe("42");
    expect(escapeHtml(false)).toBe("false");
  });

  it("leaves plain text untouched", () => {
    expect(escapeHtml("Juan Dela Cruz")).toBe("Juan Dela Cruz");
  });
});

describe("neutralizeCsvFormula", () => {
  it.each(["=1+1", "+cmd", "-2+3", "@SUM(A1)", "\tfoo", "\rbar"])(
    "prefixes %j with a single quote",
    (input) => {
      expect(neutralizeCsvFormula(input)).toBe(`'${input}`);
    }
  );

  it("leaves safe values and empty strings alone", () => {
    expect(neutralizeCsvFormula("Guest")).toBe("Guest");
    expect(neutralizeCsvFormula("a=b")).toBe("a=b");
    expect(neutralizeCsvFormula("")).toBe("");
  });
});
