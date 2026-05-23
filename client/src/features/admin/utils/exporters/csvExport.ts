import type { ExportRange, VisitorRecord } from "../../types";
import { filterVisitorsByRange, getRangeFileTag } from "./dateRanges";

const COLUMNS = [
  "Full Name",
  "Visitor Type",
  "Destination",
  "Purpose",
  "Date",
  "Time In",
  "Time Out",
];

function escapeCsvCell(val: unknown): string {
  const s = val == null ? "" : String(val);
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function visitorToRow(v: VisitorRecord): string {
  return [
    v.fullName,
    v.visitorType,
    v.destination,
    v.purpose,
    v.date ? new Date(v.date).toLocaleDateString() : "",
    v.timeIn ? new Date(v.timeIn).toLocaleString() : "",
    v.timeOut ? new Date(v.timeOut).toLocaleString() : "In Progress",
  ]
    .map(escapeCsvCell)
    .join(",");
}

function buildCsv(visitors: VisitorRecord[]): string {
  const lines = [COLUMNS.join(","), ...visitors.map(visitorToRow)];
  // UTF-8 BOM so Excel detects encoding correctly.
  return "\uFEFF" + lines.join("\r\n");
}

function downloadCsv(csv: string, fileName: string): void {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

export function exportVisitorsToCsv(
  visitors: VisitorRecord[],
  range: ExportRange
): void {
  const now = new Date();
  const filtered = filterVisitorsByRange(visitors, range, now);
  const csv = buildCsv(filtered);

  const stamp = now.toISOString().slice(0, 10);
  const fileName = `visitors-${getRangeFileTag(range)}-${stamp}.csv`;
  downloadCsv(csv, fileName);
}
