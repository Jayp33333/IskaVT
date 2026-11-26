import { describe, expect, it } from "vitest";
import type { VisitorRecord } from "../../types";
import { buildCsv } from "./csvExport";

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

function dataRow(csv: string): string {
  return csv.split("\r\n")[1];
}

describe("buildCsv", () => {
  it("starts with a UTF-8 BOM and the header row", () => {
    const csv = buildCsv([]);
    expect(csv.charCodeAt(0)).toBe(0xfeff);
    expect(csv.slice(1)).toBe(
      "Full Name,Visitor Type,Destination,Purpose,Date,Time In,Time Out"
    );
  });

  it("prefixes formula-triggering cells with a single quote", () => {
    const row = dataRow(
      buildCsv([
        visitor({
          fullName: "=1+1",
          visitorType: "+cmd",
          destination: "-2+3",
          purpose: "@SUM(A1)",
        }),
      ])
    );
    expect(row.startsWith("'=1+1,'+cmd,'-2+3,'@SUM(A1),")).toBe(true);
  });

  it("neutralizes and still quotes when a formula cell contains commas", () => {
    const row = dataRow(buildCsv([visitor({ fullName: '=HYPERLINK("http://x","y")' })]));
    expect(row.startsWith(`"'=HYPERLINK(""http://x"",""y"")",`)).toBe(true);
  });

  it("quotes cells containing quotes, commas and newlines", () => {
    const row = dataRow(
      buildCsv([
        visitor({
          fullName: 'Juan "JD" Cruz',
          visitorType: "Guest, VIP",
          destination: "Line1\nLine2",
        }),
      ])
    );
    expect(row.startsWith(`"Juan ""JD"" Cruz","Guest, VIP","Line1\nLine2",Tour,`)).toBe(
      true
    );
  });

  it("marks visitors without timeOut as In Progress", () => {
    expect(dataRow(buildCsv([visitor()])).endsWith(",In Progress")).toBe(true);
  });
});
