import { describe, expect, it } from "vitest";
import { isNonEmpty, isValidEmail } from "./validation";

describe("isValidEmail", () => {
  it.each(["a@b.co", "first.last+tag@example.com", "  padded@example.org  "])(
    "accepts %j",
    (email) => {
      expect(isValidEmail(email)).toBe(true);
    }
  );

  it.each(["", "   ", "plain", "a@b", "@b.co", "a@.co", "a b@c.de", "a@b.co m"])(
    "rejects %j",
    (email) => {
      expect(isValidEmail(email)).toBe(false);
    }
  );

  it("is permissive: only checks <non-space>@<non-space>.<non-space>", () => {
    expect(isValidEmail("a@@b.c")).toBe(true);
    expect(isValidEmail("a@b..c")).toBe(true);
  });
});

describe("isNonEmpty", () => {
  it("is false for empty or whitespace-only strings", () => {
    expect(isNonEmpty("")).toBe(false);
    expect(isNonEmpty(" \t\n ")).toBe(false);
  });

  it("is true when any non-whitespace character is present", () => {
    expect(isNonEmpty(" x ")).toBe(true);
  });
});
