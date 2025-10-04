"use client";

import { db } from "@/firebase/client";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";

export function useAdminSettings() {
  const { user } = useAuth();
  const [mute, setMute] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    };
    const ref = doc(db, "settings", user.uid);
    getDoc(ref).then((snap) => {
      if (snap.exists()) {
        setMute(snap.data().muteAlerts || false);
      }
      setLoading(false);
    });
  }, [user]);

  async function toggleMute() {
    if (!user) return;
    const ref = doc(db, "settings", user.uid);
    const newMute = !mute;
    // Use setDoc with merge: true to create the document if it doesn't exist
    await setDoc(ref, { muteAlerts: newMute }, { merge: true });
    setMute(newMute);
  }

  return { mute, toggleMute, loading };
}
