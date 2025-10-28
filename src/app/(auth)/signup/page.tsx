// ===========================================
// RentFAX | Signup Page
// Location: src/app/(auth)/signup/page.tsx
// ===========================================
"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { getDoc, doc } from "firebase/firestore";
import { db } from "@/firebase/client";

// A wrapper component to suspend rendering until search params are available
function SignupPageContent() {
  const searchParams = useSearchParams();
  const intentId = searchParams.get("intentId");
  const type = searchParams.get("type");

  const [intentData, setIntentData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!intentId) {
      setLoading(false);
      return;
    }

    const fetchIntent = async () => {
      try {
        console.log(`Fetching intent: ${intentId}`);
        const intentRef = doc(db, "reportIntents", intentId);
        const docSnap = await getDoc(intentRef);

        if (docSnap.exists()) {
          console.log("Intent data found:", docSnap.data());
          setIntentData(docSnap.data());
        } else {
          console.log("No such intent document!");
        }
      } catch (error) {
        console.error("Error fetching intent:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchIntent();
  }, [intentId]);

  return (
    <div>
      <h1>Create Your Account</h1>
      {loading ? (
        <p>Loading...</p>
      ) : intentData ? (
        <div>
          <h2>Your Search:</h2>
          <p>Name: {intentData.name}</p>
          <p>Email: {intentData.email}</p>
          <p>Report Type: {type === "full" ? "Full Report" : "Basic Lookup"}</p>
          {/* Add signup form here, pre-filled with intentData */}
        </div>
      ) : (
        <div>
           {/* Add standard signup form here for users without an intentId */}
           <p>Sign up for a free RentFAX account.</p>
        </div>
      )}
    </div>
  );
}


export default function SignupPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SignupPageContent />
        </Suspense>
    )
}
