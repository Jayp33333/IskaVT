import type { ExportFormat, ExportRange, VisitorRecord } from "../../types";
import { exportVisitorsToCsv } from "./csvExport";
import { exportVisitorsToPdf } from "./pdfExport";

export { PopupBlockedError } from "./pdfExport";

export function exportVisitors(
  visitors: VisitorRecord[],
  range: ExportRange,
  format: ExportFormat
): void {
  if (format === "csv") {
    exportVisitorsToCsv(visitors, range);
    return;
  }
  exportVisitorsToPdf(visitors, range);
}
