'use client';
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/client";

export type BusinessType = "LANDLORD" | "AGENCY" | "LEGAL" | "INVESTOR" | "OTHER";

export function useBusinessContext() {
  const { user } = useAuth();
  const [businessType, setBusinessType] = useState<BusinessType>("OTHER");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) return;

    const fetchBusinessType = async () => {
      try {
        const docRef = doc(db, "users", user.uid);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          const type = snap.data().businessType || "OTHER";
          setBusinessType(type);
        }
      } catch (err) {
        console.error("Error loading business type:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBusinessType();
  }, [user]);

  return { businessType, loading };
}
