import { requireSuperAdmin } from '@/lib/auth/requireSuperAdmin';
import UserManagementClient from './user-management-client';

export default async function AdminUsersPage() {
  const { user } = await requireSuperAdmin();

  return (
    <div>
      <h1 className="text-2xl font-bold">User Management</h1>
      <p>Welcome, {user.email} ({user.role})</p>
      <UserManagementClient />
    </div>
  );
}
