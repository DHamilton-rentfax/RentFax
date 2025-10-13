"use client";

import { useEffect, useState } from "react";
import { db } from "@/firebase/client";
import { collection, getDocs } from "firebase/firestore";
import { updateUserRole } from "@/app/actions/update-user-role";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";

export default function RoleManagementPage() {
  const { user: adminUser } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUsers() {
      const snap = await getDocs(collection(db, "users"));
      const list: any[] = [];
      snap.forEach((doc) => list.push({ id: doc.id, ...doc.data() }));
      setUsers(list);
      setLoading(false);
    }
    fetchUsers();
  }, []);

  async function handleRoleChange(userId: string, newRole: string) {
    if (!adminUser?.email) {
      alert("Could not verify admin user. Please try again.");
      return;
    }
    const result = await updateUserRole(userId, newRole, adminUser.email);
    if (result.success) {
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)),
      );
      alert(
        "Role updated successfully! User may need to log out and back in for the change to take full effect.",
      );
    } else {
      alert("Error updating role: " + result.error);
    }
  }

  if (loading) return <p className="p-6 text-gray-500">Loading users...</p>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">User & Role Management</h1>

      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b text-left">
                  <th className="p-2">Name</th>
                  <th className="p-2">Email</th>
                  <th className="p-2">Role</th>
                  <th className="p-2">Change Role</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b">
                    <td className="p-2">{user.name || "—"}</td>
                    <td className="p-2">{user.email}</td>
                    <td className="p-2 font-semibold">{user.role}</td>
                    <td className="p-2">
                      <select
                        value={user.role}
                        onChange={(e) =>
                          handleRoleChange(user.id, e.target.value)
                        }
                        className="border rounded px-2 py-1"
                        disabled={user.id === adminUser?.uid} // Disable changing your own role
                      >
                        <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                        <option value="ADMIN">ADMIN</option>
                        <option value="EDITOR">EDITOR</option>
                        <option value="USER">USER</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
