
import { firestore } from 'firebase-admin';

const searchLimits: { [key: string]: { count: number; lastSearch: firestore.Timestamp } } = {};
const SEARCH_LIMIT = 3; // Max searches per hour
const TIME_FRAME = 60 * 60 * 1000; // 1 hour in milliseconds

/**
 * Checks if a user has exceeded their search limit.
 * @param {string} userId An identifier for the user (e.g., IP address or email).
 * @returns {boolean} True if the user has exceeded the limit, false otherwise.
 */
export const hasExceededSearchLimit = (userId: string): boolean => {
  const now = firestore.Timestamp.now();
  const user = searchLimits[userId];

  if (user) {
    const timeDiff = now.toMillis() - user.lastSearch.toMillis();
    if (timeDiff < TIME_FRAME) {
      if (user.count >= SEARCH_LIMIT) {
        return true; // Limit exceeded
      }
      // Increment search count
      searchLimits[userId] = { count: user.count + 1, lastSearch: now };
    } else {
      // Reset count after time frame expires
      searchLimits[userId] = { count: 1, lastSearch: now };
    }
  } else {
    // First search
    searchLimits[userId] = { count: 1, lastSearch: now };
  }

  return false; // Limit not exceeded
};