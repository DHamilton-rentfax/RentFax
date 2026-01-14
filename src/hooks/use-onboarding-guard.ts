"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useRouter, usePathname } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/client";

export function useOnboardingGuard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function check() {
      if (authLoading) return;

      // If user not logged in → send to login
      if (!user) {
        router.replace("/login");
        return;
      }

      // Super Admin bypass
      if (user.role === "SUPER_ADMIN") {
        setLoading(false);
        return;
      }

      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);

      const onboardingCompleted = snap.data()?.onboardingCompleted || false;

      const isOnboardingRoute = pathname.startsWith("/onboarding");

      if (!onboardingCompleted && !isOnboardingRoute) {
        router.replace("/onboarding/start");
        return;
      }

      if (onboardingCompleted && isOnboardingRoute) {
        router.replace("/dashboard");
        return;
      }

      setLoading(false);
    }

    check();
  }, [authLoading, user, pathname, router]);

  return { loading };
}
