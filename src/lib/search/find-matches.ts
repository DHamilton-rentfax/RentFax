import { adminDb } from "../firebase/server";

export async function findMatches({ fullName, email, phone }: any) {
  const rentersRef = adminDb.collection("renters");
  const candidates: any[] = [];

  if (email) {
    const snap = await rentersRef.where("email", "==", email).get();
    snap.forEach((d) => candidates.push({ id: d.id, ...d.data(), match: "email" }));
  }

  if (phone) {
    const snap = await rentersRef.where("phone", "==", phone).get();
    snap.forEach((d) => candidates.push({ id: d.id, ...d.data(), match: "phone" }));
  }

  // fallback: name similarity
  const normalized = fullName.toLowerCase().trim();
  const nameSnap = await rentersRef.limit(50).get();
  nameSnap.forEach((d) => {
    const name = d.get("fullName")?.toLowerCase();
    if (name && name.includes(normalized)) {
      candidates.push({ id: d.id, ...d.data(), match: "name" });
    }
  });

  return dedupe(candidates);
}

function dedupe(list: any[]) {
  const map = new Map();
  list.forEach((item) => map.set(item.id, item));
  return Array.from(map.values());
}