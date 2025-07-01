// backend/seeders/userSeeder.js

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/User');
require('dotenv').config();

// 1. Protect Seeder in Production
if (process.env.NODE_ENV === 'production') {
  console.log('❌ Seeder is disabled in production for security reasons.');
  process.exit(1);
}

// 2. Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('✅ Connected to MongoDB');
}).catch((err) => {
  console.error('❌ MongoDB connection error:', err.message);
  process.exit(1);
});

// 3. Parse CLI Arguments
const args = process.argv.slice(2);

if (args.length === 0 || args.length % 3 !== 0) {
  console.log('❌ Please provide email, password, and role for each user.');
  console.log('Example: node seeders/userSeeder.js user1@email.com password1 admin user2@email.com password2 user');
  process.exit(1);
}

const users = [];

for (let i = 0; i < args.length; i += 3) {
  const email = args[i];
  const password = args[i + 1];
  const role = args[i + 2];

  users.push({ email, password, role });
}

// 4. Seeding Logic
const seedUsers = async () => {
  try {
    for (const user of users) {
      const existing = await User.findOne({ email: user.email });

      if (existing) {
        console.log(`⚠️ User already exists: ${user.email}`);
        continue;
      }

      const hashedPassword = await bcrypt.hash(user.password, 10);

      await User.create({
        email: user.email,
        password: hashedPassword,
        role: user.role,
        plan: user.role === 'admin' ? 'unlimited' : 'free',
        companyName: user.role === 'admin' ? 'RentFAX Admin' : undefined, // Optional
      });

      console.log(`✅ Created ${user.role}: ${user.email}`);
    }
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
};

seedUsers();
