"use client";

import { useEffect, useState } from "react";
import { differenceInSeconds } from "date-fns";

type Props = {
  status: "PENDING_EVIDENCE" | "OPEN" | "CLOSED";
  pendingUntil?: string; // ISO
};

export default function EvidenceWindowBanner({
  status,
  pendingUntil,
}: Props) {
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);

  useEffect(() => {
    if (!pendingUntil) return;

    const tick = () => {
      const diff = differenceInSeconds(new Date(pendingUntil), new Date());
      setSecondsLeft(diff > 0 ? diff : 0);
    };

    tick();
    const i = setInterval(tick, 1000);
    return () => clearInterval(i);
  }, [pendingUntil]);

  if (status === "OPEN") {
    return (
      <div className="rounded-md bg-green-50 border border-green-300 p-4 text-green-900">
        ✅ Report is active. Evidence has been submitted.
      </div>
    );
  }

  if (status === "CLOSED") {
    return (
      <div className="rounded-md bg-gray-100 border border-gray-300 p-4 text-gray-700">
        ⛔ Evidence window expired. This report is closed.
      </div>
    );
  }

  if (status !== "PENDING_EVIDENCE") return null;

  return (
    <div className="rounded-md bg-yellow-50 border border-yellow-400 p-4">
      <div className="font-semibold text-yellow-900">
        ⏳ Awaiting Evidence Upload
      </div>

      <p className="text-sm mt-1 text-yellow-800">
        This report will automatically close if no evidence is uploaded before
        the deadline.
      </p>

      {secondsLeft !== null && (
        <div className="mt-2 text-sm font-mono">
          Time remaining:{" "}
          <span className="font-semibold">
            {Math.floor(secondsLeft / 60)}m {secondsLeft % 60}s
          </span>
        </div>
      )}
    </div>
  );
}
