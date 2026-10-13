// scripts/seed.js
// Run with: npm run seed
// This is plain CommonJS so it works outside Next.js without @/ alias issues.

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const path = require('path');
const crypto = require('crypto');

// Load .env from project root
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const MONGODB_URI = process.env.MONGODB_URL;

if (!MONGODB_URI) {
  console.error('ERROR: MONGODB_URL is not defined in your .env file');
  process.exit(1);
}

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  role: { type: String, enum: ['admin', 'staff', 'super_admin'], default: 'staff' },
  approved: { type: Boolean, default: false },
  requestedAt: { type: Date, default: Date.now },
  approvedAt: { type: Date },
});

// Avoid model re-registration error
const User = mongoose.models?.User || mongoose.model('User', UserSchema);

async function seed() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected!');

    const email = 'admin@ceyloncurrypot.lk';

    const existing = await User.findOne({ email });
    if (existing) {
      console.log(`\nUser already exists: ${email}`);
      console.log('Skipping seed. To reset, manually delete the user from MongoDB first.');
      process.exit(0);
    }

  const password = process.env.SEED_ADMIN_PASSWORD || crypto.randomBytes(12).toString('base64url');
  if (password.length < 8) {
    console.error('ERROR: SEED_ADMIN_PASSWORD must be at least 8 characters');
    process.exit(1);
  }
  const hashedPassword = await bcrypt.hash(password, 12);

    await User.create({
      name: 'Super Admin',
      email,
      password: hashedPassword,
      role: 'super_admin',
      approved: true,
    });

    console.log('\n✅ Super admin seeded. Save this password now, it is not shown again:');
    console.log(`Email:    ${email}`);
    console.log(`Password: ${password}`);
    process.exit(0);
  } catch (err) {
    console.error('Error seeding database:', err);
    process.exit(1);
  }
}

seed();
