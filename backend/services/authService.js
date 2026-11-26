import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { HttpError, badRequest, notFound } from '../utils/HttpError.js';
import { signToken } from '../middleware/auth.js';

const INVALID_CREDENTIALS = 'Invalid username or password';

// A valid bcrypt hash (cost 10) compared against when the user does not
// exist, so failed logins take the same time whether or not the username is real.
const DUMMY_PASSWORD_HASH =
  '$2b$10$CwTycUXWue0Thq9StjUM0uJ8.ZSz2Ah5nA5W9pD1Q1k8v9mN2xHyq';

const invalidCredentials = () => new HttpError(401, INVALID_CREDENTIALS);

export async function login(username, password) {
  const normalized =
    typeof username === 'string' ? username.trim().toLowerCase() : '';
  if (!normalized || !password || typeof password !== 'string') {
    throw badRequest('Username and password are required');
  }

  const user = await User.findOne({ username: normalized });
  const valid = await bcrypt.compare(
    password,
    user ? user.passwordHash : DUMMY_PASSWORD_HASH
  );
  if (!user || !user.isActive || !valid) {
    throw invalidCredentials();
  }

  const token = signToken(user);
  return {
    token,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
  };
}

export async function getProfile(userId) {
  const user = await User.findById(userId).select('-passwordHash');
  if (!user) {
    throw notFound('User not found');
  }
  return {
    id: user._id,
    username: user.username,
    email: user.email,
    role: user.role,
  };
}
