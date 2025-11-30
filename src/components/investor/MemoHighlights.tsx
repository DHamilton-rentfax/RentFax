'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function MemoHighlights() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Investor Memorandum Highlights</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-semibold text-lg">The Opportunity</h3>
          <p className="text-muted-foreground mt-1">
            RentFAX is positioned to capture a significant share of the $400B+ global rental market by creating a unified, AI-powered trust layer. We address the $6.8B annual rental fraud problem with a scalable SaaS and micro-transaction model.
          </p>
        </div>
        <div>
          <h3 className="font-semibold text-lg">Business Model</h3>
          <p className="text-muted-foreground mt-1">
            Our revenue is generated through a hybrid model: B2B SaaS subscriptions for property managers and enterprise clients, plus pay-per-report micro-payments for individual landlords and renters. This dual approach ensures a broad market reach and diversified income streams.
          </p>
        </div>
        <div>
          <h3 className="font-semibold text-lg">Financials & Ask</h3>
          <p className="text-muted-foreground mt-1">
            We are raising a $2M seed round to fund product development, expand our team, and accelerate customer acquisition. This will provide an 18-month runway to achieve our key milestones, including reaching 10,000 verified renter profiles and securing 500 B2B clients.
          </p>
        </div>
        <Button>Download Full Memorandum (PDF)</Button>
      </CardContent>
    </Card>
  );
}
