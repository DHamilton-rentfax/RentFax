'use client';
import { useEffect, useState } from "react";
import { collection, onSnapshot, query, where, orderBy } from "firebase/firestore";

import { db } from "@/firebase/client";

export function useCodeSageAudits(renterId?: string) {
  const [audits, setAudits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!renterId) return;

    const q = query(
      collection(db, "rentfaxAudits"),
      where("renterId", "==", renterId),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAudits(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [renterId]);

  return { audits, loading };
}
