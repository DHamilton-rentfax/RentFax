// ===========================================
// RentFAX | Report Success Page
// Location: src/app/report/success/page.tsx
// ===========================================
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle } from "lucide-react";

export default function ReportSuccessPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to dashboard after 5 seconds
    const timer = setTimeout(() => {
      router.push("/dashboard");
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-xl text-center">
        <CheckCircle className="h-16 w-16 mx-auto text-green-500" />
        <h1 className="text-2xl font-semibold mt-4">Payment Successful!</h1>
        <p className="text-gray-600 mt-2">
          Your report is being generated and will be available in your dashboard shortly.
        </p>
        <p className="text-sm text-gray-500 mt-4">
          You will be redirected automatically.
        </p>
        <a href="/dashboard" className="text-blue-500 hover:underline mt-2 inline-block">
          Go to Dashboard Now
        </a>
      </div>
    </div>
  );
}
