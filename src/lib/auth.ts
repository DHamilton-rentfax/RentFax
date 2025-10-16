
"use client";
import { auth as clientAuth } from "@/firebase/client";
import { onAuthStateChanged, User, getIdToken } from "firebase/auth";
import { whoAmI as whoAmIFlow, WhoAmIOutput } from "@/app/auth/actions";

export function watchAuth(cb: (u: User | null) => void) {
  return onAuthStateChanged(clientAuth, cb);
}

export async function fetchClaims(): Promise<WhoAmIOutput> {
  if (clientAuth.currentUser) {
    await getIdToken(clientAuth.currentUser, true); // force refresh to pull latest claims
  }
  const res = await whoAmIFlow();
  return res;
}
