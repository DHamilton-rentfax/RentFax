// src/lib/verification/getVerificationStatus.ts
"use server";

import { adminDb } from "@/lib/firebase/server";
import {
  VerificationState,
  VerificationLevel,
  getVerificationLabel,
} from "./types";

export async function getVerificationStatus(
  renterId: string
): Promise<VerificationState> {
  const doc = await adminDb.collection("renters").doc(renterId).get();

  if (!doc.exists) {
    // No renter yet → treat as unverified
    return {
      level: "UNVERIFIED",
      label: getVerificationLabel("UNVERIFIED"),
      hasId: false,
      hasSelfie: false,
    };
  }

  const data = doc.data() || {};
  const v = (data.verification || {}) as {
    level?: VerificationLevel;
    hasId?: boolean;
    hasSelfie?: boolean;
    reason?: string;
  };

  const level: VerificationLevel = v.level || "UNVERIFIED";

  return {
    level,
    label: getVerificationLabel(level),
    hasId: !!v.hasId,
    hasSelfie: !!v.hasSelfie,
    reason: v.reason,
  };
}
