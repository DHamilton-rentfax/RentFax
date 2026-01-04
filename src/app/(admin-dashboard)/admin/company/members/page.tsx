"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";

export default function MembersPage() {
  const [members, setMembers] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/company/members")
      .then(res => res.json())
      .then(d => setMembers(d.members));
  }, []);

  return (
    <div className="p-10 space-y-6">
      <h1 className="text-3xl font-semibold">Team Members</h1>

      <div className="grid gap-4">
        {members.map(m => (
          <Card key={m.userId} className="p-4">
            <p className="font-semibold">{m.name}</p>
            <p className="text-sm">{m.role}</p>
            <p className="text-xs text-muted-foreground mt-1">
              Permissions: {m.permissions.join(", ")}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}
