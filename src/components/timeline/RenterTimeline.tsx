"use client";

import { EVENT_META } from "@/lib/timeline/eventTypes";
import {
  AlertTriangle,
  CheckCircle,
  ClipboardCheck,
  DollarSign,
  Flame,
  Gavel,
  Info,
  MessageCircle,
  ShieldCheck,
  ShieldX,
  Snowflake,
  Unlock,
  UserCheck,
  XCircle,
} from "lucide-react";

const ICONS: any = {
  AlertTriangle,
  CheckCircle,
  ClipboardCheck,
  DollarSign,
  Flame,
  Gavel,
  Info,
  MessageCircle,
  ShieldCheck,
  ShieldX,
  Snowflake,
  Unlock,
  UserCheck,
  XCircle,
};

export default function RenterTimeline({ timeline }: { timeline: any[] }) {
  return (
    <div className="space-y-6">
      {timeline.map((event) => {
        const meta = EVENT_META[event.type];
        const Icon = ICONS[meta.icon];

        return (
          <div
            key={event.id}
            className="flex gap-4 items-start border-b pb-4 last:border-none"
          >
            <div
              className={`h-10 w-10 rounded-full flex items-center justify-center text-white`}
              style={{ backgroundColor: meta.color }}
            >
              <Icon className="h-5 w-5" />
            </div>

            <div className="flex-1">
              <p className="font-semibold">{meta.label}</p>
              {event.description && (
                <p className="text-sm text-gray-600">{event.description}</p>
              )}
              <p className="text-xs text-gray-400 mt-1">
                {new Date(event.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
