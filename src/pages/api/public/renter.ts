import { adminDb } from "@/firebase/server";

export default async function handler(req, res) {
  const { pid } = req.query;

  const snapshot = await adminDb
    .collection("renters")
    .where("publicProfileId", "==", pid)
    .limit(1)
    .get();

  if (snapshot.empty) {
    return res.status(404).json({ error: "Profile not found" });
  }

  const renterDoc = snapshot.docs[0];
  const renterData = renterDoc.data();

  if (renterData.publicVisibility === "HIDDEN") {
    return res.status(403).json({ error: "Profile is private" });
  }

  const profile = {
    name: renterData.name,
    photoUrl: renterData.photoUrl,
    verified: renterData.identityVerified,
    reputationScore: renterData.reputationScore,
    badges: renterData.badges || [],
    history: renterData.publicHistory || [],
    publicVisibility: renterData.publicVisibility,
  };

  if (renterData.publicVisibility === "LIMITED") {
    delete profile.history;
  }

  res.status(200).json(profile);
}
