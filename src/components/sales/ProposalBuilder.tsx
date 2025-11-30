"use client";

import { useState } from "react";
import { ProposalSummary } from "./ProposalSummary";
import { ProposalPreview } from "./ProposalPreview";
import { generateProposalPDF, sendProposalEmail } from "@/actions/sales/proposals";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

export function ProposalBuilder() {
  const [company, setCompany] = useState("");
  const [plan, setPlan] = useState("");
  const [seats, setSeats] = useState(1);
  const [addons, setAddons] = useState({
    aiRisk: false,
    prioritySupport: false,
    apiAccess: false,
  });

  const calculate = () => {
    let base = 0;

    if (plan === "starter") base = 999;   // $9.99 -> converted to pennies
    if (plan === "pro") base = 2900;     // $29
    if (plan === "enterprise") base = 0; // custom

    let add = 0;
    if (addons.aiRisk) add += 1500; // $15
    if (addons.prioritySupport) add += 1900; // $19
    if (addons.apiAccess) add += 2500; // $25

    return {
      monthly: (base + add) * seats,
      annual: (base + add) * seats * 12,
    };
  };

  const totals = calculate();

  const generatePDF = async () => {
    await generateProposalPDF({
      company,
      plan,
      seats,
      addons,
      totals,
    });
  };

  const sendEmail = async () => {
    await sendProposalEmail({
      company,
      plan,
      seats,
      addons,
      totals,
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

      {/* Builder Form */}
      <Card>
        <CardHeader>
          <CardTitle>Configure Proposal</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">

          <Input placeholder="Company Name" onChange={(e) => setCompany(e.target.value)} />

          <Select onValueChange={setPlan}>
            <SelectTrigger>
              <SelectValue placeholder="Select Plan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="starter">Starter ($9.99/mo)</SelectItem>
              <SelectItem value="pro">Pro ($29/mo)</SelectItem>
              <SelectItem value="enterprise">Enterprise (Contact Sales)</SelectItem>
            </SelectContent>
          </Select>

          <Input
            type="number"
            placeholder="Seats"
            defaultValue={1}
            onChange={(e) => setSeats(Number(e.target.value))}
          />

          {/* Add-ons */}
          <div className="space-y-3">
            <label className="flex justify-between items-center">
              <span>AI Risk Engine (+$15/mo)</span>
              <Switch onCheckedChange={(v) => setAddons((p) => ({ ...p, aiRisk: v }))} />
            </label>

            <label className="flex justify-between items-center">
              <span>Priority Support (+$19/mo)</span>
              <Switch onCheckedChange={(v) => setAddons((p) => ({ ...p, prioritySupport: v }))} />
            </label>

            <label className="flex justify-between items-center">
              <span>API Access (+$25/mo)</span>
              <Switch onCheckedChange={(v) => setAddons((p) => ({ ...p, apiAccess: v }))} />
            </label>
          </div>

          <ProposalSummary totals={totals} />

          <Button className="w-full mt-4" onClick={generatePDF}>Generate PDF</Button>
          <Button className="w-full" variant="outline" onClick={sendEmail}>
            Send to Client
          </Button>
        </CardContent>
      </Card>

      {/* Preview Panel */}
      <ProposalPreview
        company={company}
        plan={plan}
        seats={seats}
        addons={addons}
        totals={totals}
      />
    </div>
  );
}