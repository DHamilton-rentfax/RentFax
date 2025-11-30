// src/hooks/useDemoData.ts
"use client";

import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  query,
  where,
  limit,
  getFirestore,
} from "firebase/firestore";

import { app } from "@/firebase/client"; // your firebase client export

const db = getFirestore(app);

export function useDemoData() {
  const [stats, setStats] = useState({
    totalRenters: 0,
    reports: 0,
    fraudAlerts: 0,
    disputes: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const rentersQ = query(collection(db, "renters"), where("demo", "==", true));
    const reportsQ = query(collection(db, "reports"), where("demo", "==", true));
    const fraudQ = query(collection(db, "fraudSignals"), where("demo", "==", true));
    const disputesQ = query(collection(db, "disputes"), where("demo", "==", true), limit(20));

    const unsubscribers = [
      onSnapshot(rentersQ, (snap) =>
        setStats((s) => ({ ...s, totalRenters: snap.size }))
      ),
      onSnapshot(reportsQ, (snap) =>
        setStats((s) => ({ ...s, reports: snap.size }))
      ),
      onSnapshot(fraudQ, (snap) =>
        setStats((s) => ({ ...s, fraudAlerts: snap.size }))
      ),
      onSnapshot(disputesQ, (snap) =>
        setStats((s) => ({ ...s, disputes: snap.size, loading: false }))
      ),
    ];

    setLoading(false);
    return () => unsubscribers.forEach((u) => u());
  }, []);

  return { stats, loading };
}
