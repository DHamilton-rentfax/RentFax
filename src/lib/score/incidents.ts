export function incidentImpact(incidents: any[]) {
  let score = 0;

  incidents.forEach((i) => {
    if (i.severity === "SEVERE") score -= 120;
    if (i.severity === "HIGH") score -= 80;
    if (i.severity === "MEDIUM") score -= 35;
    if (i.severity === "LOW") score -= 10;
  });

  return score;
}
