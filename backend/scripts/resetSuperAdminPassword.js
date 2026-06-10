import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import connectDB from '../config/db.js';
import User from '../models/User.js';

dotenv.config();

const username = process.env.SUPER_ADMIN_USERNAME?.trim().toLowerCase();
const password = process.env.SUPER_ADMIN_PASSWORD;

async function reset() {
  if (!username || !password) {
    console.error(
      'Set SUPER_ADMIN_USERNAME and SUPER_ADMIN_PASSWORD in backend .env'
    );
    process.exit(1);
  }

  await connectDB();

  const user = await User.findOne({ role: 'super_admin', username });
  if (!user) {
    console.error(`No super admin found with username: ${username}`);
    process.exit(1);
  }

  user.passwordHash = await bcrypt.hash(password, 10);
  await user.save();

  console.log(`Password updated for super admin: ${user.username}`);
  process.exit(0);
}

reset().catch((err) => {
  console.error(err);
  process.exit(1);
});
