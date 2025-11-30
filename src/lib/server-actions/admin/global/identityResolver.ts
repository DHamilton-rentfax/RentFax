"use server";

import { adminDB } from "@/firebase/server";
import { generateEmbeddings } from "./generateEmbeddings";
import { cosineSimilarity } from "./utils/cosineSimilarity";

export async function resolveIdentity(renterId: string) {
  const renterRef = adminDB.collection("renters").doc(renterId);
  const renter = (await renterRef.get()).data();

  if (!renter) return null;

  const targetText = `
    ${renter.firstName} ${renter.lastName}
    ${renter.email}
    ${renter.phone}
  `.trim();

  const targetEmbedding = await generateEmbeddings(targetText);

  // Query all renters for similarity match
  const rentersSnap = await adminDB.collection("renters").get();

  const scored = rentersSnap.docs.map((doc) => {
    const d = doc.data();

    const compareText = `
      ${d.firstName} ${d.lastName}
      ${d.email}
      ${d.phone}
    `.trim();

    return {
      id: doc.id,
      similarity: cosineSimilarity(
        targetEmbedding,
        d.embedding ?? []
      ),
      renter: d,
    };
  });

  const sorted = scored.sort((a, b) => b.similarity - a.similarity);

  return {
    renterId,
    matches: sorted.filter((m) => m.similarity > 0.85).slice(0, 10),
  };
}
