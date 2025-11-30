'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, CheckCircle } from 'lucide-react';

import { useToast } from "@/components/ui/use-toast";

export default function RunLookupDemoButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const handleDemoLookup = async () => {
    setIsLoading(true);

    // Simulate network delay for the demo
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsLoading(false);
    setIsSuccess(true);

    toast({
      title: "Report Created Successfully",
      description: "A new renter report has been generated with mock AI data.",
      variant: "success",
    });

    // In a real app, you might close the modal or redirect here
    // For the demo, we'll just show the success state in the button
  };

  if (isSuccess) {
    return (
      <div className="flex items-center justify-center gap-2 w-full text-center px-4 py-2 rounded-md bg-emerald-500 text-white">
        <CheckCircle size={20} />
        <span>Success! View Report</span>
      </div>
    );
  }

  return (
    <button
      onClick={handleDemoLookup}
      disabled={isLoading}
      className="w-full text-center px-4 py-2 rounded-md bg-emerald-600 text-white hover:bg-emerald-700 disabled:bg-emerald-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
    >
      {isLoading ? (
        <>
          <Loader2 size={20} className="animate-spin" />
          <span>Processing Lookup...</span>
        </>
      ) : (
        'Run Basic Lookup – $4.99'
      )}
    </button>
  );
}
