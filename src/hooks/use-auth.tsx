"use client";

import { useState, useEffect } from "react";
import { auth, db } from "@/firebase/client";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const ref = doc(db, "users", firebaseUser.uid);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          const data = snap.data();
          setUser({ ...firebaseUser, ...data });
        } else {
          // Default to English for new users
          await setDoc(ref, {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            locale: "en",
            createdAt: new Date().toISOString(),
          });
          setUser(firebaseUser);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { user, loading };
}

// Utility to update locale in Firestore
export async function updateUserLocale(uid: string, locale: string) {
  const ref = doc(db, "users", uid);
  await updateDoc(ref, { locale });
}
