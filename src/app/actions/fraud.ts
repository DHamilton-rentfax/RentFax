import { PhoneValidation } from "./types";

export function calculateFraudScore(phoneValidation?: PhoneValidation, lawsuitCount?: number) {
  const warnings: string[] = [];
  let score = 0;

  if (phoneValidation?.lineType === "VOIP") {
    warnings.push("Phone line is VOIP, which can be a higher risk.");
    score += 20;
  }

  if (lawsuitCount && lawsuitCount > 0) {
    warnings.push(`Applicant has ${lawsuitCount} lawsuit(s) on record.`);
    score += lawsuitCount * 10;
  }

  return { score, warnings };
}