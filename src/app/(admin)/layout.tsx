import '@/lib/server-only';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { adminAuth } from '@/firebase/server';
import { getUserContext } from '@/app/actions/get-user-context';
import { getOrgContext } from '@/app/actions/get-org-context';
import { ROLES, Role } from '@/types/roles';
import ImpersonationBanner from '@/components/admin/ImpersonationBanner';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sessionCookie = cookies().get('__session')?.value;

  if (!sessionCookie) {
    redirect('/login');
  }

  let ctx: Awaited<ReturnType<typeof getUserContext>>;
  try {
    const decoded = await adminAuth.verifySessionCookie(sessionCookie, true);
    ctx = await getUserContext(decoded.uid);
  } catch {
    redirect('/login');
  }

  const allowedRoles: Role[] = [
    ROLES.SUPER_ADMIN,
    ROLES.COMPANY_ADMIN,
    ROLES.ORG_OWNER,
  ];

  if (!allowedRoles.includes(ctx.role)) {
    redirect('/unauthorized');
  }

  const { isImpersonating, orgName, impersonationExpiresAt } =
    await getOrgContext();

  return (
    <>
      {isImpersonating && (
        <ImpersonationBanner
          orgName={orgName!}
          expiresAt={impersonationExpiresAt}
          redirectTo="/admin"
        />
      )}
      {children}
    </>
  );
}
