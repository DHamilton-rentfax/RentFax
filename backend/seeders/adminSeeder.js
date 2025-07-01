#!/usr/bin/env node
// File: backend/seeders/adminSeeder.js

import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import User from '../models/User.js';
import Account from '../models/Account.js';

// ── Prevent accidental production runs ──
if (process.env.NODE_ENV === 'production') {
  console.error('❌ Seeder is disabled in production.');
  process.exit(1);
}

// ── Parse CLI args: must be pairs of email + password ──
const args = process.argv.slice(2);
if (args.length < 2 || args.length % 2 !== 0) {
  console.error('❌ Please provide email/password pairs:');
  console.error('   node adminSeeder.js admin@example.com P@ssw0rd');
  process.exit(1);
}

// ── Connect to MongoDB ──
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser:    true,
      useUnifiedTopology: true,
    });
    console.log('🔗 Connected to MongoDB');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  }
}

// ── Seed each admin ──
async function seedAdmins() {
  await connectDB();

  for (let i = 0; i < args.length; i += 2) {
    const email = args[i];
    const password = args[i + 1];

    // Skip if user already exists
    const existing = await User.findOne({ email });
    if (existing) {
      console.log(`⚠️  Admin already exists: ${email}`);
      continue;
    }

    // 1️⃣ Create an Account for this admin
    const account = await Account.create({
      name: `${email}’s Account`,
      seatsAllowed: 1,
    });
    console.log(`🗂️  Created account ${account._id} for ${email}`);

    // 2️⃣ Hash the password
    const hash = await bcrypt.hash(password, 10);

    // 3️⃣ Create the User
    await User.create({
      email,
      password: hash,
      role: 'admin',
      account: account._id,
    });
    console.log(`✅ Admin created: ${email}`);
  }

  console.log('🎯 Seeding complete.');
  process.exit(0);
}

seedAdmins();
