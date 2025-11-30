
// ===========================================
// RentFAX | Monthly Credit Reset Function
// Location: src/functions/reset-credits.ts
// ===========================================

import * as functions from "firebase-functions";
import { getFirestore, collection, getDocs, writeBatch } from "firebase/firestore";

export const monthlyCreditReset = functions.pubsub
    .schedule('0 0 1 * *') // Runs on the 1st of every month at midnight
    .onRun(async (context) => {
        console.log("Running monthly credit reset...");

        const db = getFirestore();
        const usersRef = collection(db, "users");
        const snapshot = await getDocs(usersRef);
        const batch = writeBatch(db);

        snapshot.forEach(doc => {
            const user = doc.data();
            if (user.subscriptionActive) {
                if (user.planType === "pro50") {
                    batch.update(doc.ref, { remainingCredits: 50 });
                } else if (user.planType === "pro300") {
                    batch.update(doc.ref, { remainingCredits: 300 });
                }
            }
        });

        await batch.commit();
        console.log("Credit reset complete.");
        return null;
    });
