import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp();
const db = getFirestore();

/**
 * Calculates user compliance status and saves daily trend.
 */
export const updateComplianceTrends = async () => {
  const bannersSnap = await db
    .collection("globalBanners")
    .where("requiresAcknowledgment", "==", true)
    .where("active", "==", true)
    .get();

  const requiredIds = bannersSnap.docs.map((d) => d.id);
  const usersSnap = await db.collection("users").get();

  let compliantUsers = 0;
  let nonCompliantUsers = 0;

  for (const userDoc of usersSnap.docs) {
    const uid = userDoc.id;
    const userData = userDoc.data();

    // Skip Super Admins
    if (userData.role === "superadmin") continue;

    const ackSnap = await db
      .collectionGroup("acknowledgments")
      .where("userId", "==", uid)
      .get();
    const ackedIds = ackSnap.docs.map((d) => d.ref.parent.parent.id);

    const missing = requiredIds.filter((id) => !ackedIds.includes(id));
    const status = missing.length ? "non_compliant" : "compliant";

    if (status === "compliant") compliantUsers++;
    else nonCompliantUsers++;

    await db.collection("users").doc(uid).update({
      complianceStatus: status,
      missingAcknowledgments: missing,
      complianceCheckedAt: new Date().toISOString(),
    });
  }

  const totalUsers = compliantUsers + nonCompliantUsers;
  const complianceRate = totalUsers
    ? Math.round((compliantUsers / totalUsers) * 100)
    : 0;

  // Write trend data
  const dateKey = new Date().toISOString().split("T")[0];
  await db.collection("complianceTrends").doc(dateKey).set({
    date: new Date(),
    compliantUsers,
    nonCompliantUsers,
    complianceRate,
  });

  console.log(
    `Compliance trends updated: ${complianceRate}% (${compliantUsers} compliant / ${nonCompliantUsers} non-compliant)`
  );
};
