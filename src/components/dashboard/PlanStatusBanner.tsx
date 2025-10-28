"use client";

import { usePlan } from "@/hooks/usePlan";
import { Button } from "@/components/ui/button";
import { Crown } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PlanStatusBanner() {
  const { plan, credits } = usePlan();
  const router = useRouter();

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 p-4 rounded-xl mb-6 flex items-center justify-between shadow-sm">
      <div>
        <h3 className="text-sm text-gray-700">
          <Crown className="inline h-4 w-4 text-yellow-500 mr-2" />
          Current Plan:{" "}
          <span className="font-semibold capitalize text-[#1A2540]">
            {plan || "Loading..."}
          </span>
        </h3>
        <p className="text-xs text-gray-500">
          {credits !== null
            ? `${credits} credits remaining`
            : "Fetching credits..."}
        </p>
      </div>
      <Button
        size="sm"
        className="bg-[#1A2540] text-white hover:bg-[#2a3660]"
        onClick={() => router.push("/billing")}
      >
        Upgrade Plan
      </Button>
    </div>
  );
}
