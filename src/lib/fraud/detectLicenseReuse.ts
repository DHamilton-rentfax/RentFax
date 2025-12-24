import { db } from "@/firebase/server";
import { collection, query, where, getDocs } from "firebase/firestore";

export async function detectLicenseReuse(licenseHash: string, renterId: string) {
  const q = query(
    collection(db, "renters"),
    where("licenseHash", "==", licenseHash)
  );

  const snap = await getDocs(q);

  const matches = snap.docs
    .filter(d => d.id !== renterId)
    .map(d => ({
      renterId: d.id,
      createdAt: d.data().createdAt,
    }));

  return {
    reused: matches.length > 0,
    count: matches.length + 1,
    matches,
  };
}
