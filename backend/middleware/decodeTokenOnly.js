// backend/middleware/decodeTokenOnly.js

import jwt from 'jsonwebtoken';
import AnalyticsLog from '../models/AnalyticsLog.js';

/**
 * Lightweight middleware to decode JWT and log access analytics
 */
const decodeTokenOnly = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const route = req.originalUrl;
  const method = req.method;
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const userAgent = req.headers['user-agent'] || '';
  const timestamp = new Date();

  let userId = null;
  let authenticated = false;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      userId = decoded.id || null;
      authenticated = true;
    } catch (err) {
      console.warn('Token decode failed:', err.message);
      req.user = null;
    }
  } else {
    req.user = null;
  }

  // 📝 Log to database
  try {
    await AnalyticsLog.create({
      route,
      method,
      ip,
      userAgent,
      timestamp,
      userId,
      authenticated,
    });
  } catch (err) {
    console.error('Failed to save analytics log:', err.message);
  }

  next();
};

export default decodeTokenOnly;
