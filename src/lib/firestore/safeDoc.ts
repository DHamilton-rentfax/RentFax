"use client";

import { doc } from "firebase/firestore";
import { db } from "@/firebase/client";

export function safeDoc(path: string) {
  if (!path || typeof path !== "string" || path.trim() === "") {
    throw new Error(`Invalid Firestore document path: "${path}"`);
  }
  return doc(db, path);
}