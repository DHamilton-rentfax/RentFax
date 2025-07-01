import mongoose from 'mongoose';
import RentalHistory from '../models/RentalHistory.js';

/**
 * Fetch rental history for a given applicant from your database.
 *
 * @param {string} applicantId – Mongo ObjectId string of the applicant
 * @returns {Promise<Object>}   – The RentalHistory document
 * @throws {Error}              – If ID is invalid or no history found
 */
export async function getRentalHistory(applicantId) {
  // 1️⃣ Validate the ObjectId
  if (!mongoose.Types.ObjectId.isValid(applicantId)) {
    const err = new Error('Invalid applicant ID');
    err.status = 400;
    throw err;
  }

  // 2️⃣ Query your RentalHistory collection
  const history = await RentalHistory.findOne({ applicant: applicantId });
  if (!history) {
    const err = new Error('No rental history found');
    err.status = 404;
    throw err;
  }

  return history;
}
