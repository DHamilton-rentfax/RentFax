/**
 * computeConfidenceScore.ts
 *
 * Main scoring engine used to generate a renter "confidence score"
 * from multiple identity + fraud signals.
 *
 * This score is NOT returned to the user unless enabled
 * via a Super Admin feature flag.
 */

export type ConfidenceInput = {
  fullNameMatch?: number;        // 0–100 name similarity
  emailMatch?: number;           // 0–100 email confidence (optional external API)
  phoneMatch?: number;           // 0–100 phone confidence
  addressMatch?: number;         // 0–100 address confidence score

  licenseMatch?: boolean;        // strong identity point if true

  fraudScore?: number;           // 0–100 fraud risk (inverted to reduce confidence)
  incidentCount?: number;        // number of reports
  unresolvedDebt?: number;       // unpaid balances in dollars
  disputes?: number;             // number of ongoing disputes

  aiRiskScore?: number | null;   // optional — your AI model output (0–100)
};

/* ----------------------------------------------------------------------------------------------
 * INTERNAL WEIGHT SYSTEM
 * You can adjust these weights later in Admin Panel.
 * --------------------------------------------------------------------------------------------*/
const WEIGHTS = {
  identity: 0.55,      // Identity signals (name/email/phone/address/license)
  fraud: 0.20,         // Fraud engine influence
  history: 0.15,       // Incident history
  ai: 0.10,            // AI risk score
};

/* Individual identity signal weights */
const IDENTITY_WEIGHTS = {
  fullName: 0.30,
  email: 0.20,
  phone: 0.20,
  address: 0.20,
  license: 0.10,
};

/* ----------------------------------------------------------------------------------------------
 * Normalizer helper
 * --------------------------------------------------------------------------------------------*/
function normalize(value: number | undefined | null, fallback = 0): number {
  if (value == null || isNaN(value)) return fallback;
  return Math.min(100, Math.max(0, value));
}

/* ----------------------------------------------------------------------------------------------
 * Main Compute Function
 * --------------------------------------------------------------------------------------------*/
export function computeConfidenceScore(input: ConfidenceInput): number {
  // ------------------------------
  // 1. Identity Composite
  // ------------------------------
  const nameScore = normalize(input.fullNameMatch);
  const emailScore = normalize(input.emailMatch);
  const phoneScore = normalize(input.phoneMatch);
  const addrScore = normalize(input.addressMatch);
  const licenseScore = input.licenseMatch ? 100 : 0;

  const identityComposite =
    nameScore * IDENTITY_WEIGHTS.fullName +
    emailScore * IDENTITY_WEIGHTS.email +
    phoneScore * IDENTITY_WEIGHTS.phone +
    addrScore * IDENTITY_WEIGHTS.address +
    licenseScore * IDENTITY_WEIGHTS.license;

  // ------------------------------
  // 2. Fraud Inversion
  //    (High fraudScore reduces confidence)
  // ------------------------------
  const fraudBase = normalize(input.fraudScore);
  const fraudComponent = 100 - fraudBase;

  // ------------------------------
  // 3. Rental History Component
  // ------------------------------
  const incidentPenalty = Math.min(30, (input.incidentCount || 0) * 8);
  const debtPenalty = Math.min(40, (input.unresolvedDebt || 0) / 25);
  const disputesPenalty = Math.min(20, (input.disputes || 0) * 5);

  const historyComponent = normalize(
    100 - (incidentPenalty + debtPenalty + disputesPenalty)
  );

  // ------------------------------
  // 4. AI Risk Signal
  // ------------------------------
  const aiComponent = normalize(input.aiRiskScore, 50);

  // ------------------------------
  // 5. Composite Weighted Score
  // ------------------------------
  const finalScore =
    identityComposite * WEIGHTS.identity +
    fraudComponent * WEIGHTS.fraud +
    historyComponent * WEIGHTS.history +
    aiComponent * WEIGHTS.ai;

  return Math.round(finalScore);
}

/* ----------------------------------------------------------------------------------------------
 * Optional: Export diagnostics for admin deep debugging
 * --------------------------------------------------------------------------------------------*/
export function computeConfidenceDebug(input: ConfidenceInput) {
  const score = computeConfidenceScore(input);
  return {
    score,
    weights: WEIGHTS,
    identity: {
      fullName: normalize(input.fullNameMatch),
      email: normalize(input.emailMatch),
      phone: normalize(input.phoneMatch),
      address: normalize(input.addressMatch),
      license: input.licenseMatch ? 100 : 0,
    },
    fraud: normalize(input.fraudScore),
    history: {
      incidentCount: input.incidentCount ?? 0,
      unresolvedDebt: input.unresolvedDebt ?? 0,
      disputes: input.disputes ?? 0,
    },
    ai: normalize(input.aiRiskScore),
  };
}
