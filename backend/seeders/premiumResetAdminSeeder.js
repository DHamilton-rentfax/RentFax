#!/usr/bin/env node
import 'dotenv/config.js';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import readline from 'readline';
import User from '../models/User.js';

// 🚫 Block in production
if (process.env.NODE_ENV === 'production') {
  console.error('❌ Seeder is disabled in production.');
  process.exit(1);
}

// 🔌 Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('✅ Connected to MongoDB');
}).catch((err) => {
  console.error('❌ MongoDB connection error:', err.message);
  process.exit(1);
});

// 🧠 CLI Setup
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
const ask = (query) => new Promise(resolve => rl.question(query, resolve));

// 🚀 Seeder Logic
async function resetAdmins() {
  try {
    console.log('\n🌟 RentFAX Admin Seeder 🌟');
    const choice = await ask('Do you want to (1) Auto-generate dummy admins or (2) Enter manually? (1/2): ');

    let admins = [];

    if (choice.trim() === '1') {
      const count = await ask('How many dummy admins to create? (default 1): ');
      const numAdmins = parseInt(count) || 1;

      for (let i = 1; i <= numAdmins; i++) {
        admins.push({
          email: `admin${i}@rentfax.com`,
          password: `Password${i}!`,
        });
      }
    } else if (choice.trim() === '2') {
      const num = await ask('How many admins do you want to manually create? ');
      const numAdmins = parseInt(num);

      for (let i = 0; i < numAdmins; i++) {
        const email = await ask(`Enter email for Admin ${i + 1}: `);
        const password = await ask(`Enter password for Admin ${i + 1}: `);
        admins.push({ email, password });
      }
    } else {
      console.log('❌ Invalid choice. Exiting.');
      rl.close();
      process.exit(1);
    }

    // 🗑 Delete existing admins
    await User.deleteMany({ role: 'admin' });
    console.log('🧹 Existing admins removed.\n');

    // ➕ Create new admins
    for (const admin of admins) {
      const hashed = await bcrypt.hash(admin.password, 10);

      await User.create({
        email: admin.email,
        password: hashed,
        role: 'admin',
        plan: 'unlimited',
      });

      console.log(`✅ Created admin: ${admin.email}`);
    }

    console.log('\n🎯 All admins seeded successfully.');
    rl.close();
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding error:', err.message);
    rl.close();
    process.exit(1);
  }
}

// ▶️ Start script
resetAdmins();
