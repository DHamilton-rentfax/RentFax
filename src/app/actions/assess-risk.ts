'use server';

import { adminDb } from '@/firebase/server';
import { updateIncident } from './update-incident';

async function getRenterHistory(renterId: string) {
    const incidentsQuery = adminDb.collection('incidents').where('renterId', '==', renterId);
    const snapshot = await incidentsQuery.get();
    return snapshot.docs.map(doc => doc.data());
}

export async function assessIncidentRisk(incidentId: string) {
  try {
    const incidentRef = adminDb.collection('incidents').doc(incidentId);
    const incidentDoc = await incidentRef.get();

    if (!incidentDoc.exists) {
      throw new Error('Incident not found');
    }

    const incident = incidentDoc.data()!;
    const renterHistory = await getRenterHistory(incident.renterId);

    let highRisk = false;
    const riskReasons: string[] = [];

    // Rule 1: High claim amount
    if (incident.amount_claimed > 5000) {
      highRisk = true;
      riskReasons.push('Claim amount exceeds $5,000');
    }

    // Rule 2: Multiple incidents in a short period (e.g., 3+ in last 90 days)
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
    const recentIncidents = renterHistory.filter(h => new Date(h.createdAt) > ninetyDaysAgo);
    if (recentIncidents.length >= 3) {
      highRisk = true;
      riskReasons.push('Renter has had 3 or more incidents in the last 90 days');
    }

    // Rule 3: History of severe incidents (e.g., 2+ with 'severe' severity)
    const severeIncidents = renterHistory.filter(h => h.severity === 'severe');
    if (severeIncidents.length >= 2) {
      highRisk = true;
      riskReasons.push('Renter has a history of severe incidents');
    }

    // Rule 4: Specific incident types are always high-risk
    const highRiskTypes = ['theft', 'major-accident'];
    if (highRiskTypes.includes(incident.type)) {
        highRisk = true;
        riskReasons.push(`Incident type (${incident.type}) is considered high-risk.`);
    }

    // Update the incident with risk assessment
    await updateIncident(incidentId, { highRisk, riskReasons }, 'system-risk-assessor');

    return { success: true, highRisk, riskReasons };

  } catch (error) {
    console.error('Error assessing incident risk:', error);
    return { success: false, error: (error as Error).message };
  }
}
