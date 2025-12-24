import { adminDb } from "@/firebase/server";

/**
 * Fetches the active policy document and its latest version snapshot from Firestore.
 * @param policyKey - The unique key for the policy (e.g., "DISPUTE_EVIDENCE_REQUIREMENTS").
 * @returns An object containing the policy metadata and the latest version data, or null if not found.
 */
export async function getActivePolicyVersion(policyKey: string) {
  // 1. Find the active policy by its unique key.
  const policySnap = await adminDb
    .collection("policies")
    .where("policyKey", "==", policyKey)
    .where("isActive", "==", true)
    .limit(1)
    .get();

  if (policySnap.empty) {
    console.warn(`No active policy found for key: ${policyKey}`);
    return null;
  }

  const policy = { id: policySnap.docs[0].id, ...policySnap.docs[0].data() } as any;
  
  // 2. Construct the version ID using the latestVersion number from the policy doc.
  const versionId = `${policy.id}_v${policy.latestVersion}`;

  // 3. Fetch the specific, immutable version snapshot.
  const versionDoc = await adminDb.collection("policy_versions").doc(versionId).get();
  
  if (!versionDoc.exists) {
    console.error(`Policy version not found for ID: ${versionId}, though policy ${policy.id} exists.`);
    return null;
  }

  // 4. Return both the parent policy and the specific version data.
  return { policy, version: versionDoc.data() };
}
