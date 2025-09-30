
'use server';

import { adminDB } from '@/firebase/server';
import { FieldValue } from 'firebase-admin/firestore';
import { z } from 'zod';
import { sendIncidentAlertEmail } from '@/lib/emails/sendIncidentAlert';

// Zod schema for input validation
const incidentSchema = z.object({
  renterId: z.string(),
  type: z.string(),
  description: z.string().min(1, 'Description is required'), // Added validation
  evidence: z.array(z.string()).optional(),
});

export const createIncident = async (input: {
    renterId: string;
    type: string;
    description: string;
    evidence?: string[];
}) => {
    try {
        const validation = incidentSchema.safeParse(input);
        if (!validation.success) {
            // Map Zod errors to a user-friendly message
            const errorMessage = validation.error.issues.map(issue => issue.message).join(', ');
            return { success: false, error: errorMessage || 'Invalid input' };
        }

        const { renterId, type, description, evidence } = validation.data;

        const renterRef = adminDB.collection('renters').doc(renterId);
        const renterDoc = await renterRef.get();

        if (!renterDoc.exists) {
            return { success: false, error: 'Renter not found' };
        }

        const newIncidentRef = renterRef.collection('incidents').doc();
        
        const newIncident = {
            id: newIncidentRef.id,
            type,
            description,
            evidence: evidence || [],
            status: 'OPEN',
            createdAt: FieldValue.serverTimestamp(),
        };

        await newIncidentRef.set(newIncident);

        // Send email notification
        const renterEmail = renterDoc.data()?.email;
        if (renterEmail) {
            await sendIncidentAlertEmail({
                email: renterEmail,
                renterId,
                incidentId: newIncidentRef.id,
                type,
                description,
            });
        }

        return { success: true, data: { ...newIncident, id: newIncidentRef.id } };
    } catch (error) {
        console.error('Error creating incident:', error);
        return { success: false, error: 'Failed to create incident' };
    }
};
