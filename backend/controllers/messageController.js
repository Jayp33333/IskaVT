import * as messageService from '../services/messageService.js';
import { buildPagination, parsePagination } from '../utils/parsePagination.js';

export async function createMessage(req, res) {
  const entry = await messageService.createMessage(req.body || {});
  res.status(201).json({
    success: true,
    message: 'Message sent successfully',
    data: entry,
  });
}

export async function listMessages(req, res) {
  const { page, limit, skip } = parsePagination(req.query);
  const { isRead, search } = req.query;

  const { entries, total, unread } = await messageService.listMessages({
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
  const unreadCount = await messageService.getUnreadCount();
  res.json({ success: true, unreadCount });
}

export async function getMessage(req, res) {
  const entry = await messageService.getMessageById(req.params.id);
  res.json({ success: true, data: entry });
}

export async function updateMessage(req, res) {
  const entry = await messageService.updateMessage(req.params.id, req.body || {});
  res.json({
    success: true,
    message: 'Message updated successfully',
    data: entry,
  });
}

export async function deleteMessage(req, res) {
  const entry = await messageService.deleteMessage(req.params.id);
  res.json({
    success: true,
    message: 'Message deleted successfully',
    data: entry,
  });
}
