import type { ExportRange, VisitorRecord } from "../../types";
import { filterVisitorsByRange, getRangeTitle } from "./dateRanges";

const PRINT_STYLES = `
  body { font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; font-size: 12px; padding: 16px; }
  h1 { font-size: 18px; margin-bottom: 8px; }
  table { border-collapse: collapse; width: 100%; }
  th, td { border: 1px solid #ddd; padding: 4px 6px; text-align: left; }
  th { background: #f3f3f3; }
  .meta { font-size: 11px; color: #555; margin-bottom: 12px; }
`;

const COLUMNS = [
  "Full Name",
  "Visitor Type",
  "Destination",
  "Purpose",
  "Date",
  "Time In",
  "Time Out",
];

function formatTime(value?: string | null): string {
  if (!value) return "";
  return new Date(value).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function buildRow(v: VisitorRecord): string {
  const cells = [
    v.fullName || "",
    v.visitorType || "",
    v.destination || "",
    v.purpose || "",
    v.date ? new Date(v.date).toLocaleDateString() : "",
    formatTime(v.timeIn),
    v.timeOut ? formatTime(v.timeOut) : "In Progress",
  ];
  return `<tr>${cells.map((c) => `<td>${c}</td>`).join("")}</tr>`;
}

export class PopupBlockedError extends Error {
  constructor() {
    super("Popup blocked. Please allow popups to export PDF.");
    this.name = "PopupBlockedError";
  }
}

export function exportVisitorsToPdf(
  visitors: VisitorRecord[],
  range: ExportRange
): void {
  const now = new Date();
  const filtered = filterVisitorsByRange(visitors, range, now);
  const title = getRangeTitle(range);

  const win = window.open("", "_blank");
  if (!win) throw new PopupBlockedError();

  const headerCells = COLUMNS.map((h) => `<th>${h}</th>`).join("");
  const rows = filtered.map(buildRow).join("");

  win.document.write(`
    <html>
      <head>
        <title>${title}</title>
        <style>${PRINT_STYLES}</style>
      </head>
      <body>
        <h1>${title}</h1>
        <div class="meta">Generated: ${now.toLocaleString()} &mdash; Total records: ${filtered.length}</div>
        <table>
          <thead><tr>${headerCells}</tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </body>
    </html>
  `);

  win.document.close();
  win.focus();
  win.print();
}
