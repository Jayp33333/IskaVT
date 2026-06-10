import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { badRequest, notFound } from '../utils/HttpError.js';

const SALT_ROUNDS = 10;

export async function listAdmins() {
  const users = await User.find({ role: 'admin' })
    .select('-passwordHash')
    .sort({ createdAt: -1 });
  return users;
}

export async function createAdmin({ username, password, email }, createdBy) {
  const normalized = username?.trim().toLowerCase();
  if (!normalized || normalized.length < 3) {
    throw badRequest('Username must be at least 3 characters');
  }
  if (!password || password.length < 6) {
    throw badRequest('Password must be at least 6 characters');
  }

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
    if (password.length < 6) {
      throw badRequest('Password must be at least 6 characters');
    }
    user.passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
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
