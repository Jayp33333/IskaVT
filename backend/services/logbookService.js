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

export async function createEntry(payload) {
  assertRequiredCreateFields(payload);
  const entry = new Logbook({
    fullName: payload.fullName,
    visitorType: payload.visitorType,
    purpose: payload.purpose,
    destination: payload.destination,
    date: payload.date ? new Date(payload.date) : new Date(),
    timeIn: payload.timeIn ? new Date(payload.timeIn) : new Date(),
    timeOut: payload.timeOut ? new Date(payload.timeOut) : null,
  });
  return entry.save();
}

export async function listEntries({ page, limit, skip, sortBy = '-createdAt' }) {
  const [entries, total] = await Promise.all([
    Logbook.find().sort(sortBy).limit(limit).skip(skip).exec(),
    Logbook.countDocuments(),
  ]);
  return { entries, total };
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

  return entry.save();
}

export async function setTimeoutNow(id) {
  const entry = await getEntryById(id);
  entry.timeOut = new Date();
  return entry.save();
}

export async function deleteEntry(id) {
  const entry = await Logbook.findByIdAndDelete(id);
  if (!entry) throw notFound('Logbook entry not found');
  return entry;
}
