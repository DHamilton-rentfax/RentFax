import * as functions from "firebase-functions";
import { adminDb } from "../admin";

export const expirePartnerTrialsAndLock = functions.pubsub
  .schedule("every 24 hours")
  .onRun(async () => {
    const now = new Date();

    const snap = await adminDb
      .collection("partner_orgs")
      .where("billing.status", "==", "trial")
      .get();

    const batch = adminDb.batch();

    snap.docs.forEach((doc) => {
      const data = doc.data();
      const trialEnds = data.billing?.trialEndsAt?.toDate?.();
      if (trialEnds && trialEnds < now) {
        batch.update(doc.ref, {
          "billing.status": "expired",
          "billing.lockedAt": now,
        });
      }
    });

    await batch.commit();
    return null;
  });
