
"use server";

export async function analyzeBehavioralPatterns(incidents: any[]) {
  let riskPatterns: string[] = [];

  const latePayments = incidents.filter(i => i.type === "nonpayment");
  if (latePayments.length >= 2)
    riskPatterns.push("Repeated Non-Payment Behavior");

  const abandonments = incidents.filter(i => i.type === "abandoned_vehicle");
  if (abandonments.length >= 1)
    riskPatterns.push("Vehicle Abandonment");

  const unauthorizedDrivers = incidents.filter(i => i.hasUnauthorizedDrivers);
  if (unauthorizedDrivers.length >= 1)
    riskPatterns.push("Unauthorized Driver Activity");

  const travelPatterns = incidents.map(i => i.returnLocationState);
  const uniqueStates = [...new Set(travelPatterns)];
  if (uniqueStates.length >= 3)
    riskPatterns.push("Cross-State High Mobility");

  const propertyDamage = incidents.filter(i => i.damageCost > 1000);
  if (propertyDamage.length >= 2)
    riskPatterns.push("Multiple High-Cost Damage Events");

  return riskPatterns;
}
