import type { LogbookRecord } from "../services/logbookApi";

export const LOGBOOK_DEVICE_HISTORY_KEY = "logbookDeviceHistory";

const MAX_DEVICE_VISITS = 50;

export type DeviceVisitRecord = {
  _id: string;
  fullName: string;
  visitorType: string;
  purpose: string;
  destination: string;
  date: string;
  timeIn: string;
  timeOut: string | null;
};

function toDeviceVisit(record: LogbookRecord): DeviceVisitRecord {
  return {
    _id: record._id,
    fullName: record.fullName,
    visitorType: record.visitorType,
    purpose: record.purpose,
    destination: record.destination,
    date: record.date,
    timeIn: record.timeIn,
    timeOut: record.timeOut,
  };
}

function readRaw(): DeviceVisitRecord[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = localStorage.getItem(LOGBOOK_DEVICE_HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is DeviceVisitRecord =>
        item &&
        typeof item === "object" &&
        typeof item._id === "string" &&
        typeof item.fullName === "string"
    );
  } catch {
    return [];
  }
}

function writeRaw(records: DeviceVisitRecord[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(
    LOGBOOK_DEVICE_HISTORY_KEY,
    JSON.stringify(records.slice(0, MAX_DEVICE_VISITS))
  );
}

/** Newest visits first. */
export function getDeviceVisitHistory(): DeviceVisitRecord[] {
  return readRaw().sort(
    (a, b) => new Date(b.timeIn).getTime() - new Date(a.timeIn).getTime()
  );
}

export function upsertDeviceVisit(record: LogbookRecord | DeviceVisitRecord): void {
  const visit = "_id" in record && "createdAt" in record
    ? toDeviceVisit(record as LogbookRecord)
    : (record as DeviceVisitRecord);

  const records = readRaw().filter((item) => item._id !== visit._id);
  records.unshift(visit);
  writeRaw(records);
}

export function markDeviceVisitCheckedOut(
  entryId: string,
  timeOut: string = new Date().toISOString()
): void {
  const records = readRaw();
  const index = records.findIndex((item) => item._id === entryId);
  if (index === -1) return;

  records[index] = { ...records[index], timeOut };
  writeRaw(records);
}
