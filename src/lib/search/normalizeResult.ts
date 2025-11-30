// src/lib/search/normalizeResult.ts
import { NormalizedSearchResult } from "./types";

export function normalizeSearchResult({
  input,
  internalMatch,
  provider,
  identityScore,
}: any): NormalizedSearchResult {
  if (internalMatch) {
    const data = internalMatch.data() || {};
    return {
      source: "internal",
      renterId: internalMatch.id,
      fullName: `${data.firstName} ${data.lastName}`,
      email: data.email,
      phone: data.phone,
      dob: data.dob,
      address: data.address,
      confidence: 100,
      fraudScore: data.fraudScore ?? 0,
      internalData: data,
    };
  }

  return {
    source: provider.status === "MATCH" ? "provider" : "none",
    fullName: `${input.firstName} ${input.lastName}`,
    email: provider.profile?.email || input.email,
    phone: provider.profile?.phone || input.phone,
    dob: provider.profile?.dob,
    address: provider.profile?.address,
    confidence: identityScore,
    fraudScore: provider.fraudScore ?? 0,
    providerRaw: provider,
  };
}
