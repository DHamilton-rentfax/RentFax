
interface AccessExplanationResult {
  explanation: string;
  rulesApplied: string[];
}

export function explainAccess(viewer: { id: string; role: string, companyId?: string }, target: { type: string; ownerId?: string; companyId?: string }): AccessExplanationResult {
  const reasons: string[] = [];
  const rules: string[] = [];

  if (viewer.role === "SUPER_ADMIN") {
    reasons.push("You are a Super Admin with full system visibility.");
    rules.push("ROLE_SUPER_ADMIN");
  }

  if (viewer.role === "SUPPORT_ADMIN") {
    reasons.push("You are a Support Admin reviewing this case.");
    rules.push("ROLE_SUPPORT_ADMIN");
  }

  if (viewer.role === "RENTER" && target.ownerId === viewer.id) {
    reasons.push("This record belongs to you.");
    rules.push("OWNER_ACCESS");
  }

  if (viewer.role === "LANDLORD" && target.companyId === viewer.companyId) {
    reasons.push("You are associated with the reporting company.");
    rules.push("COMPANY_ASSOCIATION");
  }

  return {
    explanation: reasons.join(" "),
    rulesApplied: rules,
  };
}
