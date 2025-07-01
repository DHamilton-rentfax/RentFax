// utils/authMiddleware.js

import jwt from 'jsonwebtoken';

/**
 * Verifies a JWT token and extracts the payload.
 * @param {string} token - The JWT token (from Authorization header).
 * @returns {object} - Decoded token payload { id, role, plan, account }.
 * @throws {Error} - If token is missing, invalid, or expired.
 */
export function authMiddleware(token) {
  if (!token) {
    throw new Error('Token not provided.');
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    return payload;
  } catch (err) {
    throw new Error('Invalid or expired token.');
  }
}
