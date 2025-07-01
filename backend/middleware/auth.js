// backend/middleware/auth.js

import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * Middleware: Verifies JWT and attaches full user document to `req.user`
 * Usage: router.use(authMiddleware) or as route middleware
 */
export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing or malformed authorization token' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error('Auth error:', err.message);
    res.status(401).json({ error: 'Authentication failed', details: err.message });
  }
};

/**
 * Middleware: Restricts access based on user role
 * Usage: router.get('/admin-only', authMiddleware, requireRole('admin'), handler)
 */
export const requireRole = (role) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    if (req.user.role !== role) {
      return res.status(403).json({ error: `Access denied: ${role} role required` });
    }

    next();
  };
};

/**
 * Middleware: Shortcut for admin-only routes
 * Usage: router.get('/admin', authMiddleware, isAdmin, handler)
 */
export const isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied: Admins only' });
  }

  next();
};
