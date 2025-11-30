import { collection, query, where, orderBy, getDocs } from "firebase/firestore";

import { db, auth } from "@/firebase/client";

export async function getRenterDisputes() {
  const user = auth.currentUser;
  if (!user) return [];

  const q = query(
    collection(db, "disputes"),
    where("renterId", "==", user.uid),
    orderBy("createdAt", "desc"),
  );

  const snap = await getDocs(q);
  const disputes = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  return disputes;
}
