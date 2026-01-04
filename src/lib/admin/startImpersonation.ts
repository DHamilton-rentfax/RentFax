import { adminAuth } from "@/firebase/server";

export async function startImpersonation(
  adminUid: string,
  targetOrgId: string
) {
  return adminAuth.createCustomToken(adminUid, {
    impersonatingOrgId: targetOrgId,
    impersonatedBy: adminUid,
    isImpersonation: true,
  });
}
