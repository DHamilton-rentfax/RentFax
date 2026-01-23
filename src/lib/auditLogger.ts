type AuditLogParams = {
  action: string;
  actorUid?: string;
  targetId?: string;
  metadata?: Record<string, any>;
};

export async function auditLogger(_params: AuditLogParams) {
  // Stub: real implementation can be added later
  return;
}
