'use client';

import { X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SearchLimitModal({ data, close }: { data: any, close: any}) {
  if (!data) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md relative">
        <button
          className="absolute top-4 right-4 text-gray-500"
          onClick={close}
        >
          <X />
        </button>

        <h2 className="text-xl font-semibold">Daily Search Limit Reached</h2>
        <p className="text-gray-600 mt-2">
          Your plan (<b>{data.plan}</b>) allows {data.limit} searches per day.
        </p>

        <p className="mt-4 text-gray-700">
          Upgrade now to unlock unlimited renter searches and higher match
          accuracy.
        </p>

        <Button
          className="w-full mt-6"
          onClick={() => window.location.href = "/pricing"}
        >
          Upgrade Plan <ArrowRight className="ml-2" />
        </Button>
      </div>
    </div>
  );
}
