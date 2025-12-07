import { COMPANY_BADGES } from "./badges";

export function calculateCompanyBadges(metrics: any, company: any) {
  const badges: string[] = [];

  // Verified Business
  if (company.verified) badges.push(COMPANY_BADGES.VERIFIED_BUSINESS.id);

  // Insurance Verified
  if (company.insuranceVerified) badges.push(COMPANY_BADGES.INSURANCE_VERIFIED.id);

  // Fair Housing Compliance
  if (company.fairHousingCompliant) badges.push(COMPANY_BADGES.FAIR_HOUSING_COMPLIANT.id);

  // Low Incident Rate
  const incidentRate =
    metrics.totalIncidents > 0
      ? metrics.severeIncidents / metrics.totalIncidents
      : 0;

  if (incidentRate < 0.02) {
    badges.push(COMPANY_BADGES.LOW_INCIDENT_RATE.id);
  }

  // High Resolution Rate
  const resolutionRate =
    metrics.disputesOpened > 0
      ? metrics.disputesResolved / metrics.disputesOpened
      : 1;

  if (resolutionRate > 0.9) {
    badges.push(COMPANY_BADGES.HIGH_RESOLUTION_RATE.id);
  }

  // Top Performer (Composite)
  const topPerformer =
    resolutionRate > 0.93 &&
    incidentRate < 0.015 &&
    company.verified &&
    company.insuranceVerified;

  if (topPerformer) {
    badges.push(COMPANY_BADGES.TOP_PERFORMER.id);
  }

  return badges;
}
