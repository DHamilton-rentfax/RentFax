import '@/lib/server-only'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { adminAuth } from '@/firebase/server'
import { getUserContext } from '@/app/actions/get-user-context'
import { getOrgContext } from '@/app/actions/get-org-context'
import ImpersonationBanner from '@/components/admin/ImpersonationBanner'

export default async function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = cookies().get('__session')
  if (!session) {
    const loginUrl = process.env.NEXT_PUBLIC_APP_URL ? `${process.env.NEXT_PUBLIC_APP_URL}/login` : '/login';
    redirect(loginUrl);
  }

  const decoded = await adminAuth.verifySessionCookie(session.value, true)
  const ctx = await getUserContext(decoded.uid)

  if (ctx.role !== 'SUPER_ADMIN') {
    redirect('/unauthorized')
  }

  const { isImpersonating, orgName, impersonationExpiresAt } =
    await getOrgContext()

  return (
    <>
      {isImpersonating && (
        <ImpersonationBanner
          orgName={orgName!}
          expiresAt={impersonationExpiresAt}
          redirectTo="/superadmin"
        />
      )}
      {children}
    </>
  )
}
