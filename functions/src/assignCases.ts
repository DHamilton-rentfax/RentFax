import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

// Ensure initialization is done once
if (admin.apps.length === 0) {
  admin.initializeApp();
}
const db = admin.firestore();

export const assignCaseToPartner = functions.firestore
  .document("disputes/{disputeId}")
  .onUpdate(async (change, context) => {
    const before = change.before.data();
    const after = change.after.data();

    // Check if the dispute has been updated to 'unresolved' and has an amount
    if (before.status !== "unresolved" && after.status === "unresolved" && after.amount > 0) {
      
      // First, check if a case already exists for this dispute to avoid duplicates
      const existingCasesSnap = await db
        .collection("cases")
        .where("disputeId", "==", context.params.disputeId)
        .limit(1)
        .get();

      if (!existingCasesSnap.empty) {
        console.log(`Case already exists for dispute ${context.params.disputeId}. Aborting.`);
        return null;
      }

      // Find active, verified collection agencies
      const agenciesSnap = await db
        .collection("collectionAgencies")
        .where("verified", "==", true)
        .where("active", "==", true)
        .get();

      if (agenciesSnap.empty) {
        console.log("No active and verified collection agencies found. Cannot assign case.");
        return null;
      }

      // Simple load balancing: find agency with the fewest assigned cases
      const sortedAgencies = agenciesSnap.docs.sort(
        (a, b) => (a.data().assignedCases || 0) - (b.data().assignedCases || 0)
      );

      const selectedAgency = sortedAgencies[0];
      const agencyId = selectedAgency.id;

      // Create the new case record
      const newCase = {
        disputeId: context.params.disputeId,
        renterId: after.renterId,
        renterName: after.renterName,
        companyId: after.companyId,
        companyName: after.companyName,
        amount: after.amount, // Carry over the amount
        assignedAgencyId: agencyId,
        status: "in_collection",
        type: "debt_collection",
        createdAt: admin.firestore.Timestamp.now(),
        updatedAt: admin.firestore.Timestamp.now(),
      };

      await db.collection("cases").add(newCase);

      // Atomically increment the agency's case count
      await db
        .collection("collectionAgencies")
        .doc(agencyId)
        .update({
          assignedCases: admin.firestore.FieldValue.increment(1),
        });

      console.log(`✅ Case for dispute ${context.params.disputeId} assigned to agency ${selectedAgency.data().name} (${agencyId}).`);
      return null;
    }
    return null;
  });
