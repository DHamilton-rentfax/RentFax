'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';

import { useToast } from "@/components/ui/use-toast";

export default function RunLookupProductionButton({ renterData }) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleProductionLookup = async () => {
    setIsLoading(true);

    try {
      const response = await fetch('/api/checkout/basic-lookup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(renterData),
      });

      const { url, error } = await response.json();

      if (error) {
        throw new Error(error);
      }

      // Redirect to Stripe Checkout
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error("Stripe Checkout Error:", error);
      toast({
        title: "An Error Occurred",
        description: "Could not create a checkout session. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleProductionLookup}
      disabled={isLoading}
      className="w-full text-center px-4 py-2 rounded-md bg-emerald-600 text-white hover:bg-emerald-700 disabled:bg-emerald-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
    >
      {isLoading ? (
        <>
          <Loader2 size={20} className="animate-spin" />
          <span>Redirecting to payment...</span>
        </>
      ) : (
        'Run Basic Lookup – $4.99'
      )}
    </button>
  );
}
