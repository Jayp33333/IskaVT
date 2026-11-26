import * as logbookService from '../services/logbookService.js';
import * as logbookStatsService from '../services/logbookStatsService.js';
import { isAdminUser } from '../middleware/auth.js';
import { buildPagination, parsePagination } from '../utils/parsePagination.js';

export async function createEntry(req, res) {
  // req.user is only set when optionalAuthenticate saw a valid token.
  const entry = await logbookService.createEntry(req.body || {}, {
    isAdmin: isAdminUser(req.user),
  });
  res.status(201).json({
    success: true,
    message: 'Logbook entry created successfully',
    data: entry,
  });
}

export async function listEntries(req, res) {
  const { page, limit, skip } = parsePagination(req.query);
  const sortBy = logbookService.parseSortBy(req.query.sortBy);

  const { entries, total } = await logbookService.listEntries({
    page,
    limit,
    skip,
    sortBy,
  });

  res.json({
    success: true,
    data: entries,
    pagination: buildPagination(page, limit, total),
  });
}

export async function getEntry(req, res) {
  const entry = await logbookService.getPublicEntryById(req.params.id);
  res.json({ success: true, data: entry });
}

export async function updateEntry(req, res) {
  const entry = await logbookService.updateEntry(req.params.id, req.body || {});
  res.json({
    success: true,
    message: 'Logbook entry updated successfully',
    data: entry,
  });
}

export async function setTimeoutNow(req, res) {
  const entry = await logbookService.setTimeoutNow(req.params.id);
  res.json({
    success: true,
    message: 'Time out updated successfully',
    data: entry,
  });
}

export async function deleteEntry(req, res) {
  const entry = await logbookService.deleteEntry(req.params.id);
  res.json({
    success: true,
    message: 'Logbook entry deleted successfully',
    data: entry,
  });
}

export async function getStatsSummary(_req, res) {
  const data = await logbookStatsService.getSummary();
  res.json({ success: true, data });
}
