'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Department, User } from "@/types";
import DepartmentAnalytics from "@/components/admin/DepartmentAnalytics";

export default function DepartmentDetailPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const { token } = useAuth();
  const { toast } = useToast();

  const [department, setDepartment] = useState<Department | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const [deptRes, usersRes, logsRes] = await Promise.all([
        fetch(`/api/admin/departments/${id}`),
        fetch(`/api/admin/departments/${id}/users`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`/api/admin/departments/${id}/logs`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      if (!deptRes.ok || !usersRes.ok || !logsRes.ok) {
        throw new Error("Failed to fetch all department data.");
      }

      const deptData = await deptRes.json();
      const usersData = await usersRes.json();
      const logsData = await logsRes.json();

      setDepartment(deptData.department);
      setUsers(usersData.users || []);
      setLogs(logsData.logs || []);
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id && token) {
      loadData();
    }
  }, [id, token]);

  if (loading) return <p>Loading department details...</p>;
  if (!department) return <p>Department not found.</p>;

  const activeUsers = users.filter((u) => u.active !== false);
  const inactiveUsers = users.filter((u) => u.active === false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">{department.name}</h1>
        <div className="flex items-center gap-2">
          <Link href={`/admin/departments/${id}/timeline`}>
            <Button variant="outline" size="sm">Performance Timeline</Button>
          </Link>
          <Button variant="outline" onClick={() => history.back()}>
            Back
          </Button>
        </div>
      </div>

      {token && <DepartmentAnalytics departmentId={department.id} token={token} />}

      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader><CardTitle>Total Users</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-semibold">{users.length}</p></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Active</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-semibold text-green-600">{activeUsers.length}</p></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Inactive</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-semibold text-muted-foreground">{inactiveUsers.length}</p></CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Team Members</CardTitle></CardHeader>
        <CardContent>
          {users.length === 0 ? (
            <p className="text-sm text-muted-foreground">No users assigned to this department.</p>
          ) : (
            <table className="min-w-full text-sm">
              <thead className="bg-muted text-muted-foreground">
                <tr>
                  <th className="p-2 text-left">Name</th>
                  <th className="p-2 text-left">Email</th>
                  <th className="p-2 text-left">Role</th>
                  <th className="p-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-t">
                    <td className="p-2">{u.name || "—"}</td>
                    <td className="p-2">{u.email}</td>
                    <td className="p-2"><Badge variant="outline">{u.role}</Badge></td>
                    <td className="p-2">
                      {u.active === false ? (
                        <Badge variant="destructive">Inactive</Badge>
                      ) : (
                        <Badge variant="secondary">Active</Badge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Recent Activity</CardTitle></CardHeader>
        <CardContent>
          {logs.length === 0 ? (
            <p className="text-sm text-muted-foreground">No recent activity.</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {logs.map((l) => (
                <li key={l.id} className="border-b pb-2">
                  <strong>{l.action}</strong> by {l.performedBy} — {new Date(l.timestamp).toLocaleString()}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
