"use client";

import { ReactNode, useState } from "react";
import { ChevronDown, ChevronRight, CheckCircle, AlertTriangle } from "lucide-react";

export type SectionStatus = "empty" | "completed" | "attention";

interface Props {
  id: string;
  title: string;
  description?: string;
  status: SectionStatus;
  reportedIssues?: string[];
  defaultOpen?: boolean;
  children: ReactNode;
}

export default function ExpandableSection({
  title,
  description,
  status,
  reportedIssues,
  defaultOpen = false,
  children,
}: Props) {
  const [open, setOpen] = useState(defaultOpen);

  const statusIcon =
    status === "completed" ? (
      <CheckCircle className="h-4 w-4 text-green-600" />
    ) : status === "attention" ? (
      <AlertTriangle className="h-4 w-4 text-yellow-600" />
    ) : null;

  return (
    <div className="border rounded-lg overflow-hidden bg-white">
      {/* HEADER */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50"
      >
        <div className="flex items-center gap-3">
          {open ? (
            <ChevronDown className="h-4 w-4 text-gray-500" />
          ) : (
            <ChevronRight className="h-4 w-4 text-gray-500" />
          )}

          <div className="text-left">
            <p className="font-medium">{title}</p>
            {!open &&
            status === "attention" &&
            reportedIssues &&
            reportedIssues.length > 0 ? (
              <p className="text-xs text-yellow-700 font-medium">
                {reportedIssues.join(", ")}
              </p>
            ) : (
              description && (
                <p className="text-xs text-gray-500">{description}</p>
              )
            )}
          </div>
        </div>

        <div>{statusIcon}</div>
      </button>

      {/* BODY */}
      {open && <div className="px-4 py-4 border-t">{children}</div>}
    </div>
  );
}
