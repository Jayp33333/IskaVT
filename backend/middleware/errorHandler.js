import { HttpError } from '../utils/HttpError.js';

/**
 * Maps a Mongoose ValidationError to { field: message }. Cast failures get a
 * generic message so raw input values are not echoed back.
 */
export function mapValidationErrors(err) {
  const details = {};
  for (const [field, fieldError] of Object.entries(err.errors || {})) {
    details[field] =
      fieldError?.name === 'CastError'
        ? `Invalid value for ${field}`
        : fieldError?.message || 'Invalid value';
  }
  return details;
}

export function notFoundHandler(req, res) {
  res.status(404).json({ error: 'Route not found' });
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, _next) {
  if (err instanceof HttpError) {
    const body = { error: err.message };
    if (err.details) body.details = err.details;
    return res.status(err.status).json(body);
  }

  if (err && err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation failed',
      details: mapValidationErrors(err),
    });
  }

  // Body exceeded the express.json() size limit.
  if (err && err.type === 'entity.too.large') {
    return res.status(413).json({ error: 'Request body too large' });
  }

  // Malformed JSON body.
  if (err && err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Malformed JSON body' });
  }

  if (err && err.name === 'CastError') {
    return res.status(400).json({ error: 'Invalid identifier' });
  }

  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message:
      process.env.NODE_ENV === 'development'
        ? err && err.message
        : 'Something went wrong',
  });
}
