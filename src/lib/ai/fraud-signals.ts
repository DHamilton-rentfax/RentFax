export function computeFraudSignals(input: any, matches: any[]) {
  const signals: string[] = [];

  // Signal 1 — duplicate email across renters
  if (matches.some((m) => m.email === input.email)) {
    signals.push("DUPLICATE_EMAIL");
  }

  // Signal 2 — duplicate phone across renters
  if (matches.some((m) => m.phone === input.phone)) {
    signals.push("DUPLICATE_PHONE");
  }

  // Signal 3 — multiple identity hashes
  if (matches.some((m) => m.identityHash === input.identityHash)) {
    signals.push("IDENTITY_REUSE");
  }

  // Signal 4 — license collision
  if (
    matches.some(
      (m) =>
        m.licenseNumber &&
        input.licenseNumber &&
        m.licenseNumber === input.licenseNumber
    )
  ) {
    signals.push("LICENSE_COLLISION");
  }

  // Signal 5 — address mismatch
  if (
    matches.some(
      (m) =>
        m.address &&
        input.address &&
        m.address !== input.address
    )
  ) {
    signals.push("ADDRESS_VARIATION");
  }

  return signals;
}
