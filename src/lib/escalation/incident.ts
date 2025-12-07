export function determineIncidentApprover(incident: any, user: any) {
  if (incident.severity === "SEVERE") return "DIRECTOR";
  if (incident.severity === "HIGH") return "MANAGER";
  return "STAFF";
}
