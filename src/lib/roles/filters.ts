export function canAccessRecord(user: any, record: any) {
  if (user.role === "SUPER_ADMIN") return true;
  if (user.role === "COMPANY_OWNER") return true;

  // team-level permission
  if (user.teamId && record.teamId) {
    return user.teamId === record.teamId;
  }

  // org-unit hierarchy
  if (user.orgUnitId && record.orgUnitId) {
    return user.orgUnitId === record.orgUnitId;
  }

  return false;
}
