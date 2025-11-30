"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { updateLead } from "@/actions/sales/leads";

export function LeadNotes({ leadId }: { leadId: string }) {
  const [value, setValue] = useState("");

  const save = async () => {
    await updateLead(leadId, { notes: value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Notes</CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        <Textarea 
          rows={6}
          placeholder="Add notes..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <Button
          onClick={save}
          className="px-4 py-2 text-sm"
        >
          Save Notes
        </Button>
      </CardContent>
    </Card>
  );
}
