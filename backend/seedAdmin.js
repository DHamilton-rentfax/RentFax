#!/usr/bin/env node
// backend/seedAdmin.js

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt   = require('bcrypt');
const User     = require('./models/User');
const Account  = require('./models/Account');

// Protect production
if (process.env.NODE_ENV === 'production') {
  console.error('❌ Seeder disabled in production.');
  process.exit(1);
}

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser:    true,
      useUnifiedTopology: true,
    });
    console.log('🔗 Connected to MongoDB');

    const email    = 'admin@rentfax.com';
    const password = 'SuperSecret123';

    // 1️⃣ Check if admin already exists
    const existing = await User.findOne({ email });
    if (existing) {
      console.log(`⚠️  Admin already exists: ${email}`);
      process.exit(0);
    }

    // 2️⃣ Create a new Account
    const account = await Account.create({
      name:         'Admin Account',
      seatsAllowed: 1,
      // …any other required fields…
    });
    console.log('🗂️  Created account:', account._id);

    // 3️⃣ Hash the password
    const hash = await bcrypt.hash(password, 10);

    // 4️⃣ Create the admin user
    const admin = await User.create({
      email,
      password: hash,
      role:     'admin',
      account:  account._id,
    });
    console.log('✅ Admin created:', admin.email);

    process.exit(0);
  } catch (err) {
    console.error('❌ Seeder error:', err);
    process.exit(1);
  }
}

seed();
