
// This is a simplified representation of what would be a more complex permissions object,
// likely fetched from a dedicated service or Firestore.
type SupportPermissions = {
  role: "SUPPORT_AGENT" | "SUPPORT_ADMIN";
  scopes: {
    companies?: string[];
    categories?: string[];
    severities?: string[];
  };
  actions: {
    canAssign: boolean;
    canEscalate: boolean;
    canClose: boolean;
    canEditArticles: boolean;
    canOverrideAI: boolean;
    canViewAuditLogs: boolean;
  };
};

// This represents a simplified support thread object for context.
type SupportThread = {
    companyId?: string;
    category?: string;
    severity?: string;
}

/**
 * Checks if a user has permission to perform a specific action, considering their role, scopes, and the context of the action.
 * @param perms - The user's permission object.
 * @param action - The specific action to check (e.g., "canClose").
 * @param thread - Optional context, such as the support thread being acted upon.
 * @returns boolean - True if the user has permission, false otherwise.
 */
export function hasPermission({
  perms,
  action,
  thread,
}: {
  perms: SupportPermissions | null | undefined;
  action: keyof SupportPermissions["actions"];
  thread?: SupportThread;
}): boolean {
  // Fail-safe: If no permissions object, deny action.
  if (!perms?.actions?.[action]) {
    console.warn(`Permission check failed: Action "${action}" not allowed or permissions object is invalid.`);
    return false;
  }

  // Check scope restrictions if a thread context is provided.
  if (thread) {
    // Company scope
    if (perms.scopes?.companies && perms.scopes.companies.length > 0) {
      if (!thread.companyId || !perms.scopes.companies.includes(thread.companyId)) {
        console.warn(`Permission check failed: User not scoped for company ${thread.companyId}.`);
        return false;
      }
    }

    // Category scope
    if (perms.scopes?.categories && perms.scopes.categories.length > 0) {
      if (!thread.category || !perms.scopes.categories.includes(thread.category)) {
        console.warn(`Permission check failed: User not scoped for category ${thread.category}.`);
        return false;
      }
    }

    // Severity scope
    if (perms.scopes?.severities && perms.scopes.severities.length > 0) {
      if (!thread.severity || !perms.scopes.severities.includes(thread.severity)) {
        console.warn(`Permission check failed: User not scoped for severity ${thread.severity}.`);
        return false;
      }
    }
  }

  // If all checks pass, the user has permission.
  return true;
}
