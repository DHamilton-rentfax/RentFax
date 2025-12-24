"use client";

import { useState } from "react";
import { createLead } from "@/actions/sales/leads";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function NewLeadPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    companyName: "",
    vertical: "",
    source: "manual",
  });

  const update = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const submit = async () => {
    const res = await createLead(form);
    router.push(`/sales/leads/${res.id}`);
  };

  return (
    <Card className="max-w-xl mx-auto">
      <CardHeader>
        <CardTitle>New Lead</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <Input placeholder="Full Name" onChange={(e) => update("name", e.target.value)} />
        <Input placeholder="Email" onChange={(e) => update("email", e.target.value)} />
        <Input placeholder="Phone" onChange={(e) => update("phone", e.target.value)} />
        <Input placeholder="Company Name" onChange={(e) => update("companyName", e.target.value)} />

        <Select onValueChange={(v) => update("vertical", v)}>
          <SelectTrigger>
            <SelectValue placeholder="Vertical" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="property">Property</SelectItem>
            <SelectItem value="car">Car Rental</SelectItem>
            <SelectItem value="equipment">Equipment Rental</SelectItem>
            <SelectItem value="travel">Travel / Airbnb</SelectItem>
          </SelectContent>
        </Select>

        <Button className="w-full" onClick={submit}>Create Lead</Button>
      </CardContent>
    </Card>
  );
}
