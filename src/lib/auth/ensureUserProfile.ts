import { adminDb } from "@/firebase/server";
import { FieldValue } from "firebase-admin/firestore";

export async function ensureUserProfile({
  uid,
  email,
  role,
  companyId,
}: {
  uid: string;
  email: string | null;
  role: string | null;
  companyId: string | null;
}) {
  const ref = adminDb.collection("users").doc(uid);
  const snap = await ref.get();

  if (snap.exists) return;

  await ref.set({
    uid,
    email,
    role: role ?? "USER",
    companyId: companyId ?? null,
    membership: {
      status: "active",
      createdAt: FieldValue.serverTimestamp(),
    },
    createdAt: FieldValue.serverTimestamp(),
  });
}
