import { CompanyReputationInputs } from "./reputation-types";
import { CompanyReputationWeights } from "./reputation-weights";

export function calculateCompanyReputation(inputs: CompanyReputationInputs): number {
  // --- Dispute Resolution (30%) ---
  const disputeTotal = inputs.disputesResolved + inputs.disputesIgnored;
  const disputeRate =
    disputeTotal > 0 ? inputs.disputesResolved / disputeTotal : 1;

  const disputeScore = disputeRate * 100;

  // --- Incident Behavior (25%) ---
  const incidentSafety =
    inputs.incidentsFiled > 0
      ? 1 - inputs.severeIncidents / inputs.incidentsFiled
      : 1;

  const incidentScore = incidentSafety * 100;

  // --- Operational Quality (20%) ---
  const customerServiceScore =
    inputs.customerServiceRating
      ? (inputs.customerServiceRating / 5) * 100
      : 80; // neutral default

  const refundPenalty = inputs.refundRate
    ? 100 - inputs.refundRate * 1.5
    : 100;

  const operational = (customerServiceScore + refundPenalty) / 2;

  // --- Compliance (15%) ---
  let compliance = 0;
  if (inputs.verifiedBusiness) compliance += 40;
  if (inputs.insuranceVerified) compliance += 40;
  if (inputs.fairHousingCompliant) compliance += 20;

  // --- Transparency (10%) ---
  const transparency = inputs.errorCorrections > 0 ? 100 : 70;

  // Weighted Total
  const score =
    disputeScore * CompanyReputationWeights.DISPUTE_RESOLUTION +
    incidentScore * CompanyReputationWeights.INCIDENT_BEHAVIOR +
    operational * CompanyReputationWeights.OPERATIONAL_QUALITY +
    compliance * CompanyReputationWeights.COMPLIANCE +
    transparency * CompanyReputationWeights.TRANSPARENCY;

  return Math.round(score);
}
