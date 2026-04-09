import connectToDatabase from '@/lib/mongodb';
import User from '@/lib/models/User';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.join(process.cwd(), '.env') });

const seedAdminUser = async () => {
  try {
    console.log('Connecting to database...');
    await connectToDatabase();
    
    const email = 'admin@ceyloncurrypot.lk';
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log(`User ${email} already exists.`);
      process.exit(0);
    }

    console.log('Creating admin user...');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    await User.create({
      name: 'Super Admin',
      email: email,
      password: hashedPassword,
      role: 'admin',
      approved: true
    });

    console.log('Admin user successfully seeded!');
    console.log('Login credentials:');
    console.log('Email: admin@ceyloncurrypot.lk');
    console.log('Password: admin123');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin user:', error);
    process.exit(1);
  }
};

seedAdminUser();
