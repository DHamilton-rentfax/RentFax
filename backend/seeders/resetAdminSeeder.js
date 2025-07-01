// backend/seeders/resetAdminSeeder.js

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/User');
require('dotenv').config();

// ⚡ Block running this script in production
if (process.env.NODE_ENV === 'production') {
  console.log('❌ Seeder is disabled in production for security reasons.');
  process.exit(1);
}

// ✅ Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('✅ Connected to MongoDB');
}).catch((err) => {
  console.error('❌ MongoDB connection error:', err.message);
  process.exit(1);
});

// 📦 Get email + password from CLI arguments
const args = process.argv.slice(2);

if (args.length === 0 || args.length % 2 !== 0) {
  console.log('❌ Please provide email and password pairs.');
  console.log('Example: node seeders/resetAdminSeeder.js admin1@email.com pass123 admin2@email.com pass456');
  process.exit(1);
}

// 🛠 Build admin users
const admins = [];
for (let i = 0; i < args.length; i += 2) {
  const email = args[i];
  const password = args[i + 1];

  if (!email || !password) {
    console.log('❌ Missing email or password for one of the admins.');
    process.exit(1);
  }

  admins.push({ email, password });
}

// 🧹 Reset Admins Function
const resetAdmins = async () => {
  try {
    // 🗑 Delete all current admins
    await User.deleteMany({ role: 'admin' });
    console.log('🗑️ All existing admins deleted.');

    // ➕ Create new admins
    for (const admin of admins) {
      const hashedPassword = await bcrypt.hash(admin.password, 10);

      await User.create({
        email: admin.email,
        password: hashedPassword,
        role: 'admin',
        plan: 'unlimited', // Optional
      });

      console.log(`✅ Admin created: ${admin.email}`);
    }

    console.log('🚀 Reset and seeding complete.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during reset:', error.message);
    process.exit(1);
  }
};

resetAdmins();
