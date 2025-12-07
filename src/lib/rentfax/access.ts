export function canViewIncident(user: any, incident: any) {
  if (!user) return false;

  if (user.role === "SUPER_ADMIN") return true;

  if (user.role === "COMPANY_ADMIN" && user.companyId === incident.companyId)
    return true;

  if (user.role === "STAFF" && user.companyId === incident.companyId)
    return true;

  if (user.role === "RENTER" && user.uid === incident.renterId) return true;

  return false;
}
