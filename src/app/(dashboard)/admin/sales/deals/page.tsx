"use client";

import { useEffect, useState } from "react";
import { db } from "@/firebase/client";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import Link from "next/link";
import { DealCard } from "@/components/sales/DealCard";
import { Button } from "@/components/ui/button";

export default function DealsPage() {
  const [deals, setDeals] = useState<any[]>([]);

  useEffect(() => {
    const q = query(collection(db, "deals"), orderBy("createdAt", "desc"));
    return onSnapshot(q, (snap) => {
      setDeals(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Deals</h1>

        <Link href="/sales/deals/new">
          <Button>New Deal</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {deals.map((deal) => (
          <Link href={`/sales/deals/${deal.id}`} key={deal.id}>
            <DealCard deal={deal} />
          </Link>
        ))}
      </div>
    </div>
  );
}
