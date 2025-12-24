"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export default function OnboardingCompletePage() {
  const router = useRouter();
  const { user } = useAuth();

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!user) return;

    async function activate() {
      try {
        const token = await user.getIdToken();

        const res = await fetch("/api/onboarding/complete", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const json = await res.json();
        if (!res.ok) throw new Error(json.error);

        setStatus("success");

        setTimeout(() => {
          router.push("/dashboard");
        }, 1500);
      } catch (err: any) {
        setMessage(err.message || "Failed to complete onboarding.");
        setStatus("error");
      }
    }

    activate();
  }, [user, router]);

  return (
    <div className="max-w-xl mx-auto py-20 text-center space-y-6">

      {status === "loading" && (
        <>
          <Loader2 className="h-10 w-10 mx-auto animate-spin text-gray-700" />
          <h1 className="text-2xl font-semibold">Finalizing your account…</h1>
          <p className="text-gray-600">Setting up your dashboard and permissions.</p>
        </>
      )}

      {status === "success" && (
        <>
          <CheckCircle className="h-12 w-12 mx-auto text-green-600" />
          <h1 className="text-2xl font-semibold">You\'re all set!</h1>
          <p className="text-gray-600">
            Redirecting you to your dashboard…
          </p>
        </>
      )}

      {status === "error" && (
        <div className="text-red-600 text-sm">
          <p className="font-medium">Something went wrong</p>
          <p>{message}</p>

          <button
            onClick={() => router.push("/onboarding/preferences")}
            className="mt-4 underline text-gray-700"
          >
            Back to previous step
          </button>
        </div>
      )}
    </div>
  );
}
