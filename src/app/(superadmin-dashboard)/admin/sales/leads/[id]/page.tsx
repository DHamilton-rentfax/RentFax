"use client";

import { useEffect, useState } from "react";
import { db } from "@/firebase/client";
import { doc, onSnapshot } from "firebase/firestore";
import { LeadNotes } from "@/components/sales/LeadNotes";
import { LeadTasks } from "@/components/sales/LeadTasks";
import { LeadActivity } from "@/components/sales/LeadActivity";

export default function LeadDetailPage({ params }: { params: { id: string } }) {
  const [lead, setLead] = useState<any>(null);

  useEffect(() => {
    const ref = doc(db, "leads", params.id);
    return onSnapshot(ref, (snap) => setLead({ id: snap.id, ...snap.data() }));
  }, [params.id]);

  if (!lead) return <div>Loading...</div>;

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">{lead.name}</h1>
      <p className="text-muted-foreground">{lead.companyName}</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Notes */}
        <LeadNotes leadId={lead.id} />

        {/* Tasks */}
        <LeadTasks leadId={lead.id} />

        {/* Activity */}
        <LeadActivity leadId={lead.id} />
      </div>
    </div>
  );
}
