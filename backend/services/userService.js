import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { badRequest, notFound } from '../utils/HttpError.js';

const SALT_ROUNDS = 10;
export const MIN_PASSWORD_LENGTH = 8;

function assertPasswordPolicy(password) {
  if (typeof password !== 'string' || password.length < MIN_PASSWORD_LENGTH) {
    throw badRequest(`Password must be at least ${MIN_PASSWORD_LENGTH} characters`);
  }
}

export async function listAdmins() {
  const users = await User.find({ role: 'admin' })
    .select('-passwordHash')
    .sort({ createdAt: -1 });
  return users;
}

export async function createAdmin({ username, password, email }, createdBy) {
  const normalized =
    typeof username === 'string' ? username.trim().toLowerCase() : '';
  if (!normalized || normalized.length < 3) {
    throw badRequest('Username must be at least 3 characters');
  }
  assertPasswordPolicy(password);

  const existing = await User.findOne({ username: normalized });
  if (existing) {
    throw badRequest('Username already exists');
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await User.create({
    username: normalized,
    email: email?.trim().toLowerCase() || '',
    passwordHash,
    role: 'admin',
    createdBy,
  });

  return {
    id: user._id,
    username: user.username,
    email: user.email,
    role: user.role,
    isActive: user.isActive,
    createdAt: user.createdAt,
  };
}

export async function updateAdmin(id, { isActive, password }) {
  const user = await User.findOne({ _id: id, role: 'admin' });
  if (!user) {
    throw notFound('Admin account not found');
  }

  if (typeof isActive === 'boolean') {
    user.isActive = isActive;
  }

  if (password) {
    assertPasswordPolicy(password);
    user.passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    // Invalidate every token issued before the password change.
    user.tokenVersion = (user.tokenVersion ?? 0) + 1;
  }

  await user.save();

  return {
    id: user._id,
    username: user.username,
    email: user.email,
    role: user.role,
    isActive: user.isActive,
    createdAt: user.createdAt,
  };
}

export async function deleteAdmin(id) {
  const user = await User.findOneAndDelete({ _id: id, role: 'admin' });
  if (!user) {
    throw notFound('Admin account not found');
  }
  return { id: user._id, username: user.username };
}
