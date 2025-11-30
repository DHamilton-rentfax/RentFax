"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function ProposalPreview({ company, plan, seats, addons, totals }: any) {
  return (
    <Card className="border shadow-sm">
      <CardHeader>
        <CardTitle>Proposal Preview</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">

        <div>
          <h3 className="font-semibold text-lg">{company || "Company Name"}</h3>
          <p className="text-sm text-muted-foreground">
            Plan: {plan || "Not selected"}  
          </p>
        </div>

        <div>
          <h4 className="font-semibold">Add-ons</h4>
          <ul className="text-sm text-muted-foreground">
            {addons.aiRisk && <li>AI Risk Engine</li>}
            {addons.prioritySupport && <li>Priority Support</li>}
            {addons.apiAccess && <li>API Access</li>}
            {!addons.aiRisk && !addons.prioritySupport && !addons.apiAccess && (
              <li>No add-ons selected</li>
            )}
          </ul>
        </div>

        <div>
          <h4 className="font-semibold">Seats: {seats}</h4>
        </div>

        <div>
          <h4 className="font-semibold">Totals</h4>
          <p className="text-sm">
            Monthly: ${(totals.monthly / 100).toFixed(2)}  
            <br />
            Annual: ${(totals.annual / 100).toFixed(2)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
