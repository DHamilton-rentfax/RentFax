
"use client";

import { useState, useEffect } from "react";
import { db } from "@/firebase/client";
import { doc, onSnapshot } from "firebase/firestore";
import { updateRepCommission, removeRepCommissionOverride } from "@/actions/commission/rep";
import { EditCommissionForm } from "@/components/admin/commission/EditCommissionForm";

export default function EditRepCommissionPage({ params }: { params: { id: string } }) {
  const repId = params.id;
  const [override, setOverride] = useState(null);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "rep_commission", repId), snap => {
      setOverride(snap.exists() ? snap.data() : null);
    });
    return unsub;
  }, [repId]);

  return (
    <EditCommissionForm
      repId={repId}
      existing={override}
      save={updateRepCommission}
      remove={removeRepCommissionOverride}
    />
  );
}
