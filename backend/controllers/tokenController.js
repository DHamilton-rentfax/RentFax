// controllers/tokenController.js

import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { createAccessToken } from '../utils/jwtHelpers.js'; // adjust this path if needed

// 🔄 Refresh Access Token
export async function refreshToken(req, res) {
  try {
    const token = req.cookies.refreshToken;
    if (!token) {
      return res.status(401).json({ error: 'Refresh token missing.' });
    }

    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
      });
      return res.status(401).json({ error: 'Invalid refresh token.' });
    }

    const accessToken = createAccessToken(user);

    res.status(200).json({ accessToken });
  } catch (err) {
    console.error('❌ Refresh Token Error:', err.message);

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
    });

    res.status(401).json({ error: 'Refresh token expired or invalid.' });
  }
}

// 🔓 Logout
export function logout(req, res) {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Strict',
  });
  res.status(200).json({ message: 'Logged out successfully.' });
}
