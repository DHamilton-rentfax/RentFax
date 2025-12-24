import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "@/firebase/client";

type CompanyType =
  | "individual"
  | "property_management"
  | "brokerage"
  | "other";

export async function persistIdentity({
  uid,
  fullName,
  email,
  companyName,
  companyType,
}: {
  uid: string;
  fullName: string;
  email: string;
  companyName: string;
  companyType: CompanyType;
}) {
  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);

  // Idempotent: do nothing if user already exists
  if (userSnap.exists()) return;

  const orgRef = doc(db, "orgs", uid); // 1 org per owner initially

  await setDoc(orgRef, {
    name: companyName,
    type: companyType,
    ownerUid: uid,
    trustTier: "unverified",
    createdAt: serverTimestamp(),
  });

  await setDoc(userRef, {
    uid,
    fullName,
    email,
    orgId: uid,
    role: "OWNER",
    createdAt: serverTimestamp(),
  });
}
