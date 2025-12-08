'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { UserRole, Department } from '@/types';
import CreateAdminModal from '@/components/admin/CreateAdminModal';
import TeamTable from '@/components/admin/TeamTable';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

export default function TeamPage() {
  const { user, token } = useAuth();
  const [open, setOpen] = useState(false);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [filterDept, setFilterDept] = useState<string>('');

  useEffect(() => {
    async function loadDepartments() {
      const res = await fetch('/api/admin/departments');
      const data = await res.json();
      setDepartments(data.departments || []);
    }
    loadDepartments();
  }, []);

  if (!user || !token) return <p>Loading...</p>;

  return (
    <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Team Management</h1>
          <div className="flex gap-2">
            <Select value={filterDept} onValueChange={setFilterDept}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All</SelectItem>
                {departments.map((d) => (
                  <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {user.role === UserRole.SUPER_ADMIN && (
              <Button onClick={() => setOpen(true)}>+ Create Admin</Button>
            )}
          </div>
        </div>

      <TeamTable token={token} currentRole={user.role} filterDept={filterDept} />

      {user.role === UserRole.SUPER_ADMIN && (
        <CreateAdminModal open={open} onOpenChange={setOpen} token={token} />
      )}
    </div>
  );
}
