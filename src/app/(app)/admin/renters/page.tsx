import { requireAdminOrSuperAdmin } from '@/lib/auth/requireAdminOrSuperAdmin'

export default async function AdminRentersPage() {
  const { user } = await requireAdminOrSuperAdmin()

  return (
    <div>
      <h1 className="text-2xl font-bold">Renters Manager</h1>
      <p>Welcome, {user.email} ({user.role})</p>
      {/* Renters management components */}
    </div>
  )
}
