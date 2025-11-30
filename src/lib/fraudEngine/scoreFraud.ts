import { adminDb } from "@/firebase/server";

export async function scoreFraud(renterId, identity) {
  const signals = [];
  let fraudScore = 0;

  // 1 — Reused ID across renters
  const sameId = await adminDb
    .collection("renters")
    .where("identity.idFrontUrl", "==", identity.idFrontUrl)
    .get();

  if (sameId.size > 1) {
    signals.push({
      id: "reused_id",
      label: "ID reused across multiple users",
      severity: "high",
    });
    fraudScore += 40;
  }

  // 2 — Reused selfie
  const sameSelfie = await adminDb
    .collection("renters")
    .where("identity.selfieUrl", "==", identity.selfieUrl)
    .get();

  if (sameSelfie.size > 1) {
    signals.push({
      id: "reused_selfie",
      label: "Selfie reused across accounts",
      severity: "high",
    });
    fraudScore += 40;
  }

  // 3 — Suspicious email domain
  const riskyDomains = ["mailinator.com", "tempmail", "guerrillamail"];
  if (identity.ocrData.email) {
    const domain = identity.ocrData.email.split("@")[1];
    if (riskyDomains.some((d) => domain.includes(d))) {
      signals.push({
        id: "temp_email",
        label: "Disposable or suspicious email domain",
        severity: "medium",
      });
      fraudScore += 20;
    }
  }

  // 4 — Age mismatch
  if (identity.ocrData.dob) {
    const age = calculateAge(identity.ocrData.dob);
    if (age < 16 || age > 100) {
      signals.push({
        id: "invalid_age",
        label: "ID age is unrealistic",
        severity: "medium",
      });
      fraudScore += 20;
    }
  }

  return {
    fraudScore: Math.min(fraudScore, 100),
    fraudSignals: signals,
  };
}

function calculateAge(dob) {
  const birth = new Date(dob);
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const m = now.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;
  return age;
}