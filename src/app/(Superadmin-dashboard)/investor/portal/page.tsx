'use client';

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/firebase/client";

import PitchDeckViewer from "@/components/investor/PitchDeckViewer";
import FounderStory from "@/components/investor/FounderStory";
import MemoHighlights from "@/components/investor/MemoHighlights";
import { Loader2 } from "lucide-react";

export default function InvestorPortalPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!email) {
      router.push("/investors");
      return;
    }

    const verifyInvestor = async () => {
      try {
        const q = query(collection(db, "investor_leads"), where("email", "==", email));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          setIsVerified(true);
        } else {
          router.push("/investors");
        }
      } catch (error) {
        console.error("Verification failed:", error);
        router.push("/investors");
      } finally {
        setLoading(false);
      }
    };

    verifyInvestor();
  }, [email, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-lg">Verifying access...</p>
      </div>
    );
  }

  if (!isVerified) {
    // This fallback will be shown briefly before the redirect happens.
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-red-500">Access Denied. Redirecting...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-16">
      <div className="container mx-auto px-4 space-y-12">
        <header className="text-center">
          <h1 className="text-4xl font-bold">Investor Portal</h1>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            Welcome. Here you can find our pitch deck, founder story, and investment memorandum.
          </p>
        </header>

        <main className="max-w-4xl mx-auto space-y-8">
          <PitchDeckViewer />
          <FounderStory />
          <MemoHighlights />
        </main>
      </div>
    </div>
  );
}