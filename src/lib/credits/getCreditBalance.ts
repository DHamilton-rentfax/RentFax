import { adminDb } from "@/firebase/server";

export async function getCreditBalance(userId: string) {
  const snap = await adminDb
    .collection("ledger")
    .where("actorId", "==", userId)
    .get();

  let balance = 0;

  snap.forEach((doc) => {
    const data = doc.data();
    if (typeof data.amount === "number") {
      balance += data.amount;
    }
  });

  return balance;
}
