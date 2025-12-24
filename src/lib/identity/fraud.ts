export function evaluateFraudSignals(v: any) {
  return {
    idExpired: isExpired(v.extracted?.expiration),
    nameMismatch:
      v.extracted?.fullName &&
      v.fullName &&
      v.extracted.fullName.toLowerCase() !== v.fullName.toLowerCase(),

    duplicateIDUsedByOthers: v.matchHits && v.matchHits > 1,

    addressMismatch:
      v.address &&
      v.extracted?.address &&
      v.address.toLowerCase() !== v.extracted.address.toLowerCase(),

    faceMismatch: (v.extracted?.faceMatchScore ?? 0) < 50,
  };
}

function isExpired(date: string | null) {
  if (!date) return false;
  return new Date(date) < new Date();
}
