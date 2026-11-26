import Logbook from '../models/Logbook.js';
import { badRequest, notFound } from '../utils/HttpError.js';
import { parseRequiredDate } from '../utils/parseDate.js';

const REQUIRED_FIELDS = ['fullName', 'visitorType', 'purpose', 'destination'];

function assertRequiredCreateFields(payload) {
  const missing = REQUIRED_FIELDS.filter((field) => !payload[field]);
  if (missing.length > 0) {
    throw badRequest(
      `Missing required fields: ${REQUIRED_FIELDS.join(', ')} are required`
    );
  }
}

function trimRequired(value, label) {
  const trimmed = String(value).trim();
  if (!trimmed) throw badRequest(`${label} is required`);
  return trimmed;
}

/** Fields the public tour reads from GET /logbook/:id (LogHistory, FeedbackNative). */
export const PUBLIC_ENTRY_FIELDS =
  '_id fullName visitorType purpose destination date timeIn timeOut createdAt updatedAt';

const SORTABLE_FIELDS = new Set([
  'createdAt',
  'timeIn',
  'timeOut',
  'fullName',
  'visitorType',
  'destination',
]);

export const DEFAULT_SORT = '-createdAt';

/**
 * Whitelists a client-supplied sortBy. Accepts one of SORTABLE_FIELDS,
 * optionally prefixed with '-'; anything else (including non-strings)
 * falls back to DEFAULT_SORT.
 */
export function parseSortBy(sortBy) {
  if (typeof sortBy !== 'string') return DEFAULT_SORT;
  const trimmed = sortBy.trim();
  const field = trimmed.startsWith('-') ? trimmed.slice(1) : trimmed;
  return SORTABLE_FIELDS.has(field) ? trimmed : DEFAULT_SORT;
}

/**
 * Builds the document for a new entry. Only admins may set date/timeIn/
 * timeOut; for public (visitor) creates those are ignored and the server
 * clock is used, so entries cannot be back-dated.
 */
export function sanitizeCreatePayload(payload = {}, isAdmin = false, now = new Date()) {
  const doc = {
    fullName: payload.fullName,
    visitorType: payload.visitorType,
    purpose: payload.purpose,
    destination: payload.destination,
    date: now,
    timeIn: now,
    timeOut: null,
  };

  if (isAdmin) {
    if (payload.date) doc.date = parseRequiredDate(payload.date, 'date');
    if (payload.timeIn) doc.timeIn = parseRequiredDate(payload.timeIn, 'timeIn');
    if (payload.timeOut) doc.timeOut = parseRequiredDate(payload.timeOut, 'timeOut');
  }

  return doc;
}

export async function createEntry(payload, { isAdmin = false } = {}) {
  assertRequiredCreateFields(payload);
  const entry = new Logbook(sanitizeCreatePayload(payload, isAdmin));
  return entry.save();
}

export async function listEntries({ limit, skip, sortBy = DEFAULT_SORT }) {
  const [entries, total] = await Promise.all([
    Logbook.find().sort(parseSortBy(sortBy)).limit(limit).skip(skip).exec(),
    Logbook.countDocuments(),
  ]);
  return { entries, total };
}

/** Public lookup for the tour: returns only PUBLIC_ENTRY_FIELDS. */
export async function getPublicEntryById(id) {
  const entry = await Logbook.findById(id).select(PUBLIC_ENTRY_FIELDS);
  if (!entry) throw notFound('Logbook entry not found');
  return entry;
}

export async function getEntryById(id) {
  const entry = await Logbook.findById(id);
  if (!entry) throw notFound('Logbook entry not found');
  return entry;
}

export async function updateEntry(id, payload = {}) {
  const entry = await getEntryById(id);

  if (payload.fullName !== undefined)
    entry.fullName = trimRequired(payload.fullName, 'Full name');
  if (payload.visitorType !== undefined)
    entry.visitorType = trimRequired(payload.visitorType, 'Visitor type');
  if (payload.purpose !== undefined)
    entry.purpose = trimRequired(payload.purpose, 'Purpose');
  if (payload.destination !== undefined)
    entry.destination = trimRequired(payload.destination, 'Destination');

  if (payload.date !== undefined) {
    entry.date = parseRequiredDate(payload.date, 'date');
  }
  if (payload.timeIn !== undefined) {
    entry.timeIn = parseRequiredDate(payload.timeIn, 'timeIn');
  }
  if (payload.timeOut !== undefined) {
    if (payload.timeOut === null || payload.timeOut === '') {
      entry.timeOut = null;
    } else {
      entry.timeOut = parseRequiredDate(payload.timeOut, 'timeOut');
    }
  }

  // Only validate what changed, so legacy rows that predate the maxlength
  // limits can still be edited.
  return entry.save({ validateModifiedOnly: true });
}

export async function setTimeoutNow(id) {
  // Public, unauthenticated route: set the time-out atomically and never
  // overwrite an existing one. findOneAndUpdate skips full-document
  // validation, so legacy rows over the maxlength limits still check out.
  const updated = await Logbook.findOneAndUpdate(
    { _id: id, timeOut: null },
    { $set: { timeOut: new Date() } },
    { new: true }
  );
  if (updated) return updated;
  return getEntryById(id); // already timed out, or 404
}

export async function deleteEntry(id) {
  const entry = await Logbook.findByIdAndDelete(id);
  if (!entry) throw notFound('Logbook entry not found');
  return entry;
}
