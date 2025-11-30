"use client";
import { doc, getDoc } from "firebase/firestore";

import { db } from "@/firebase/client";

export async function getReportTemplate(rentalType: string) {
  const ref = doc(db, "reportTemplates", rentalType);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : null;
}
