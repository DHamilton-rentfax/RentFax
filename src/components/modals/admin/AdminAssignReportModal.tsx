"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, UserCircle2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

type AuthUser = {
  uid?: string;
  role?: string;
  email?: string | null;
};

interface AdminAssignReportModalProps {
  reportId: string;
  currentAssigneeEmail?: string | null;
  close: () => void;
}

export default function AdminAssignReportModal({
  reportId,
  currentAssigneeEmail,
  close,
}: AdminAssignReportModalProps) {
  const { user } = useAuth() as { user: AuthUser | null };
  const [assigneeEmail, setAssigneeEmail] = useState<string>(
    currentAssigneeEmail ?? ""
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Only admins / super admins should use this modal
  const role = user?.role ?? "";
  const isAllowed =
    role === "SUPER_ADMIN" || role === "ADMIN" || role === "CONTENT_MANAGER";

  if (!isAllowed) {
    // hard-fail closed if someone else somehow opens it
    close();
    return null;
  }

  const handleAssign = async () => {
    if (!assigneeEmail.trim()) {
      setError("Please enter an email to assign this report.");
      return;
    }

    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/reports/assign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reportId,
          assigneeEmail: assigneeEmail.trim(),
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Failed to assign report");
      }

      close();
    } catch (err: any) {
      console.error("Assign report failed", err);
      setError(err.message || "Something went wrong while assigning.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <UserCircle2 className="h-5 w-5 text-blue-600" />
        <h2 className="text-lg font-semibold">Assign Report</h2>
      </div>

      <p className="text-sm text-gray-600">
        Assign this report to an internal reviewer. They&apos;ll receive a
        notification and see it in their queue.
      </p>

      <div className="space-y-2">
        <label className="text-xs font-medium text-gray-700">
          Reviewer email
        </label>
        <Input
          type="email"
          placeholder="reviewer@company.com"
          value={assigneeEmail}
          onChange={(e) => setAssigneeEmail(e.target.value)}
        />
        {currentAssigneeEmail && (
          <p className="text-xs text-gray-500">
            Current assignee: <span className="font-medium">{currentAssigneeEmail}</span>
          </p>
        )}
      </div>

      {error && <p className="text-xs text-red-600">{error}</p>}

      <div className="flex gap-2 pt-2">
        <Button
          className="flex-1"
          onClick={handleAssign}
          disabled={loading || !assigneeEmail.trim()}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Assign Report"
          )}
        </Button>
        <Button variant="outline" className="flex-1" onClick={close}>
          Cancel
        </Button>
      </div>
    </div>
  );
}