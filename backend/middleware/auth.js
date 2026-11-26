import jwt from 'jsonwebtoken';
import { HttpError } from '../utils/HttpError.js';
import User from '../models/User.js';

/** Admin session lifetime. Kept short; the client re-logs in after expiry. */
export const JWT_EXPIRES_IN = '12h';

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new HttpError(
      503,
      'Server authentication is not configured (JWT_SECRET missing)'
    );
  }
  return secret;
}

export function signToken(user) {
  return jwt.sign(
    {
      sub: user._id.toString(),
      role: user.role,
      username: user.username,
      tv: user.tokenVersion ?? 0,
    },
    getJwtSecret(),
    { expiresIn: JWT_EXPIRES_IN }
  );
}

function readBearerToken(req) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) return null;
  return header.slice(7);
}

/**
 * Verifies a token and loads its active user. Throws HttpError(401) for any
 * token/user problem; a missing JWT_SECRET surfaces as HttpError(503).
 */
async function resolveUser(token) {
  const secret = getJwtSecret();

  let payload;
  try {
    payload = jwt.verify(token, secret);
  } catch {
    throw new HttpError(401, 'Invalid or expired token');
  }

  const user = await User.findById(payload.sub).select('-passwordHash');
  if (!user || !user.isActive) {
    throw new HttpError(401, 'Invalid or inactive account');
  }
  if ((payload.tv ?? 0) !== (user.tokenVersion ?? 0)) {
    throw new HttpError(401, 'Session is no longer valid');
  }
  return user;
}

export async function authenticate(req, _res, next) {
  const token = readBearerToken(req);
  if (!token) {
    return next(new HttpError(401, 'Authentication required'));
  }

  try {
    req.user = await resolveUser(token);
    next();
  } catch (err) {
    // HttpErrors carry the right status (401 bad token, 503 no secret). Any
    // other failure (e.g. a DB timeout) is a server error, not a revoked
    // session: a 401 here would make the client log every admin out.
    next(err);
  }
}

/**
 * Sets req.user when a valid token is present; requests with no token pass
 * through anonymously. A token that IS sent but is invalid/expired is
 * rejected (401) instead of silently downgraded, so an admin whose session
 * lapsed learns about it rather than having admin-only fields dropped.
 * Public callers (the tour) must not send a token (client uses skipAuth).
 */
export async function optionalAuthenticate(req, _res, next) {
  const token = readBearerToken(req);
  if (!token) return next();

  try {
    req.user = await resolveUser(token);
    next();
  } catch (err) {
    next(err);
  }
}

export function requireRole(...roles) {
  return (req, _res, next) => {
    if (!req.user) {
      return next(new HttpError(401, 'Authentication required'));
    }
    if (!roles.includes(req.user.role)) {
      return next(new HttpError(403, 'Insufficient permissions'));
    }
    next();
  };
}

export const ADMIN_ROLES = ['admin', 'super_admin'];

export function isAdminUser(user) {
  return Boolean(user && ADMIN_ROLES.includes(user.role));
}

/** authenticate + requireRole('admin', 'super_admin'). */
export const requireAdmin = [authenticate, requireRole(...ADMIN_ROLES)];
