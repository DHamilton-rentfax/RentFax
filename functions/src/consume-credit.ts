
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

if (!admin.apps.length) {
    admin.initializeApp();
}

const db = admin.firestore();

export const consumeCredit = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError(
            "unauthenticated",
            "The function must be called while authenticated."
        );
    }
    const uid = context.auth.uid;
    const userRef = db.doc(`users/${uid}`);

    try {
        await db.runTransaction(async (transaction) => {
            const userDoc = await transaction.get(userRef);
            if (!userDoc.exists) {
                throw new functions.https.HttpsError("not-found", "User not found.");
            }

            const currentCredits = userDoc.data()?.credits || 0;
            if (currentCredits < 1) {
                throw new functions.https.HttpsError(
                    "failed-precondition",
                    "Insufficient credits."
                );
            }

            transaction.update(userRef, {
                credits: admin.firestore.FieldValue.increment(-1),
            });
        });

        // Optionally, log the consumption event
        // await db.collection('creditLogs').add({
        //     uid,
        //     consumedAt: new Date(),
        //     description: data.description || 'Consumed 1 credit',
        // });

        return { success: true };
    } catch (error: any) {
        console.error("Error consuming credit for user:", uid, error);
        if (error instanceof functions.https.HttpsError) {
            throw error;
        }
        throw new functions.https.HttpsError(
            "internal",
            "An unexpected error occurred while consuming credit."
        );
    }
});
