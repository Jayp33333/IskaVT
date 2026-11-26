import cors from 'cors';
import express from 'express';
import helmet from 'helmet';

import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import authRoutes from './routes/authRoutes.js';
import feedbackRoutes from './routes/feedbackRoutes.js';
import logbookRoutes from './routes/logbookRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import userRoutes from './routes/userRoutes.js';

/**
 * Express application. Builds middleware and routes only: it does not
 * connect to MongoDB or start listening, so tests can import it directly.
 * See server.js for the production entry point.
 */
const app = express();

/** Comma-separated CLIENT_ORIGIN -> list of allowed origins (empty = unset). */
export function parseAllowedOrigins(value) {
  return String(value || '')
    .split(',')
    .map((origin) => origin.trim().replace(/\/+$/, ''))
    .filter(Boolean);
}

let warnedOpenCors = false;

/**
 * CORS options. With CLIENT_ORIGIN set, only those origins get CORS headers.
 * Unset keeps the old allow-all behaviour (so existing deployments keep
 * working) and logs a one-time warning.
 */
export function buildCorsOptions(env = process.env) {
  const allowed = parseAllowedOrigins(env.CLIENT_ORIGIN);
  if (allowed.length === 0) {
    if (!warnedOpenCors && env.NODE_ENV !== 'test') {
      warnedOpenCors = true;
      console.warn(
        '[security] CLIENT_ORIGIN is not set: CORS allows every origin. ' +
          'Set CLIENT_ORIGIN to a comma-separated list of frontend origins.'
      );
    }
    return {};
  }
  return { origin: allowed };
}

// Vercel (and most hosts) sit behind one proxy; trust its X-Forwarded-For so
// rate limiting keys on the real client IP rather than the proxy's. Set
// TRUST_PROXY=0 when the server is reached directly (no proxy), otherwise
// clients could spoof X-Forwarded-For to dodge the rate limits.
function parseTrustProxy(value) {
  if (value === undefined || value === '') return 1;
  if (value === 'true') return true;
  if (value === 'false') return false;
  const n = Number(value);
  return Number.isInteger(n) && n >= 0 ? n : value;
}
app.set('trust proxy', parseTrustProxy(process.env.TRUST_PROXY));

// The API is called cross-origin by the frontend, so allow cross-origin reads.
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors(buildCorsOptions()));
app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: true, limit: '100kb' }));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/logbook', logbookRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/feedback', feedbackRoutes);

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'OK',
    message: 'ISKA Virtual Tour Backend API is running',
    timestamp: new Date().toISOString(),
  });
});

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
