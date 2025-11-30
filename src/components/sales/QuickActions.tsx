"use client";

import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, FilePlus2, ClipboardList } from "lucide-react";

export function QuickActions() {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-sm">Quick Actions</CardTitle>
      </CardHeader>

      <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Link href="/sales/leads/new">
          <Button variant="outline" className="w-full flex gap-2">
            <PlusCircle className="h-4 w-4" /> New Lead
          </Button>
        </Link>

        <Link href="/sales/deals/new">
          <Button variant="outline" className="w-full flex gap-2">
            <FilePlus2 className="h-4 w-4" /> New Deal
          </Button>
        </Link>

        <Link href="/sales/tasks">
          <Button variant="outline" className="w-full flex gap-2">
            <ClipboardList className="h-4 w-4" /> Tasks
          </Button>
        </Link>

        <Link href="/sales/pipeline">
          <Button className="w-full flex gap-2">
            Pipeline
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}