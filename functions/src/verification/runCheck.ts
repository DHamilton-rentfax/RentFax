import * as functions from "firebase-functions";
import { startIncodeSession } from "./incode";
import { getFirestore } from "firebase-admin/firestore";
import axios from "axios";

const db = getFirestore();

exports.runIDVerification = functions.firestore
  .document("renter_verification/{renterId}")
  .onUpdate(async (change, context) => {
    const before = change.before.data();
    const after = change.after.data();

    // Only run when status moves to "pending"
    if (before.status === after.status || after.status !== "pending") return;

    const sessionId = await startIncodeSession(after.renterId);

    const resp = await axios.post(
      `https://api.incode.com/v1/verify/${sessionId}`,
      {
        idFrontUrl: after.idFrontUrl,
        idBackUrl: after.idBackUrl,
        selfieUrl: after.selfieUrl,
      }
    );

    const result = resp.data;
    const { verified, livenessScore, spoofRisk } = result;

    await db.doc(`renter_verification/${after.renterId}`).update({
      verificationReport: result,
      livenessScore,
      spoofRisk,
      status: verified ? "verified" : "failed",
      verifiedAt: verified ? new Date() : null,
      updatedAt: new Date()
    });
  });
