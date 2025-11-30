"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserPlus, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

// Define user roles for type safety
type UserRole = "VIEWER" | "EDITOR" | "ADMIN" | "SUPER_ADMIN";

// Define the structure for the form data
interface CreateUserForm {
  name: string;
  email: string;
  role: UserRole;
}

// Define the props for the modal
export interface AdminCreateUserModalProps {
  close: () => void;
}

export default function AdminCreateUserModal({ close }: AdminCreateUserModalProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<CreateUserForm>({
    name: "",
    email: "",
    role: "VIEWER",
  });

  // Role-gating: Allow SUPER_ADMIN or ADMIN
  if (!user || (user.role !== "SUPER_ADMIN" && user.role !== "ADMIN")) {
    close();
    return null;
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | { name: string; value: string }>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name!]: value }));
  };

  const handleRoleChange = (value: UserRole) => {
    setForm((prev) => ({ ...prev, role: value }));
  };

  const isFormValid = form.name && form.email;

  const createUser = async () => {
    if (!isFormValid) return;

    setLoading(true);
    try {
      const res = await fetch("/api/admin/users/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to create user");
      }
      close();
    } catch (err: any) {
      console.error("Create user error:", err);
      // Optionally, display the error message (e.g., `err.message`) in the UI
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6" role="dialog" aria-modal="true">
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <UserPlus className="h-6 w-6 text-blue-600" />
          Create New Admin User
        </h2>
        <p className="text-sm text-gray-500">
          This user will be granted access to the RentFAX admin dashboard.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="user-name" className="text-sm font-medium">
            Full Name
          </label>
          <Input
            id="user-name"
            name="name"
            placeholder="e.g., Jane Doe"
            value={form.name}
            onChange={handleChange}
            className="mt-1"
          />
        </div>
        <div>
          <label htmlFor="user-email" className="text-sm font-medium">
            Email Address
          </label>
          <Input
            id="user-email"
            name="email"
            type="email"
            placeholder="e.g., jane.doe@example.com"
            value={form.email}
            onChange={handleChange}
            className="mt-1"
          />
        </div>
        <div>
          <label htmlFor="user-role" className="text-sm font-medium">
            Assign Role
          </label>
          <Select onValueChange={handleRoleChange} value={form.role} name="role">
            <SelectTrigger id="user-role" className="w-full mt-1">
              <SelectValue placeholder="Select a role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="VIEWER">Viewer</SelectItem>
              <SelectItem value="EDITOR">Editor</SelectItem>
              {user.role === "SUPER_ADMIN" && (
                <>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                  <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                </>
              )}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-3 pt-4">
        <Button
          className="w-full"
          onClick={createUser}
          disabled={loading || !isFormValid}
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create User"}
        </Button>
        <Button variant="outline" className="w-full" onClick={close}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
