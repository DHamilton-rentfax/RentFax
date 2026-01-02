"use server";

import { db } from "@/firebase/server";
import { getAuthSession } from "@/lib/auth/getServerSession";
import { collection, getCountFromServer, where, query } from "firebase/firestore";

export async function getDashboardData() {
  const session = await getAuthSession();

  if (!session?.uid) {
    return {
      credits: 0,
      recentSearchCount: 0,
      incidentCount: 0,
      verificationCount: 0
    };
  }

  const userId = session.uid;

  // Count recent searches
  const searchesQuery = query(
    collection(db, "searchLogs"),
    where("userId", "==", userId)
  );
  const searchCountSnap = await getCountFromServer(searchesQuery);

  // Count incidents
  const incidentsQuery = query(
    collection(db, "incidents"),
    where("createdBy", "==", userId)
  );
  const incidentSnap = await getCountFromServer(incidentsQuery);

  // Count verification requests
  const verificationQuery = query(
    collection(db, "verificationRequests"),
    where("requestedBy", "==", userId)
  );
  const verificationSnap = await getCountFromServer(verificationQuery);

  // Pull credits from user doc
  const userDoc = await db.collection("users").doc(userId).get();
  const credits = userDoc.exists ? userDoc.data()?.credits ?? 0 : 0;

  return {
    credits,
    recentSearchCount: searchCountSnap.data().count,
    incidentCount: incidentSnap.data().count,
    verificationCount: verificationSnap.data().count
  };
} 