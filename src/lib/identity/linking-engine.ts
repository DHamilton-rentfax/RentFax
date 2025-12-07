import { adminDb } from "@/firebase/server";

export async function linkIdentities(renterId: string) {
  const main = await adminDb.collection("renters").doc(renterId).get();
  const data = main.data();

  if (!data) {
    return [];
  }

  const signals = [
    ["phone", data.phone],
    ["email", data.email],
    ["address", data.address],
    ["dlHash", data.dlHash],
  ];

  let linked: string[] = [];

  for (const [field, value] of signals) {
    if (!value) continue;

    const matches = await adminDb
      .collection("renters")
      .where(field, "==", value)
      .get();

    for (const m of matches.docs) {
      if (m.id !== renterId) linked.push(m.id);
    }
  }

  // Remove duplicates
  linked = [...new Set(linked)];

  await adminDb.collection("shadowIdentity").doc(renterId).set(
    {
      linkedIdentities: linked,
    },
    { merge: true }
  );

  return linked;
}
