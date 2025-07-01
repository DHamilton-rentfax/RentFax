// backend/routes/adminSeeder.js
import express from 'express';
import bcrypt from 'bcrypt';
import User from '../models/User.js';

const router = express.Router();

// 📦 POST /api/admin-seed
router.post('/', async (req, res) => {
  try {
    const existing = await User.findOne({ email: 'admin@rentfax.com' });
    if (existing) {
      return res.status(400).json({ error: 'Admin already exists.' });
    }

    const defaultPassword = process.env.ADMIN_DEFAULT_PASSWORD || 'password123';
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    const admin = await User.create({
      email: 'admin@rentfax.com',
      password: hashedPassword,
      role: 'admin',
      account: null, // You may want to update this if `account` is required in schema
    });

    res.status(201).json({
      message: '✅ Admin created successfully.',
      loginWith: {
        email: admin.email,
        password: defaultPassword,
      },
    });
  } catch (err) {
    console.error('❌ Admin Seeder Error:', err.message);
    res.status(500).json({ error: 'Failed to seed admin.' });
  }
});

export default router;
