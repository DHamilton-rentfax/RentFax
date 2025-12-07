export function computeBehaviorMetrics(graph: any) {
  const payments = graph.payments || [];
  const incidents = graph.incidents || [];
  const verifications = graph.verifications || [];

  const metrics = {
    paymentConsistency: 100 - payments.filter(p => p.status !== "ON_TIME").length * 10,
    incidentDensity: incidents.length,
    severeIncidents: incidents.filter(i => i.severity === "SEVERE").length,
    identityLevel: verifications.sort((a,b) => b.level - a.level)[0]?.level || 0,
    crossIndustrySpan: new Set(incidents.map(i => i.industry)).size,
  };

  return metrics;
}
