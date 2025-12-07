"use client";

import {
  CheckCircle2,
  AlertTriangle,
  Info,
  Clock,
} from "lucide-react";
import type { RenterTimelineEvent } from "@/types/timeline";
import { cn } from "@/lib/utils";

type Props = {
  events: RenterTimelineEvent[];
};

function severityIcon(severity: RenterTimelineEvent["severity"]) {
  switch (severity) {
    case "POSITIVE":
      return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
    case "NEGATIVE":
      return <AlertTriangle className="w-4 h-4 text-red-500" />;
    default:
      return <Info className="w-4 h-4 text-slate-500" />;
  }
}

function severityBadgeClass(severity: RenterTimelineEvent["severity"]) {
  return cn(
    "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
    severity === "POSITIVE" &&
      "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100",
    severity === "NEGATIVE" &&
      "bg-red-50 text-red-700 ring-1 ring-red-100",
    severity === "NEUTRAL" &&
      "bg-slate-50 text-slate-700 ring-1 ring-slate-100"
  );
}

export default function RenterTimeline({ events }: Props) {
  if (!events || events.length === 0) {
    return (
      <div className="border rounded-xl p-6 bg-muted/40">
        <p className="text-sm text-muted-foreground">
          No timeline events yet. When incidents, disputes, or verifications
          are recorded, they will appear here in chronological order.
        </p>
      </div>
    );
  }

  const positives = events.filter((e) => e.severity === "POSITIVE").length;
  const negatives = events.filter((e) => e.severity === "NEGATIVE").length;

  return (
    <div className="space-y-6">
      {/* Summary row */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="w-4 h-4" />
          <span>{events.length} total events</span>
        </div>
        <div className="flex gap-3 text-xs">
          <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
            +{positives} positive
          </span>
          <span className="px-2 py-0.5 rounded-full bg-red-50 text-red-700">
            {negatives} negative
          </span>
        </div>
      </div>

      {/* Vertical timeline */}
      <ol className="relative border-l border-slate-200 space-y-4 pl-4">
        {events.map((event) => (
          <li key={event.id} className="ml-2">
            <div className="absolute -left-[9px] mt-1 bg-white rounded-full">
              {severityIcon(event.severity)}
            </div>

            <div className="flex flex-col gap-1 pl-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-medium">{event.label}</p>
                <span className={severityBadgeClass(event.severity)}>
                  {event.type.replace(/_/g, " ").toLowerCase()}
                </span>
              </div>

              {event.description && (
                <p className="text-xs text-muted-foreground">
                  {event.description}
                </p>
              )}

              <p className="text-[11px] text-slate-400">
                {new Date(event.createdAt).toLocaleString()}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
