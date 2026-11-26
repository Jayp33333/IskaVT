import { describe, expect, it } from "vitest";
import { validateContactForm } from "./validateContactForm";

const REQUIRED = "Please fill in your name, email, and message.";
const BAD_EMAIL = "Please enter a valid email address.";

describe("validateContactForm", () => {
  it.each([
    { name: "", email: "a@b.co", message: "Hi" },
    { name: "Ana", email: "", message: "Hi" },
    { name: "Ana", email: "a@b.co", message: "" },
    { name: "   ", email: "a@b.co", message: "Hi" },
  ])("requires every field (%j)", (fields) => {
    expect(validateContactForm(fields)).toEqual({ ok: false, message: REQUIRED });
  });

  it("checks for missing fields before email format", () => {
    expect(
      validateContactForm({ name: "", email: "bad", message: "Hi" })
    ).toEqual({ ok: false, message: REQUIRED });
  });

  it("rejects an invalid email", () => {
    expect(
      validateContactForm({ name: "Ana", email: "not-an-email", message: "Hi" })
    ).toEqual({ ok: false, message: BAD_EMAIL });
  });

  it("returns trimmed data on success", () => {
    expect(
      validateContactForm({
        name: "  Ana Cruz ",
        email: " ana@example.com ",
        message: "\n Hello there \n",
      })
    ).toEqual({
      ok: true,
      data: { name: "Ana Cruz", email: "ana@example.com", message: "Hello there" },
    });
  });
});
