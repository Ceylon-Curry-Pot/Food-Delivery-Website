// scripts/seed.js
// Run with: npm run seed
// This is plain CommonJS so it works outside Next.js without @/ alias issues.

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const path = require('path');

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
  role: { type: String, enum: ['admin', 'staff'], default: 'staff' },
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

    const hashedPassword = await bcrypt.hash('Admin@123', 10);

    await User.create({
      name: 'Super Admin',
      email,
      password: hashedPassword,
      role: 'admin',
      approved: true,
    });

    console.log('\n✅ Admin user seeded successfully!');
    console.log('─────────────────────────────────');
    console.log('Email:    admin@ceyloncurrypot.lk');
    console.log('Password: Admin@123');
    console.log('Role:     admin');
    console.log('─────────────────────────────────');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding database:', err);
    process.exit(1);
  }
}

seed();
