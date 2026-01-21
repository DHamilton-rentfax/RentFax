import { adminDb } from "@/firebase/server";
import { assignMemberIdIfMissing } from "@/lib/renters/assignMemberId";

async function run() {
  const snapshot = await adminDb
    .collection("renters")
    .where("memberId", "==", null)
    .get();

  console.log(`Backfilling ${snapshot.size} renters`);

  for (const doc of snapshot.docs) {
    await assignMemberIdIfMissing(doc.id);
    console.log(`✓ ${doc.id}`);
  }

  console.log("Backfill complete");
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
