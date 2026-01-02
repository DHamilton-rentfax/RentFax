"use client";

import { useEffect, useState } from "react";
import { createDeal } from "@/actions/sales/deals";
import { db } from "@/firebase/client";
import { collection, onSnapshot } from "firebase/firestore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function NewDealPage() {
  const router = useRouter();
  const [leads, setLeads] = useState<any[]>([]);

  const [form, setForm] = useState({
    leadId: "",
    companyName: "",
    amountMonthly: "",
    amountAnnual: "",
    stage: "new",
    probability: 20,
  });

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "leads"), (snap) => {
      setLeads(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return unsub;
  }, []);

  const update = (key: string, value: any) => {
    setForm((p) => ({ ...p, [key]: value }));
  };

  const submit = async () => {
    const res = await createDeal({
      ...form,
      amountMonthly: Number(form.amountMonthly),
      amountAnnual: Number(form.amountMonthly) * 12,
    });
    router.push(`/sales/deals/${res.id}`);
  };

  return (
    <Card className="max-w-xl mx-auto">
      <CardHeader>
        <CardTitle>New Deal</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <Select onValueChange={(v) => update("leadId", v)}>
          <SelectTrigger>
            <SelectValue placeholder="Link to Lead" />
          </SelectTrigger>
          <SelectContent>
            {leads.map((l) => (
              <SelectItem key={l.id} value={l.id}>
                {l.name} — {l.companyName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input placeholder="Company Name" onChange={(e) => update("companyName", e.target.value)} />

        <Input
          placeholder="Monthly MRR"
          type="number"
          onChange={(e) => update("amountMonthly", e.target.value)}
        />

        <Button className="w-full" onClick={submit}>
          Create Deal
        </Button>
      </CardContent>
    </Card>
  );
}
