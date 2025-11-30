// src/lib/fraudSignals.ts

/*
  Fraud signal engine for RentFAX.
  This evaluates public data, identity checks, incidents, disputes,
  behavioral patterns, and metadata to create a set of risk indicators.
*/

export function analyzeFraudSignals(input: {
  fullName: string;
  email?: string;
  phone?: string;
  publicProfile?: any;
  incidents?: any[];
  disputes?: any[];
}) {
  const signals = [];

  const {
    publicProfile,
    incidents = [],
    disputes = [],
  } = input;

  /* -----------------------------------------------------------
   * PUBLIC DATA SIGNALS
   * ----------------------------------------------------------- */

  // 1. Court cases found (even 1 is notable)
  if (publicProfile?.courtRecords?.length >= 1) {
    signals.push({
      code: "COURT_CASE_PRESENT",
      label: "Court Cases Found",
      severity:
        publicProfile.courtRecords.length >= 3
          ? "HIGH"
          : publicProfile.courtRecords.length === 2
          ? "MEDIUM"
          : "LOW",
      details: `${publicProfile.courtRecords.length} court record(s) located in public databases.`,
    });
  }

  // 2. Phone validation risk
  if (publicProfile?.phoneValidation) {
    const pv = publicProfile.phoneValidation;

    if (!pv.valid || pv.lineType === "voip") {
      signals.push({
        code: "PHONE_RISK",
        label: "Phone Number Risk",
        severity: pv.valid ? "MEDIUM" : "HIGH",
        details: `Phone validation returned line type=${pv.lineType}, carrier=${pv.carrier}.`,
      });
    }
  }

  // 3. Email validation risk
  if (publicProfile?.emailValidation) {
    const ev = publicProfile.emailValidation;

    if (!ev.valid || ev.disposable) {
      signals.push({
        code: "EMAIL_RISK",
        label: "Email Risk",
        severity: ev.disposable ? "HIGH" : "MEDIUM",
        details: ev.disposable
          ? "Email is flagged as disposable."
          : "Email failed deliverability checks.",
    });
  }

  // 4. Address instability (3+ moves)
  if (publicProfile?.addresses?.length >= 3) {
    signals.push({
      code: "ADDRESS_INSTABILITY",
      label: "Address Instability",
      severity:
        publicProfile.addresses.length >= 4 ? "HIGH" : "MEDIUM",
      details: `This renter has ${publicProfile.addresses.length} known address changes.`,
    });
  }

  /* -----------------------------------------------------------
   * INCIDENT BEHAVIOR SIGNALS
   * ----------------------------------------------------------- */

  if (incidents.length > 0) {
    const totalAmounts = incidents
      .map((i) => i.amount || 0)
      .reduce((a, b) => a + b, 0);

    signals.push({
      code: "INCIDENT_HISTORY",
      label: "Incident History",
      severity: totalAmounts >= 1000 ? "HIGH" : "MEDIUM",
      details: `${incidents.length} recorded incident(s). Total claimed damages: $${totalAmounts}.`,
    });
  }

  /* -----------------------------------------------------------
   * DISPUTE BEHAVIOR SIGNALS
   * ----------------------------------------------------------- */

  const rejectedDisputes = disputes.filter(
    (d) => d.status === "REJECTED"
  ).length;

  if (rejectedDisputes >= 1) {
    signals.push({
      code: "DISPUTE_PATTERN",
      label: "Dispute Pattern",
      severity: rejectedDisputes >= 2 ? "HIGH" : "MEDIUM",
      details: `${rejectedDisputes} dispute(s) submitted and rejected.`,
    });
  }

  /* -----------------------------------------------------------
   * IDENTITY CONFIDENCE SIGNAL
   * ----------------------------------------------------------- */

  if (publicProfile && publicProfile.matchConfidence < 0.6) {
    signals.push({
      code: "LOW_IDENTITY_CONFIDENCE",
      label: "Low Identity Confidence",
      severity: "HIGH",
      details:
        "Public data match confidence is below reliable threshold. Name/email/phone may not match known records.",
    });
  }

  /* -----------------------------------------------------------
   * RETURN RESULTS
   * ----------------------------------------------------------- */

  return signals;
}
