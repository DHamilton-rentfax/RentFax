"use client";

import { useEffect, useState } from "react";
import { db } from "@/firebase/client";
import { collection, onSnapshot } from "firebase/firestore";
import { scheduleDemo } from "@/actions/sales/demos";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export function DemoScheduler() {
  const [leads, setLeads] = useState<any[]>([]);
  const [deals, setDeals] = useState<any[]>([]);

  const [form, setForm] = useState({
    leadId: "",
    dealId: "",
    date: "",
    time: "",
    duration: "30",
  });

  const update = (key: string, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  // Fetch leads and deals
  useEffect(() => {
    const unsubLeads = onSnapshot(collection(db, "leads"), (snap) =>
      setLeads(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    );
    const unsubDeals = onSnapshot(collection(db, "deals"), (snap) =>
      setDeals(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    );
    return () => { unsubLeads(); unsubDeals(); };
  }, []);

  const submit = async () => {
    const dateTime = new Date(`${form.date}T${form.time}:00`);

    await scheduleDemo({
      leadId: form.leadId || null,
      dealId: form.dealId || null,
      dateTime,
      duration: Number(form.duration),
    });

    alert("Demo Scheduled!");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Demo Scheduler</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">

        {/* Link to Lead */}
        <Select onValueChange={(v) => update("leadId", v)}>
          <SelectTrigger>
            <SelectValue placeholder="Attach to Lead (optional)" />
          </SelectTrigger>
          <SelectContent>
            {leads.map((l) => (
              <SelectItem key={l.id} value={l.id}>
                {l.name} — {l.companyName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Link to Deal */}
        <Select onValueChange={(v) => update("dealId", v)}>
          <SelectTrigger>
            <SelectValue placeholder="Attach to Deal (optional)" />
          </SelectTrigger>
          <SelectContent>
            {deals.map((d) => (
              <SelectItem key={d.id} value={d.id}>
                {d.companyName} — ${d.amountMonthly}/mo
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Date */}
        <Input type="date" onChange={(e) => update("date", e.target.value)} />

        {/* Time */}
        <Input type="time" onChange={(e) => update("time", e.target.value)} />

        {/* Duration */}
        <Select onValueChange={(v) => update("duration", v)}>
          <SelectTrigger>
            <SelectValue placeholder="Duration" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="30">30 Minutes</SelectItem>
            <SelectItem value="45">45 Minutes</SelectItem>
            <SelectItem value="60">60 Minutes</SelectItem>
          </SelectContent>
        </Select>

        <Button className="w-full mt-4" onClick={submit}>
          Schedule Demo
        </Button>
      </CardContent>
    </Card>
  );
}
