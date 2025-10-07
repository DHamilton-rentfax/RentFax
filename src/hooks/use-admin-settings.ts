// src/hooks/use-admin-settings.ts
"use client";

import { useEffect, useState } from "react";
import { db } from "@/firebase/client";
import { doc, getDoc, onSnapshot } from "firebase/firestore";

export interface AdminSettings {
  alertThreshold?: number;
  autoResolve?: boolean;
  lastUpdated?: Date;
}

export function useAdminSettings() {
  const [settings, setSettings] = useState<AdminSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ref = doc(db, "config", "admin-settings");

    // real-time updates
    const unsub = onSnapshot(ref, (snap) => {
      if (snap.exists()) {
        const data = snap.data() as AdminSettings;
        setSettings({
          ...data,
          lastUpdated: data.lastUpdated
            ? (data.lastUpdated as any).toDate?.() ?? new Date()
            : new Date(),
        });
      }
      setLoading(false);
    });

    return () => unsub();
  }, []);

  return { settings, loading };
}
