"use client";

import { useEffect, useState } from "react";
import { db } from "@/firebase/client";
import { doc, onSnapshot } from "firebase/firestore";
import { DealStageSelect } from "@/components/sales/DealStageSelect";
import { DealActivity } from "@/components/sales/DealActivity";
import { DealTasks } from "@/components/sales/DealTasks";
import { DealNotes } from "@/components/sales/DealNotes";

export default function DealDetailPage({ params }: { params: { id: string } }) {
  const [deal, setDeal] = useState<any>(null);

  useEffect(() => {
    const ref = doc(db, "deals", params.id);
    return onSnapshot(ref, (snap) => setDeal({ id: snap.id, ...snap.data() }));
  }, [params.id]);

  if (!deal) return <div>Loading...</div>;

  const mrr = deal.amountMonthly?.toLocaleString();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{deal.companyName}</h1>
        <p className="text-muted-foreground">MRR: ${mrr}</p>
      </div>

      <div className="w-60">
        <DealStageSelect dealId={deal.id} value={deal.stage} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <DealNotes dealId={deal.id} />
        <DealTasks dealId={deal.id} />
        <DealActivity dealId={deal.id} />
      </div>
    </div>
  );
}
