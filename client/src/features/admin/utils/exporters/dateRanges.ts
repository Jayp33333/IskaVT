import type { ExportRange, VisitorRecord } from "../../types";

export function getRangeStart(range: ExportRange, now: Date = new Date()): Date {
  if (range === "today") {
    const start = new Date(now);
    start.setHours(0, 0, 0, 0);
    return start;
  }

  if (range === "week") {
    const start = new Date(now);
    start.setHours(0, 0, 0, 0);
    const day = start.getDay();
    const diffToMonday = (day + 6) % 7;
    start.setDate(start.getDate() - diffToMonday);
    return start;
  }

  return new Date(now.getFullYear(), now.getMonth(), 1);
}

export function filterVisitorsByRange(
  visitors: VisitorRecord[],
  range: ExportRange,
  now: Date = new Date()
): VisitorRecord[] {
  const start = getRangeStart(range, now);
  return visitors.filter((v) => {
    const t = new Date(v.timeIn);
    return t >= start && t <= now;
  });
}

export function getRangeTitle(range: ExportRange): string {
  switch (range) {
    case "today":
      return "Visitor Records - Today";
    case "week":
      return "Visitor Records - This Week";
    case "month":
      return "Visitor Records - This Month";
  }
}

export function getRangeFileTag(range: ExportRange): string {
  return range === "today" ? "today" : range === "week" ? "this-week" : "this-month";
}
