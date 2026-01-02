
import * as admin from "firebase-admin";
import * as path from "path";

// Use your service account
admin.initializeApp({
  credential: admin.credential.cert(
    require(path.resolve(__dirname, "../serviceAccountKey.json"))
  ),
});

const db = admin.firestore();

async function backfillUsers() {
  let nextPageToken: string | undefined;

  do {
    const result = await admin.auth().listUsers(1000, nextPageToken);

    for (const user of result.users) {
      const ref = db.collection("users").doc(user.uid);
      const snap = await ref.get();

      if (!snap.exists) {
        console.log("Creating user doc for:", user.uid);

        await ref.set({
          uid: user.uid,
          email: user.email ?? null,
          role: "USER",
          orgId: null,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          provider: user.providerData.map(p => p.providerId),
        });
      }
    }

    nextPageToken = result.pageToken;
  } while (nextPageToken);

  console.log("✅ Backfill complete");
}

backfillUsers().catch(console.error);
