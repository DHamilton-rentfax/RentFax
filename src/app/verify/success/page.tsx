'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function VerifySuccessPage() {
  const router = useRouter();

  useEffect(() => {
    const t = setTimeout(() => {
      router.push("/dashboard");
    }, 2500);

    return () => clearTimeout(t);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center text-center">
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">Verification complete</h1>
        <p className="text-gray-600">
          Your RentFAX report is being unlocked.
        </p>
      </div>
    </div>
  );
}
