'use server';

import { adminDB } from '@/firebase/server';
import { FieldValue } from 'firebase-admin/firestore';

const disposableEmailProviders = ['mailinator.com', 'temp-mail.org', '10minutemail.com'];

// Helper to find documents with the same field value
async function findDuplicates(collectionName: string, field: string, value: any, excludeId: string) {
  if (!value) return [];
  const snapshot = await adminDB.collection(collectionName).where(field, '==', value).get();
  return snapshot.docs
    .filter(doc => doc.id !== excludeId)
    .map(doc => ({ id: doc.id, ...doc.data() }));
}

// Logs the calculated fraud signals to a dedicated collection
async function logFraudSignals(renterId: string, signals: any[]) {
    if (!renterId) return null;

    // Calculate a simple risk score - using the highest confidence signal
    const riskScore = signals.reduce((max, s) => Math.max(max, s.confidence), 0);

    const log = {
        renterId,
        evaluatedAt: FieldValue.serverTimestamp(),
        riskScore,
        signals
    };

    // Use set with merge to create or update the log for the renter
    await adminDB.collection('fraud_signals').doc(renterId).set(log, { merge: true });
    
    return { logId: renterId, riskScore };
}


export async function getFraudSignals(uid: string) {
  if (!uid) {
    throw new Error('User ID is required');
  }

  const userDoc = await adminDB.doc(`users/${uid}`).get();
  const userData = userDoc.data();

  if (!userData) {
    return { error: 'User not found' };
  }

  const signals = [];

  // 1. Disposable Email Check
  if (userData.email && disposableEmailProviders.some(provider => userData.email.endsWith(provider))) {
    signals.push({
      type: 'disposable_email',
      confidence: 0.8,
      explanation: `Email is from a known disposable provider.`,
    });
  }

  // 2. Cross-Renter Duplicate Checks
  const duplicateEmails = await findDuplicates('users', 'email', userData.email, uid);
  if (duplicateEmails.length > 0) {
    signals.push({
      type: 'duplicate_email',
      confidence: 0.9,
      explanation: `Email used by ${duplicateEmails.length} other renter(s).`,
      related: duplicateEmails.map(u => u.id),
    });
  }

  const duplicatePhones = await findDuplicates('users', 'phone', userData.phone, uid);
  if (duplicatePhones.length > 0) {
    signals.push({
      type: 'duplicate_phone',
      confidence: 0.85,
      explanation: `Phone number used by ${duplicatePhones.length} other renter(s).`,
      related: duplicatePhones.map(u => u.id),
    });
  }

  const duplicateSSNs = await findDuplicates('users', 'ssn', userData.ssn, uid);
  if (duplicateSSNs.length > 0) {
    signals.push({
      type: 'duplicate_ssn',
      confidence: 1.0,
      explanation: `SSN used by ${duplicateSSNs.length} other renter(s).`,
      related: duplicateSSNs.map(u => u.id),
    });
  }

  const duplicateAddresses = await findDuplicates('users', 'address', userData.address, uid);
   if (duplicateAddresses.length > 0) {
    signals.push({
      type: 'duplicate_address',
      confidence: 0.6, 
      explanation: `Address used by ${duplicateAddresses.length} other renter(s).`,
      related: duplicateAddresses.map(u => u.id),
    });
  }

  // 3. IP Address Risk & Velocity
  const duplicateIPs = await findDuplicates('users', 'lastLoginIp', userData.lastLoginIp, uid);
  if (duplicateIPs.length > 0) {
    signals.push({
      type: 'duplicate_ip',
      confidence: 0.7,
      explanation: `IP address used by ${duplicateIPs.length} other renter(s).`,
      related: duplicateIPs.map(u => u.id),
    });

    // Velocity Check: Rapid account creation from the same IP
    if (userData.createdAt && userData.createdAt.toDate) {
        const twentyFourHours = 24 * 60 * 60 * 1000;
        const currentUserCreationTime = userData.createdAt.toDate().getTime();

        const recentAccounts = duplicateIPs.filter(user => {
            if (user.createdAt && user.createdAt.toDate) {
                const otherUserCreationTime = user.createdAt.toDate().getTime();
                return Math.abs(currentUserCreationTime - otherUserCreationTime) < twentyFourHours;
            }
            return false;
        });

        if (recentAccounts.length > 0) {
            signals.push({
                type: 'velocity_creation_on_ip',
                confidence: 0.75,
                explanation: `${recentAccounts.length} other account(s) were created on this IP within 24 hours.`,
                related: recentAccounts.map(u => u.id),
            });
        }
    }
  }

  // Log the signals and get the risk score
  const logResult = await logFraudSignals(uid, signals);

  return { signals, ...logResult };
}
