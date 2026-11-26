import { apiRequest, buildQuery } from "./apiClient";

export type LogbookEntry = {
  fullName: string;
  visitorType: string;
  purpose: string;
  destination: string;
  date?: string;
  timeIn?: string;
  timeOut?: string;
};

export type LogbookRecord = {
  _id: string;
  fullName: string;
  visitorType: string;
  purpose: string;
  destination: string;
  date: string;
  timeIn: string;
  timeOut: string | null;
  createdAt: string;
  updatedAt: string;
};

export type LogbookPeriodCounts = {
  todayCount: number;
  weekCount: number;
  monthCount: number;
};

/**
 * Response of GET /logbook/stats/summary.
 *
 * Fields marked optional were added in Wave 1 (roadmap 1.4/1.5). The UI must
 * tolerate an older backend that omits them, so treat them as possibly
 * undefined at runtime.
 */
export type LogbookStatsSummary = LogbookPeriodCounts & {
  /** IANA timezone the server bucketed dates in (e.g. "Asia/Manila"). */
  timezone?: string;
  /** Open sessions (no timeOut) that started today in `timezone`. */
  activeCount?: number;
  /** Same elapsed span of the previous day / week / month. */
  previous?: Partial<LogbookPeriodCounts>;
  /** Last 84 days, tz-local 'YYYY-MM-DD', ascending, only days with data. */
  visitsTimeline: { date: string; count: number }[];
  /** Last 12 months, 'YYYY-MM', ascending, only months with data. */
  visitsByMonth?: { month: string; count: number }[];
  /** All years, ascending. */
  visitsByYear?: { year: number; count: number }[];
  visitsPerDestination: { destination: string; count: number }[];
  visitsByVisitorType?: { visitorType: string; count: number }[];
  visitsByHour?: { hour: number; count: number }[];
  visitsByDayOfWeek?: { day: number; count: number }[];
  avgDurationMinutes?: number;
  durationBuckets?: { label: string; count: number }[];
};

export type Pagination = {
  page: number;
  limit: number;
  total: number;
  pages: number;
};

export type LogbookListResponse = {
  success: boolean;
  data: LogbookRecord[];
  pagination: Pagination;
};

export type LogbookEntryResponse = {
  success: boolean;
  data: LogbookRecord;
};

export const logbookAPI = {
  /** Admin create: sends the admin token so date/timeIn/timeOut are honored. */
  createEntry(entry: LogbookEntry) {
    return apiRequest<LogbookEntryResponse>("/logbook", {
      method: "POST",
      body: entry,
    });
  },

  // Public tour calls never send a token: a stale admin session left in a
  // kiosk browser must not break (or be expired by) visitor sign-ins.

  /** Visitor sign-in from the tour. The server stamps date/time itself. */
  createPublicEntry(entry: LogbookEntry) {
    return apiRequest<LogbookEntryResponse>("/logbook", {
      method: "POST",
      body: entry,
      skipAuth: true,
    });
  },

  updateTimeout(entryId: string) {
    return apiRequest<LogbookEntryResponse>(`/logbook/${entryId}/timeout`, {
      method: "PATCH",
      skipAuth: true,
    });
  },

  getEntry(entryId: string) {
    return apiRequest<LogbookEntryResponse>(`/logbook/${entryId}`, {
      skipAuth: true,
    });
  },

  getEntries(page = 1, limit = 50) {
    return apiRequest<LogbookListResponse>(
      `/logbook${buildQuery({ page, limit })}`
    );
  },

  updateEntry(entryId: string, patch: Partial<LogbookEntry>) {
    return apiRequest<LogbookEntryResponse>(`/logbook/${entryId}`, {
      method: "PATCH",
      body: patch,
    });
  },

  deleteEntry(entryId: string) {
    return apiRequest<LogbookEntryResponse>(`/logbook/${entryId}`, {
      method: "DELETE",
    });
  },

  getStatsSummary() {
    return apiRequest<{ success: boolean; data: LogbookStatsSummary }>(
      "/logbook/stats/summary"
    );
  },
};
