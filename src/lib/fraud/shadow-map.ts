
"use server";

import { adminDb } from "@/firebase/server";

export async function buildShadowIdentityGraph(renterId: string) {
  const r = await adminDb.collection("renters").doc(renterId).get();
  const data = r.data();

  if (!data) return null;

  const results: Record<string, any> = {};

  const keys = [
    ["dlHash", "Driver License Hash"],
    ["phone", "Phone Number"],
    ["email", "Email Address"],
    ["address", "Address"],
    ["dob", "Date of Birth"],
  ];

  for (const [field, desc] of keys) {
    if (!data[field]) continue;

    const matches = await adminDb
      .collection("renters")
      .where(field, "==", data[field])
      .get();

    results[field] = {
      matches: matches.docs.map((d) => ({ id: d.id, ...d.data() })),
      description: desc,
      count: matches.size,
    };
  }

  return results;
}
