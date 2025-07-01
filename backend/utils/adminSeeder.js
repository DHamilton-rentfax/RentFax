// File: backend/scripts/seedAdmin.js

import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import path from 'path';
import { fileURLToPath } from 'url';

// Resolve __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Import User model
import User from '../models/User.js';

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const existingAdmin = await User.findOne({ email: 'admin@rentfax.com' });
    if (existingAdmin) {
      console.log('✅ Admin user already exists.');
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash('Admin1234!', 10);

    const adminUser = new User({
      email: 'admin@rentfax.com',
      password: hashedPassword,
      role: 'admin',
      plan: 'pro',
      account: new mongoose.Types.ObjectId(), // <-- Add a placeholder if required
    });

    await adminUser.save();

    console.log('🚀 Admin user created successfully: admin@rentfax.com / Admin1234!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding admin user:', error.message);
    process.exit(1);
  }
};

seedAdmin();
