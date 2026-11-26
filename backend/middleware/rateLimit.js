import rateLimit from 'express-rate-limit';

const FIFTEEN_MINUTES = 15 * 60 * 1000;

const skipInTests = () => process.env.NODE_ENV === 'test';

function envLimit(name, fallback) {
  const n = parseInt(process.env[name], 10);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

function createLimiter({ limit, message, ...options }) {
  return rateLimit({
    windowMs: FIFTEEN_MINUTES,
    limit,
    ...options,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    skip: skipInTests,
    message: { error: message },
  });
}

/**
 * POST /api/auth/login: LOGIN_RATE_LIMIT (default 10) failed attempts per 15
 * minutes per IP. Successful logins don't count, so admins sharing a campus
 * IP can't lock each other out.
 *
 * Counters live in memory: per instance, reset on restart/cold start. On
 * serverless hosts the effective limit is roughly limit x warm instances.
 */
export const loginLimiter = createLimiter({
  limit: envLimit('LOGIN_RATE_LIMIT', 10),
  skipSuccessfulRequests: true,
  message: 'Too many login attempts. Please try again later.',
});

/**
 * Public visitor POSTs (logbook, messages, feedback): PUBLIC_WRITE_RATE_LIMIT
 * (default 120) per 15 minutes per IP. The default is generous because campus
 * Wi-Fi and kiosk mode put many real visitors behind one IP. Each call returns
 * a limiter with its own counter, so every route gets a separate budget.
 */
export function createPublicWriteLimiter() {
  return createLimiter({
    limit: envLimit('PUBLIC_WRITE_RATE_LIMIT', 120),
    message: 'Too many requests. Please try again later.',
  });
}
