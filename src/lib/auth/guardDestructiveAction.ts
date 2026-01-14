import '@/lib/server-only';

import { requireOrgScope } from './requireOrgScope';

export async function guardDestructiveAction() {
  const { isImpersonating } = await requireOrgScope();

  if (isImpersonating) {
    throw new Error('DESTRUCTIVE_ACTION_BLOCKED_DURING_IMPERSONATION');
  }
}
