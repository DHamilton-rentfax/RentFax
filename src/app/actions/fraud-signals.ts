
"use server";
import { adminDB } from "@/firebase/server";

// Simple duplicate check
export async function getFraudSignals(renterId: string) {
  const renter = await adminDB.doc(`renters/${renterId}`).get();
  if (!renter.exists) return [];

  const data = renter.data();
  const email = data?.email;
  const name = data?.name;

  const signals: string[] = [];

  // Duplicate email check
  const dupes = await adminDB.collection("renters").where("email", "==", email).get();
  if (dupes.size > 1) signals.push("Duplicate email across renters");

  // Shared name check
  const nameMatches = await adminDB.collection("renters").where("name", "==", name).get();
  if (nameMatches.size > 1) signals.push("Shared identity risk");

  return signals;
}
