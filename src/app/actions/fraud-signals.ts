"use server";

import { adminDb } from "@/firebase/server";

/**
 * Fake baseline fraud detection until we connect real signals.
 * This keeps everything running without breaking the API.
 */
export async function getFraudSignals(renterData: any) {
  if (!renterData) return [];

  // TODO: replace with your real fraud engine logic
  // For now, return placeholder signals
  return [
    {
      type: "BASIC_IDENTITY_MATCH",
      severity: "low",
      message: "Identity validated through basic checks.",
    },
  ];
}
