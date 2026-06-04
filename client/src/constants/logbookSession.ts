export const LOGBOOK_ENTRY_ID_KEY = "logbookEntryId";
export const LOGBOOK_TIME_IN_KEY = "logbookTimeIn";
export const LOGBOOK_FULL_NAME_KEY = "logbookFullName";
/** @deprecated Legacy key — read for migration only */
const LOGBOOK_FULL_NAME_LEGACY_KEY = "logbookVisitorName";

export function getSessionFullName(): string | null {
  if (typeof window === "undefined") return null;
  const name =
    localStorage.getItem(LOGBOOK_FULL_NAME_KEY) ??
    localStorage.getItem(LOGBOOK_FULL_NAME_LEGACY_KEY);
  return name?.trim() ? name.trim() : null;
}

export function setSessionFullName(fullName: string): void {
  const trimmed = fullName.trim();
  if (!trimmed) return;
  localStorage.setItem(LOGBOOK_FULL_NAME_KEY, trimmed);
  localStorage.removeItem(LOGBOOK_FULL_NAME_LEGACY_KEY);
}

export function clearLogbookSession(): void {
  localStorage.removeItem(LOGBOOK_ENTRY_ID_KEY);
  localStorage.removeItem(LOGBOOK_TIME_IN_KEY);
  localStorage.removeItem(LOGBOOK_FULL_NAME_KEY);
  localStorage.removeItem(LOGBOOK_FULL_NAME_LEGACY_KEY);
}
