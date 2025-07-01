// backend/controllers/refreshTokenController.js

import jwt from 'jsonwebtoken';

export const refreshToken = (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ error: 'Refresh token missing.' });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    const newAccessToken = jwt.sign(
      { id: decoded.id, role: decoded.role },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    console.error('Refresh Token Error:', error.message);
    res.status(403).json({ error: 'Invalid or expired refresh token.' });
  }
};
