
import * as admin from 'firebase-admin';
import {jaroWinkler} from 'jaro-winkler-typescript';

// Initialize Firebase Admin SDK if not already initialized
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

/**
 * Normalizes a phone number by removing non-numeric characters.
 * @param {string} phone The phone number to normalize.
 * @returns {string} The normalized phone number.
 */
const normalizePhone = (phone: string): string => phone.replace(/\D/g, '');

/**
 * Finds a renter profile based on fuzzy matching of name, and exact matching of normalized email, phone, and address.
 * @param {any} renterData The data of the renter to find.
 * @returns {Promise<any>} The found renter profile or null.
 */
export const findRenter = async (renterData: any): Promise<any> => {
  const { fullName, email, phone, address } = renterData;

  // 1. Direct search by email (most reliable)
  const emailQuery = await db.collection('renterProfiles').where('emails', 'array-contains', email.toLowerCase()).get();
  if (!emailQuery.empty) {
    return { id: emailQuery.docs[0].id, ...emailQuery.docs[0].data() };
  }

  // 2. Search by normalized phone number
  const normalizedPhone = normalizePhone(phone);
  const phoneQuery = await db.collection('renterProfiles').where('phones', 'array-contains', normalizedPhone).get();
  if (!phoneQuery.empty) {
    return { id: phoneQuery.docs[0].id, ...phoneQuery.docs[0].data() };
  }

  // 3. Fuzzy match by name and address (more expensive)
  const allRenters = await db.collection('renterProfiles').get();
  let bestMatch = null;
  let highestScore = 0;

  allRenters.forEach(doc => {
    const renter = doc.data();
    const nameSimilarity = jaroWinkler(fullName.toLowerCase(), renter.name.toLowerCase());
    
    // Check for address similarity (simple check for now, can be improved)
    const addressSimilarity = jaroWinkler(address.toLowerCase(), renter.linkedAddresses?.[0]?.toLowerCase() || '');

    const overallScore = (nameSimilarity * 0.6) + (addressSimilarity * 0.4);

    if (overallScore > 0.85 && overallScore > highestScore) {
      highestScore = overallScore;
      bestMatch = { id: doc.id, ...renter };
    }
  });

  return bestMatch;
};
