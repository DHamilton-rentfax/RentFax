"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function IdentityCheckoutReturn() {
  const params = useSearchParams();
  const router = useRouter();

  const status = params.get("checkout");
  const sessionId = params.get("session_id");

  useEffect(() => {
    // Give Stripe a moment, then send user back to search context
    const t = setTimeout(() => {
      router.replace(`/marketing?identity=${status || "unknown"}`);
    }, 1200);

    return () => clearTimeout(t);
  }, [status, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center space-y-4">
        <div className="text-lg font-semibold">
          {status === "success"
            ? "Identity check completed"
            : "Checkout canceled"}
        </div>

        <p className="text-sm text-gray-600">
          Redirecting you back…
        </p>
      </div>
    </div>
  );
}
