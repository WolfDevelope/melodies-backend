import dotenv from 'dotenv';
import connectDB from '../config/database.js';
import User from '../models/User.js';

dotenv.config();

const run = async () => {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME || 'Admin';
  const birthday = process.env.ADMIN_BIRTHDAY || '2000-01-01';
  const gender = process.env.ADMIN_GENDER || 'prefer-not-to-say';

  if (!email || !password) {
    throw new Error('Missing ADMIN_EMAIL or ADMIN_PASSWORD');
  }

  await connectDB();

  const existing = await User.findOne({ email });

  if (existing) {
    existing.role = 'admin';
    if (password) existing.password = password;
    if (name) existing.name = name;
    if (birthday) existing.birthday = birthday;
    if (gender) existing.gender = gender;
    existing.isEmailVerified = true;

    await existing.save();

    // eslint-disable-next-line no-console
    console.log(`✅ Updated admin user: ${email}`);
    process.exit(0);
  }

  const user = new User({
    email,
    password,
    name,
    birthday,
    gender,
    role: 'admin',
    isEmailVerified: true,
  });

  await user.save();
  // eslint-disable-next-line no-console
  console.log(`✅ Created admin user: ${email}`);

  process.exit(0);
};

run().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('❌ seedAdmin error:', err);
  process.exit(1);
});
