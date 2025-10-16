
"use server";

import { cookies } from "next/headers";
import { authAdmin, adminDB } from "@/firebase/server";
import { redirect } from "next/navigation";
import { getUserFromSessionCookie } from "./getUserFromSessionCookie";

export async function requireAdminOrSuperAdmin() {
  const user = await getUserFromSessionCookie();

  if (!user) {
    redirect("/login");
  }

  const userRef = adminDB.collection("users").doc(user.uid);
  const userSnap = await userRef.get();

  const role = userSnap.get("role");

  if (role === "SUPER_ADMIN" || role === "ADMIN") {
    return {
      user: {
        ...user,
        role,
      },
    };
  }

  redirect("/unauthorized"); // or fallback to '/dashboard'
}
