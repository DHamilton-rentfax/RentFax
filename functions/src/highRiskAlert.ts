import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

const db = admin.firestore();

export const highRiskAlert = functions.firestore
  .document('renters/{renterId}/fraud/summary')
  .onWrite(async (change, context) => {
    const { renterId } = context.params;
    const summary = change.after.data();

    if (!summary) {
      return null;
    }

    const signalCount = summary.signals?.length || 0;
    const HIGH_SIGNAL_THRESHOLD = 5; 

    const renterRef = db.doc(`renters/${renterId}`);

    if (signalCount > HIGH_SIGNAL_THRESHOLD) {
      return renterRef.set({ alert: true }, { merge: true });
    } 

    return null;
  });
