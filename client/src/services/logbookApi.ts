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

export type LogbookStatsSummary = {
  todayCount: number;
  weekCount: number;
  monthCount: number;
  visitsPerDestination: { destination: string; count: number }[];
  visitsTimeline: { date: string; count: number }[];
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
  createEntry(entry: LogbookEntry) {
    return apiRequest<LogbookEntryResponse>("/logbook", {
      method: "POST",
      body: entry,
    });
  },

  updateTimeout(entryId: string) {
    return apiRequest<LogbookEntryResponse>(`/logbook/${entryId}/timeout`, {
      method: "PATCH",
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
