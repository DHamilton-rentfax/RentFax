"use server";

import { dbAdmin } from "@/lib/firebase-admin";
import { Incident } from "@/types/incident";
import { DocumentData } from "firebase-admin/firestore";

export async function getAllIncidentsForRenter(renterId: string) {
  try {
    const incidentsRef = dbAdmin.collection("incidents");
    const snapshot = await incidentsRef.where("renterId", "==", renterId).get();

    if (snapshot.empty) {
      return { incidents: [] };
    }

    const incidents = snapshot.docs.map((doc: DocumentData) => {
      const data = doc.data();
      return {
        ...data,
        id: doc.id,
        createdAt: data.createdAt,
      } as Incident;
    });

    return { incidents };
  } catch (error) {
    console.error("Error getting incidents for renter:", error);
    return { error: "Could not fetch incidents for renter" };
  }
}
