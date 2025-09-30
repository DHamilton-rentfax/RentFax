'use client';
import Protected from '@/components/protected';
import { Button } from '@/components/ui/button';

export default function AdminDashboard() {
  return (
    <Protected roles={['admin', 'super_admin']}>
      <div className="p-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="mt-2 text-gray-600">
          This is the central hub for managing your application.
        </p>
        <div className="mt-6 flex gap-4">
          <Button>Manage Users</Button>
          <Button>View Reports</Button>
        </div>
      </div>
    </Protected>
  );
}
