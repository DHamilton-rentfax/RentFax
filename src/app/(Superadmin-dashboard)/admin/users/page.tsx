"use client";

import LayoutWrapper from "@/components/dashboard/LayoutWrapper";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

// This would be replaced by a custom hook like `useUsers` in a real app
const usersData = [
  { id: "1", name: "Alice Johnson", email: "alice@example.com", role: "renter", status: "active" },
  { id: "2", name: "Bob Smith", email: "bob@company.com", role: "company", status: "active" },
  { id: "3", name: "Charlie Brown", email: "charlie@agency.com", role: "agency", status: "pending" },
  { id: "4", name: "Diana Prince", email: "diana@justice.org", role: "superadmin", status: "active" },
  { id: "5", name: "Eve Adams", email: "eve@example.com", role: "renter", status: "inactive" },

];

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = usersData.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <LayoutWrapper role="superadmin">
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">User Management</h1>
        <div className="mb-4">
          <Input
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <Card>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell><Badge variant="outline">{user.role}</Badge></TableCell>
                    <TableCell><Badge variant={user.status === 'active' ? 'default' : 'destructive'}>{user.status}</Badge></TableCell>
                    <TableCell>
                      <button className="text-sm bg-blue-500 text-white px-3 py-1 rounded-md">Edit</button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </LayoutWrapper>
  );
}

// Mock Card components for structure. In a real application, these would be imported from your UI library.
const Card = ({ children }) => <div className="bg-white rounded-lg shadow">{children}</div>;
const CardContent = ({ children }) => <div className="p-6">{children}</div>;
