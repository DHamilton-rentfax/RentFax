// backend/controllers/seedController.js

import bcrypt from 'bcrypt';
import User from '../models/User.js';

// 🚫 Block in production
if (process.env.NODE_ENV === 'production') {
  console.log('❌ Seeder is disabled in production.');
  process.exit(1);
}

// 🔹 Create Admin User
export async function seedAdmin(req, res) {
  try {
    const { secretKey, admins } = req.body;

    if (secretKey !== process.env.SEEDER_SECRET) {
      return res.status(403).json({ error: 'Invalid seeder secret key.' });
    }

    for (const admin of admins) {
      const existing = await User.findOne({ email: admin.email });
      if (existing) continue;

      const hashedPassword = await bcrypt.hash(admin.password, 10);

      await User.create({
        email: admin.email,
        password: hashedPassword,
        role: 'admin',
        plan: 'unlimited',
      });
    }

    res.status(200).json({ message: '✅ Admins seeded successfully!' });
  } catch (error) {
    console.error('Seeder Error:', error.message);
    res.status(500).json({ error: 'Seeder failed.' });
  }
}
