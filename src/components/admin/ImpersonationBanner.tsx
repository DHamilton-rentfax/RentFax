"use client";

import { useEffect } from "react";

type ImpersonationBannerProps = {
  orgName: string;
  expiresAt?: string; // ISO string
  onExit: () => Promise<void> | void;
};

export default function ImpersonationBanner({
  orgName,
  expiresAt,
  onExit,
}: ImpersonationBannerProps) {
  useEffect(() => {
    if (!expiresAt) return;

    const expiry = new Date(expiresAt).getTime();
    const now = Date.now();

    if (expiry <= now) {
      onExit();
      return;
    }

    const timeout = setTimeout(onExit, expiry - now);
    return () => clearTimeout(timeout);
  }, [expiresAt, onExit]);

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="fixed top-0 left-0 right-0 z-50 bg-red-600 text-white px-4 py-3 flex justify-between items-center shadow-lg"
    >
      <div className="text-sm">
        ⚠️ <strong>Impersonation Active</strong> — Acting as{" "}
        <strong>{orgName}</strong>
        <div className="text-xs opacity-90">
          All actions are logged for security and audit purposes.
        </div>
      </div>

      <button
        onClick={onExit}
        className="bg-white text-red-700 font-semibold px-3 py-1 rounded hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-white"
      >
        Exit Impersonation
      </button>
    </div>
  );
}
