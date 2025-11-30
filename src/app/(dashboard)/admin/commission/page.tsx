
"use client";

import { useEffect, useState } from "react";
import { db } from "@/firebase/client";
import { collection, onSnapshot } from "firebase/firestore";
import { CommissionTable } from "@/components/admin/commission/CommissionTable";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CommissionDashboard() {
  const [reps, setReps] = useState<any[]>([]);
  const [overrides, setOverrides] = useState<any[]>([]);

  useEffect(() => {
    const unsubReps = onSnapshot(collection(db, "users"), snap => {
      setReps(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    const unsubOverrides = onSnapshot(collection(db, "rep_commission"), snap => {
      setOverrides(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    return () => { unsubReps(); unsubOverrides(); };
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <h1 className="text-xl font-bold">Commission Management</h1>
        <Link href="/commission/settings">
          <Button>Global Settings</Button>
        </Link>
      </div>

      <CommissionTable reps={reps} overrides={overrides} />
    </div>
  );
}
