"use client";
import { useEffect } from "react";

import { auth } from "@/firebase/client";

import { logEvent } from "./logEvent";

export function useAppAnalytics(page: string) {
  useEffect(() => {
    const user = auth.currentUser;
    logEvent("page_view", { page, uid: user?.uid || "anon" });
  }, [page]);
}
