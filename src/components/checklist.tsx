"use client";
import {
  CheckIcon,
  AlertTriangle,
  HelpCircle,
  ArrowUpRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export type Check = {
  id: string;
  label: string;
  pass: boolean | null; // null = pending
  hint?: string;
  link?: string;
};

const StatusIcon = ({ status }: { status: boolean | null }) => {
  if (status === true) {
    return (
      <CheckIcon className="h-5 w-5 text-white bg-green-500 rounded-full p-0.5" />
    );
  }
  if (status === false) {
    return (
      <AlertTriangle className="h-5 w-5 text-white bg-red-500 rounded-full p-0.5" />
    );
  }
  return (
    <HelpCircle className="h-5 w-5 text-white bg-gray-400 rounded-full p-0.5" />
  );
};

export default function Checklist({ items }: { items: Check[] }) {
  return (
    <Card>
      <CardContent className="p-0">
        <div className="divide-y">
          {items.map((c) => (
            <div key={c.id} className="p-4 flex items-start gap-4">
              <div className="mt-1">
                <StatusIcon status={c.pass} />
              </div>
              <div className="flex-1 space-y-1">
                <p className="font-medium">{c.label}</p>
                {c.hint && (
                  <p className="text-sm text-muted-foreground">{c.hint}</p>
                )}
              </div>
              {c.link && (
                <Link
                  href={c.link}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-primary hover:underline flex items-center gap-1"
                >
                  Open <ArrowUpRight className="h-4 w-4" />
                </Link>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
