"use client";

import { ProposalBuilder } from "@/components/sales/ProposalBuilder";

export default function ProposalsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">Proposal Builder</h1>
      <ProposalBuilder />
    </div>
  );
}
