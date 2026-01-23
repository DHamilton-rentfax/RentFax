"use server";

import { adminDb } from "@/firebase/server";

export interface Incident {
  id: string;
  renterId: string;
  type: string;
  status: string;
  description: string;
  createdAt: string;
  evidence?: string[];
}

export const getIncidentById = async (id: string): Promise<Incident | null> => {
  try {
    const incidentDoc = await adminDb.collection("incidents").doc(id).get();

    if (!incidentDoc.exists) {
      return null;
    }

    const incidentData = incidentDoc.data()!;

    return {
      id: incidentDoc.id,
      renterId: incidentData.renterId,
      type: incidentData.type,
      status: incidentData.status,
      description: incidentData.description,
      createdAt: incidentData.createdAt,
      evidence: incidentData.evidence || [],
    } as Incident;
  } catch (error) {
    console.error("Error fetching incident by ID:", error);
    return null;
  }
};
