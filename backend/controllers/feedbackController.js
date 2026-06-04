import * as feedbackService from '../services/feedbackService.js';
import { buildPagination, parsePagination } from '../utils/parsePagination.js';

export async function createFeedback(req, res) {
  const entry = await feedbackService.createFeedback(req.body || {});
  res.status(201).json({
    success: true,
    message: 'Feedback submitted successfully',
    data: entry,
  });
}

export async function listFeedback(req, res) {
  const { page, limit, skip } = parsePagination(req.query);
  const { isRead, search } = req.query;

  const { entries, total, unread } = await feedbackService.listFeedback({
    page,
    limit,
    skip,
    isRead,
    search,
  });

  res.json({
    success: true,
    data: entries,
    unreadCount: unread,
    pagination: buildPagination(page, limit, total),
  });
}

export async function getUnreadCount(_req, res) {
  const unreadCount = await feedbackService.getUnreadCount();
  res.json({ success: true, unreadCount });
}

export async function getStatsSummary(_req, res) {
  const data = await feedbackService.getStatsSummary();
  res.json({ success: true, data });
}

export async function getFeedback(req, res) {
  const entry = await feedbackService.getFeedbackById(req.params.id);
  res.json({ success: true, data: entry });
}

export async function updateFeedback(req, res) {
  const entry = await feedbackService.updateFeedback(req.params.id, req.body || {});
  res.json({
    success: true,
    message: 'Feedback updated successfully',
    data: entry,
  });
}

export async function deleteFeedback(req, res) {
  const entry = await feedbackService.deleteFeedback(req.params.id);
  res.json({
    success: true,
    message: 'Feedback deleted successfully',
    data: entry,
  });
}
