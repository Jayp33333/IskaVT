import * as logbookService from '../services/logbookService.js';
import * as logbookStatsService from '../services/logbookStatsService.js';
import { buildPagination, parsePagination } from '../utils/parsePagination.js';

export async function createEntry(req, res) {
  const entry = await logbookService.createEntry(req.body || {});
  res.status(201).json({
    success: true,
    message: 'Logbook entry created successfully',
    data: entry,
  });
}

export async function listEntries(req, res) {
  const { page, limit, skip } = parsePagination(req.query);
  const sortBy = req.query.sortBy || '-createdAt';

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
  const entry = await logbookService.getEntryById(req.params.id);
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
