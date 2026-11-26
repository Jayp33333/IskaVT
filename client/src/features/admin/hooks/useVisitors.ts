import { useCallback, useMemo, useRef, useState } from "react";
import {
  logbookAPI,
  type LogbookEntry,
} from "../../../services/api";
import type { VisitorRecord } from "../types";

const PAGE_SIZE = 200;

export type UseVisitorsValue = {
  visitors: VisitorRecord[];
  visitorsPage: number;
  visitorsTotalPages: number;
  visitorsLoading: boolean;
  searchQuery: string;
  filteredVisitors: VisitorRecord[];
  setSearchQuery: (q: string) => void;
  loadVisitors: (page: number) => Promise<void>;
  createVisitor: (entry: LogbookEntry) => Promise<void>;
  updateVisitor: (id: string, patch: Partial<LogbookEntry>) => Promise<void>;
  deleteVisitor: (id: string) => Promise<void>;
  fetchAllVisitors: () => Promise<VisitorRecord[]>;
};

export function useVisitors(): UseVisitorsValue {
  const [visitors, setVisitors] = useState<VisitorRecord[]>([]);
  const [visitorsPage, setVisitorsPage] = useState(1);
  const [visitorsTotalPages, setVisitorsTotalPages] = useState(1);
  const [visitorsLoading, setVisitorsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Only the most recent request may write state; older responses are dropped.
  const requestIdRef = useRef(0);

  const loadVisitors = useCallback(async (page: number) => {
    const requestId = ++requestIdRef.current;
    const isLatest = () => requestId === requestIdRef.current;

    try {
      setVisitorsLoading(true);
      const res = await logbookAPI.getEntries(page, PAGE_SIZE);
      if (!isLatest()) return;
      setVisitors(res.data || []);
      setVisitorsPage(res.pagination?.page || page);
      setVisitorsTotalPages(res.pagination?.pages || 1);
    } catch (err) {
      if (isLatest()) throw err;
    } finally {
      if (isLatest()) setVisitorsLoading(false);
    }
  }, []);

  const createVisitor = useCallback(async (entry: LogbookEntry) => {
    await logbookAPI.createEntry(entry);
  }, []);

  const updateVisitor = useCallback(
    async (id: string, patch: Partial<LogbookEntry>) => {
      await logbookAPI.updateEntry(id, patch);
    },
    []
  );

  const deleteVisitor = useCallback(async (id: string) => {
    await logbookAPI.deleteEntry(id);
  }, []);

  const fetchAllVisitors = useCallback(async (): Promise<VisitorRecord[]> => {
    const all: VisitorRecord[] = [];
    let page = 1;
    let hasMore = true;
    while (hasMore) {
      const res = await logbookAPI.getEntries(page, PAGE_SIZE);
      all.push(...(res.data || []));
      const pages = res.pagination?.pages || 1;
      hasMore = page < pages;
      page += 1;
    }
    return all;
  }, []);

  const filteredVisitors = useMemo(() => {
    if (!searchQuery.trim()) return visitors;
    const query = searchQuery.toLowerCase();
    return visitors.filter(
      (v) =>
        v.fullName.toLowerCase().includes(query) ||
        v.visitorType.toLowerCase().includes(query) ||
        v.destination.toLowerCase().includes(query) ||
        v.purpose.toLowerCase().includes(query)
    );
  }, [visitors, searchQuery]);

  return useMemo(
    () => ({
      visitors,
      visitorsPage,
      visitorsTotalPages,
      visitorsLoading,
      searchQuery,
      filteredVisitors,
      setSearchQuery,
      loadVisitors,
      createVisitor,
      updateVisitor,
      deleteVisitor,
      fetchAllVisitors,
    }),
    [
      visitors,
      visitorsPage,
      visitorsTotalPages,
      visitorsLoading,
      searchQuery,
      filteredVisitors,
      loadVisitors,
      createVisitor,
      updateVisitor,
      deleteVisitor,
      fetchAllVisitors,
    ]
  );
}
