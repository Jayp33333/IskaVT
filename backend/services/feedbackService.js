import Feedback from '../models/Feedback.js';
import Logbook from '../models/Logbook.js';
import { badRequest, notFound } from '../utils/HttpError.js';
import { escapeRegex } from '../utils/parseDate.js';

async function resolveFullName({ fullName, logbookEntryId }) {
  if (logbookEntryId) {
    try {
      const entry = await Logbook.findById(logbookEntryId).select('fullName').lean();
      if (entry?.fullName) return String(entry.fullName).trim();
    } catch {
      // Invalid id — fall through
    }
  }

  const trimmed = fullName ? String(fullName).trim() : '';
  if (trimmed) return trimmed;

  return 'Guest';
}

function buildFilters({ isRead, search }) {
  const filter = {};
  if (isRead === 'true') filter.isRead = true;
  if (isRead === 'false') filter.isRead = false;
  if (search && String(search).trim()) {
    const regex = new RegExp(escapeRegex(String(search).trim()), 'i');
    filter.$or = [
      { comment: regex },
      { fullName: regex },
      { visitorName: regex },
      { logbookEntryId: regex },
    ];
  }
  return filter;
}

export async function createFeedback({ rating, comment, fullName, logbookEntryId }) {
  const parsedRating = Number(rating);
  if (!Number.isFinite(parsedRating) || parsedRating < 1 || parsedRating > 5) {
    throw badRequest('Rating must be a number between 1 and 5');
  }
  if (!comment || !String(comment).trim()) {
    throw badRequest('Comment is required');
  }

  const resolvedName = await resolveFullName({ fullName, logbookEntryId });

  const entry = new Feedback({
    rating: Math.round(parsedRating),
    comment: String(comment).trim(),
    fullName: resolvedName,
    logbookEntryId: logbookEntryId ? String(logbookEntryId).trim() : null,
  });

  return entry.save();
}

export async function listFeedback({ page, limit, skip, isRead, search }) {
  const filter = buildFilters({ isRead, search });

  const [entries, total, unread] = await Promise.all([
    Feedback.find(filter).sort('-createdAt').limit(limit).skip(skip).exec(),
    Feedback.countDocuments(filter),
    Feedback.countDocuments({ isRead: false }),
  ]);

  return { entries, total, unread };
}

export async function getUnreadCount() {
  return Feedback.countDocuments({ isRead: false });
}

export async function getStatsSummary() {
  const [aggregate] = await Feedback.aggregate([
    {
      $group: {
        _id: null,
        averageRating: { $avg: '$rating' },
        totalCount: { $sum: 1 },
      },
    },
  ]);

  const totalCount = aggregate?.totalCount ?? 0;
  const averageRating =
    totalCount > 0 && aggregate?.averageRating != null
      ? Math.round(aggregate.averageRating * 10) / 10
      : null;

  return { averageRating, totalCount };
}

export async function getFeedbackById(id) {
  const entry = await Feedback.findById(id);
  if (!entry) throw notFound('Feedback not found');
  return entry;
}

export async function updateFeedback(id, payload = {}) {
  const entry = await getFeedbackById(id);
  if (typeof payload.isRead === 'boolean') {
    entry.isRead = payload.isRead;
  }
  return entry.save();
}

export async function deleteFeedback(id) {
  const entry = await Feedback.findByIdAndDelete(id);
  if (!entry) throw notFound('Feedback not found');
  return entry;
}
