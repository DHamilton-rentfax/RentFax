"use client";

import { useEffect, useState } from "react";
import { db } from "@/firebase/client";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import Link from "next/link";
import { LeadCard } from "@/components/sales/LeadCard";
import { Button } from "@/components/ui/button";

export default function LeadsPage() {
  const [leads, setLeads] = useState<any[]>([]);

  useEffect(() => {
    const q = query(collection(db, "leads"), orderBy("createdAt", "desc"));
    return onSnapshot(q, (snap) => {
      setLeads(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Leads</h1>
        <Link href="/sales/leads/new">
          <Button>New Lead</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {leads.map((lead) => (
          <Link href={`/sales/leads/${lead.id}`} key={lead.id}>
            <LeadCard lead={lead} />
          </Link>
        ))}
      </div>
    </div>
  );
}
