import { requireAdminOrSuperAdmin } from '@/lib/auth/requireAdminOrSuperAdmin';

export default async function AdminAuditLogPage() {
  const { user } = await requireAdminOrSuperAdmin();

  return (
    <div>
      <h1 className="text-2xl font-bold">Audit Log</h1>
      <p>Welcome, {user.email} ({user.role})</p>
      {/* Audit log components */}
    </div>
  );
}
