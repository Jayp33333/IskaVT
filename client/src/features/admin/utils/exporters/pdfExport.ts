import type { ExportRange, VisitorRecord } from "../../types";
import { filterVisitorsByRange, getRangeTitle } from "./dateRanges";
import { escapeHtml } from "./escape";

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
  // Every cell is visitor-controlled (public logbook form): always escape.
  return `<tr>${cells.map((c) => `<td>${escapeHtml(c)}</td>`).join("")}</tr>`;
}

export class PopupBlockedError extends Error {
  constructor() {
    super("Popup blocked. Please allow popups to export PDF.");
    this.name = "PopupBlockedError";
  }
}

/**
 * Pure builder for the printable HTML document. All interpolated values are
 * HTML-escaped so visitor-supplied text can never become markup or script in
 * the same-origin print window.
 */
export function buildPrintHtml(
  visitors: VisitorRecord[],
  range: ExportRange,
  now: Date
): string {
  const filtered = filterVisitorsByRange(visitors, range, now);
  const title = escapeHtml(getRangeTitle(range));

  const headerCells = COLUMNS.map((h) => `<th>${escapeHtml(h)}</th>`).join("");
  const rows = filtered.map(buildRow).join("");
  const generated = escapeHtml(now.toLocaleString());
  const total = escapeHtml(filtered.length);

  return `
    <html>
      <head>
        <title>${title}</title>
        <style>${PRINT_STYLES}</style>
      </head>
      <body>
        <h1>${title}</h1>
        <div class="meta">Generated: ${generated} &mdash; Total records: ${total}</div>
        <table>
          <thead><tr>${headerCells}</tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </body>
    </html>
  `;
}

export function exportVisitorsToPdf(
  visitors: VisitorRecord[],
  range: ExportRange
): void {
  const now = new Date();

  const win = window.open("", "_blank");
  if (!win) throw new PopupBlockedError();

  win.document.write(buildPrintHtml(visitors, range, now));
  win.document.close();
  // Sever the back-reference to the admin window to reduce exposure.
  win.opener = null;
  win.focus();
  win.print();
}
