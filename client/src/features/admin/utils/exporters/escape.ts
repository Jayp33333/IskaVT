const HTML_ENTITIES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

/**
 * Escape a value for safe interpolation into HTML text or a quoted attribute.
 * null/undefined become an empty string; everything else is stringified.
 */
export function escapeHtml(value: unknown): string {
  if (value == null) return "";
  return String(value).replace(/[&<>"']/g, (ch) => HTML_ENTITIES[ch]);
}

const FORMULA_TRIGGERS = new Set(["=", "+", "-", "@", "\t", "\r"]);

/**
 * Neutralize spreadsheet formula injection (CSV injection) by prefixing a
 * single quote when the cell starts with = + - @ TAB or CR, so Excel/Sheets
 * treat it as text instead of evaluating it.
 *
 * This always prefixes, including values like "-5" that look like negative
 * numbers. The visitor export has no numeric columns (every column is free
 * text or a pre-formatted date/time string), so that trade-off is acceptable.
 */
export function neutralizeCsvFormula(s: string): string {
  if (s.length > 0 && FORMULA_TRIGGERS.has(s[0])) return `'${s}`;
  return s;
}
