import Message from '../models/Message.js';
import { badRequest, notFound } from '../utils/HttpError.js';
import { escapeRegex } from '../utils/parseDate.js';

function buildFilters({ isRead, search }) {
  const filter = {};
  if (isRead === 'true') filter.isRead = true;
  if (isRead === 'false') filter.isRead = false;
  if (search && String(search).trim()) {
    const regex = new RegExp(escapeRegex(String(search).trim()), 'i');
    filter.$or = [{ name: regex }, { email: regex }, { message: regex }];
  }
  return filter;
}

export async function createMessage({ name, email, message }) {
  if (!name || !email || !message) {
    throw badRequest('Missing required fields: name, email, and message are required');
  }

  const entry = new Message({
    name: String(name).trim(),
    email: String(email).trim().toLowerCase(),
    message: String(message).trim(),
  });

  return entry.save();
}

export async function listMessages({ page, limit, skip, isRead, search }) {
  const filter = buildFilters({ isRead, search });

  const [entries, total, unread] = await Promise.all([
    Message.find(filter).sort('-createdAt').limit(limit).skip(skip).exec(),
    Message.countDocuments(filter),
    Message.countDocuments({ isRead: false }),
  ]);

  return { entries, total, unread };
}

export async function getUnreadCount() {
  return Message.countDocuments({ isRead: false });
}

export async function getMessageById(id) {
  const entry = await Message.findById(id);
  if (!entry) throw notFound('Message not found');
  return entry;
}

export async function updateMessage(id, payload = {}) {
  const entry = await getMessageById(id);
  if (typeof payload.isRead === 'boolean') {
    entry.isRead = payload.isRead;
  }
  return entry.save();
}

export async function deleteMessage(id) {
  const entry = await Message.findByIdAndDelete(id);
  if (!entry) throw notFound('Message not found');
  return entry;
}
