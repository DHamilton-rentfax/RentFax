"use client";

import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';

import { db } from '@/firebase/client';

import { useAuth } from './use-auth';

export function usePlan() {
  const { user } = useAuth();
  const [plan, setPlan] = useState<string | null>(null);
  const [credits, setCredits] = useState<number | null>(null);

  useEffect(() => {
    if (user?.uid) {
      // Set plan from claims
      const userPlan = (user as any).claims?.plan || 'free';
      setPlan(userPlan);

      // Listen for credits changes
      const creditsDocRef = doc(db, 'credits', user.uid);
      const unsubscribe = onSnapshot(creditsDocRef, (doc) => {
        if (doc.exists()) {
          setCredits(doc.data().remainingCredits);
        } else {
          setCredits(0);
        }
      });

      return () => unsubscribe();
    } else {
      setPlan('free');
      setCredits(0);
    }
  }, [user]);

  return { plan, credits };
}
