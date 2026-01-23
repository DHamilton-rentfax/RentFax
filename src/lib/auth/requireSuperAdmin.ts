
// src/lib/auth/requireSuperAdmin.ts
"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { adminAuth, adminDb } from "@/firebase/server";

import { getUserFromSessionCookie } from "./getUserFromSessionCookie";

export async function requireSuperAdmin() {
  const user = await getUserFromSessionCookie();

  if (!user) {
    redirect("/login");
  }

  const userRef = adminDb.collection("users").doc(user.uid);
  const userSnap = await userRef.get();

  const role = userSnap.get("role");

  if (!role) {
    console.warn(`No role found for user ${user.uid}`);
    redirect("/unauthorized");
  }

  if (role === "SUPER_ADMIN") {
    return {
      user: {
        ...user,
        role,
      },
    };
  }

  redirect("/unauthorized"); // or fallback to '/dashboard'
}
