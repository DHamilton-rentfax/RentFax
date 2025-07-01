// routes/refreshRoutes.js
import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

// 🔐 Refresh Token Endpoint
router.post('/refresh-token', async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) return res.status(401).json({ error: 'No refresh token found.' });

    // 🔍 Verify token
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ error: 'User not found.' });

    // 🎟 Generate new access token
    const accessToken = jwt.sign(
      { id: user._id, role: user.role, plan: user.plan },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    return res.status(200).json({ accessToken });
  } catch (err) {
    console.error('Refresh Token Error:', err);
    return res.status(401).json({ error: 'Invalid or expired refresh token.' });
  }
});

export default router;
