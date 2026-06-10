import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import connectDB from '../config/db.js';
import User from '../models/User.js';

dotenv.config();

const username = process.env.SUPER_ADMIN_USERNAME?.trim().toLowerCase();
const password = process.env.SUPER_ADMIN_PASSWORD;

async function seed() {
  if (!username || !password) {
    console.error(
      'Set SUPER_ADMIN_USERNAME and SUPER_ADMIN_PASSWORD in backend .env'
    );
    process.exit(1);
  }

  await connectDB();

  const existing = await User.findOne({ role: 'super_admin' });
  if (existing) {
    console.log(`Super admin already exists: ${existing.username}`);
    process.exit(0);
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({
    username,
    passwordHash,
    role: 'super_admin',
    email: process.env.SUPER_ADMIN_EMAIL?.trim().toLowerCase() || '',
  });

  console.log(`Super admin created: ${user.username}`);
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
