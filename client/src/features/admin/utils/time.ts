export function toDatetimeLocal(value?: string | null): string {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
}

const DATE_ONLY_RE = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Formats a date/ISO string as a local-calendar `YYYY-MM-DD` for
 * `<input type="date">`. A value that is already a bare `YYYY-MM-DD` is
 * returned unchanged (it is a calendar date, not an instant, so it must not
 * be shifted through UTC).
 */
export function toDateInputValue(iso?: string | null): string {
  if (!iso) return "";
  if (DATE_ONLY_RE.test(iso)) {
    const [y, m, day] = iso.split("-").map(Number);
    const d = new Date(y, m - 1, day);
    return d.getFullYear() === y && d.getMonth() === m - 1 && d.getDate() === day
      ? iso
      : "";
  }
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function formatTimeAgo(iso: string): string {
  const t = new Date(iso).getTime();
  if (!Number.isFinite(t)) return "";
  const diffSec = Math.max(0, Math.round((Date.now() - t) / 1000));

  if (diffSec < 30) return "Just now";
  if (diffSec < 60) return `${diffSec}s ago`;

  const minutes = Math.floor(diffSec / 60);
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;

  return new Date(iso).toLocaleDateString();
}
