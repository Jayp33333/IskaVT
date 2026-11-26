import { afterEach, describe, expect, it, vi } from "vitest";
import type { VisitorRecord } from "../../types";
import { PopupBlockedError, buildPrintHtml, exportVisitorsToPdf } from "./pdfExport";

const NOW = new Date(2025, 0, 8, 15, 0);

const XSS_NAME = "<img src=x onerror=alert(1)>";
const XSS_PURPOSE = "</td><script>alert(1)</script>";

function visitor(overrides: Partial<VisitorRecord> = {}): VisitorRecord {
  const iso = new Date(2025, 0, 8, 9, 0).toISOString();
  return {
    _id: "v1",
    fullName: "Visitor",
    visitorType: "Guest",
    purpose: "Tour",
    destination: "Main Building",
    date: iso.slice(0, 10),
    timeIn: iso,
    timeOut: null,
    createdAt: iso,
    updatedAt: iso,
    ...overrides,
  };
}

function parse(html: string): Document {
  return new DOMParser().parseFromString(html, "text/html");
}

describe("buildPrintHtml", () => {
  it("renders visitor-supplied markup only as escaped text", () => {
    const html = buildPrintHtml(
      [
        visitor({
          fullName: XSS_NAME,
          purpose: XSS_PURPOSE,
          destination: `"><svg onload=alert(1)>`,
          visitorType: "' onmouseover='alert(1)",
        }),
      ],
      "today",
      NOW
    );
    const doc = parse(html);

    expect(doc.querySelectorAll("img, script, svg").length).toBe(0);
    expect(doc.querySelectorAll("[onerror], [onload], [onmouseover]").length).toBe(0);

    const cells = Array.from(doc.querySelectorAll("tbody td"));
    expect(cells).toHaveLength(7);
    expect(cells[0].textContent).toBe(XSS_NAME);
    expect(cells[1].textContent).toBe("' onmouseover='alert(1)");
    expect(cells[2].textContent).toBe(`"><svg onload=alert(1)>`);
    expect(cells[3].textContent).toBe(XSS_PURPOSE);
    expect(cells[6].textContent).toBe("In Progress");
  });

  it("keeps the title, header and meta line", () => {
    const doc = parse(buildPrintHtml([visitor()], "today", NOW));
    expect(doc.querySelector("h1")?.textContent).toBeTruthy();
    expect(doc.title).toBe(doc.querySelector("h1")?.textContent);
    expect(doc.querySelectorAll("thead th")).toHaveLength(7);
    expect(doc.querySelector(".meta")?.textContent).toContain("Total records: 1");
  });

  it("only includes visitors within the range", () => {
    const old = visitor({
      _id: "old",
      timeIn: new Date(2024, 0, 1, 9, 0).toISOString(),
      createdAt: new Date(2024, 0, 1, 9, 0).toISOString(),
      date: "2024-01-01",
    });
    const doc = parse(buildPrintHtml([visitor(), old], "today", NOW));
    expect(doc.querySelectorAll("tbody tr")).toHaveLength(1);
  });
});

describe("exportVisitorsToPdf", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("throws PopupBlockedError when the popup is blocked", () => {
    vi.spyOn(window, "open").mockReturnValue(null);
    expect(() => exportVisitorsToPdf([visitor()], "today")).toThrow(PopupBlockedError);
  });

  it("writes escaped HTML, detaches opener, and prints", () => {
    const write = vi.fn();
    const fakeWin = {
      document: { write, close: vi.fn() },
      focus: vi.fn(),
      print: vi.fn(),
      opener: window as unknown,
    };
    vi.spyOn(window, "open").mockReturnValue(fakeWin as unknown as Window);

    exportVisitorsToPdf([visitor({ fullName: XSS_NAME })], "month");

    expect(write).toHaveBeenCalledTimes(1);
    const written = String(write.mock.calls[0][0]);
    expect(written).not.toContain("<img");
    expect(fakeWin.opener).toBeNull();
    expect(fakeWin.print).toHaveBeenCalledTimes(1);
  });
});
