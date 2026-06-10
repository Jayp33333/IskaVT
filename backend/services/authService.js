import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { badRequest, notFound } from '../utils/HttpError.js';
import { signToken } from '../middleware/auth.js';

export async function login(username, password) {
  const normalized = username?.trim().toLowerCase();
  if (!normalized || !password) {
    throw badRequest('Username and password are required');
  }

  const user = await User.findOne({ username: normalized });
  if (!user || !user.isActive) {
    throw badRequest('Invalid username or password');
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    throw badRequest('Invalid username or password');
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
