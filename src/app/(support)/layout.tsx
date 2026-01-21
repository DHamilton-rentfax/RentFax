import '@/lib/server-only';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { adminAuth } from '@/firebase/server';
import { getUserContext } from '@/app/actions/get-user-context';
import { ROLES, Role } from '@/types/roles';

export default async function SupportLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sessionCookie = cookies().get('__session')?.value;
  if (!sessionCookie) redirect('/login');

  let ctx: Awaited<ReturnType<typeof getUserContext>>;
  try {
    const decoded = await adminAuth.verifySessionCookie(sessionCookie, true);
    ctx = await getUserContext(decoded.uid);
  } catch {
    redirect('/login');
  }

  const allowedRoles: Role[] = [
    ROLES.SUPER_ADMIN,
    ROLES.SUPPORT_ADMIN,
    ROLES.SUPPORT_AGENT,
  ];

  if (!allowedRoles.includes(ctx.role)) {
    redirect('/unauthorized');
  }

  return <>{children}</>;
}
