
export async function runFraudChecks({ renterId, incidentId, companyId, category, details }) {
  const flags: string[] = [];

  if (category === "identity-issues") {
    flags.push("IDENTITY_MISMATCH");
  }

  if (category === "criminal-activity") {
    flags.push("CRIMINAL_BEHAVIOR");
  }

  if (category === "payment-issues" && details.amount > 2000) {
    flags.push("HIGH_BALANCE_OWED");
  }

  return {
    score: flags.length * 25,
    alert: flags.length > 0,
    reason: flags,
  };
}
