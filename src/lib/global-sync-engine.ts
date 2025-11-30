
import { adminDB } from "@/firebase/server";
import { FieldValue } from "firebase-admin/firestore";
import * as crypto from "crypto";

// Helper to normalize and hash an address for global matching
const hashAddress = (address: any): string => {
  const { addressLine1, city, state, zip } = address;
  const normalized = `${addressLine1}, ${city}, ${state} ${zip}`
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
  return crypto.createHash("sha256").update(normalized).digest("hex");
};

/**
 * Resolves a local renter against the global identity database.
 * It searches for existing global renters by linked ID, email, or phone.
 * If no match is found, it creates a new global renter profile.
 * @param localRenter - The local renter data from a company's collection.
 * @param localRenterId - The ID of the renter within the company's collection.
 * @param companyId - The ID of the company reporting the data.
 * @returns A Firestore snapshot of the resolved or newly created global renter.
 */
const resolveGlobalRenter = async (localRenter: any, localRenterId: string, companyId: string) => {
    // Strategy:
    // 1. Check if local renter is already linked to a global profile.
    if (localRenter.globalRenterId) {
        const globalRenterSnap = await adminDB.collection('rentersGlobal').doc(localRenter.globalRenterId).get();
        if (globalRenterSnap.exists) return globalRenterSnap;
    }

    // 2. Search for matches using emails and phone numbers.
    const searchQueries = [];
    if (localRenter.emails && localRenter.emails.length > 0) {
        searchQueries.push(adminDB.collection('rentersGlobal').where('emails', 'array-contains-any', localRenter.emails).get());
    }
    if (localRenter.phones && localRenter.phones.length > 0) {
        searchQueries.push(adminDB.collection('rentersGlobal').where('phones', 'array-contains-any', localRenter.phones).get());
    }

    for (const query of searchQueries) {
        const results = await query;
        if (!results.empty) {
            const matchedGlobalRenter = results.docs[0]; // Use first match for now
            // Link local renter to this global ID for future syncs
            await adminDB.collection('companies').doc(companyId).collection('renters').doc(localRenterId).update({
                globalRenterId: matchedGlobalRenter.id,
            });
            return matchedGlobalRenter;
        }
    }

    // 3. No match found, create a new global renter.
    const newGlobalRenterRef = adminDB.collection('rentersGlobal').doc();
    const newGlobalRenterData = {
        firstName: localRenter.firstName,
        lastName: localRenter.lastName,
        fullName: `${localRenter.firstName} ${localRenter.lastName}`,
        dob: localRenter.dob || null,
        emails: localRenter.emails || [],
        phones: localRenter.phones || [],
        last4ssn: localRenter.last4ssn || null,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
        industries: [],
        riskScore: 0,
        incidentCount: 0,
        unresolvedIncidents: 0,
        disputedCount: 0,
        linkedCompanyIds: [companyId],
        linkedRenterIds: [localRenterId],
        primaryAddressId: null,
    };
    await newGlobalRenterRef.set(newGlobalRenterData);
    
    // Link local renter to the new global ID
    await adminDB.collection('companies').doc(companyId).collection('renters').doc(localRenterId).update({
        globalRenterId: newGlobalRenterRef.id,
    });
    
    return newGlobalRenterRef.get();
};

/**
 * The core sync engine. Takes a local company incident and synchronizes it
 * across all relevant global collections.
 * @param companyId - The ID of the company reporting the incident.
 * @param incidentId - The ID of the local incident.
 */
export const syncIncidentToGlobal = async (companyId: string, incidentId: string) => {
    const batch = adminDB.batch();

    // 1. Fetch all local data
    const incidentSnap = await adminDB.collection('companies').doc(companyId).collection('incidents').doc(incidentId).get();
    if (!incidentSnap.exists) throw new Error(`Incident ${incidentId} not found for company ${companyId}`);
    const incidentData = incidentSnap.data()!;

    const renterSnap = await adminDB.collection('companies').doc(companyId).collection('renters').doc(incidentData.renterId).get();
    if (!renterSnap.exists) throw new Error(`Renter ${incidentData.renterId} not found`);
    const renterData = renterSnap.data()!;

    const companySnap = await adminDB.collection('companies').doc(companyId).get();
    const companyData = companySnap.data()!;
    const industry = companyData.industry || 'home_rental';

    // 2. Resolve Global Renter Identity
    const globalRenterSnap = await resolveGlobalRenter(renterData, renterSnap.id, companyId);
    const globalRenterId = globalRenterSnap.id;
    const globalRenterRef = globalRenterSnap.ref;

    // 3. Sync Address Data
    if (renterData.address) {
        const addressHash = hashAddress(renterData.address);
        const renterAddressRef = globalRenterRef.collection('addresses').doc(addressHash);
        const globalAddressRef = adminDB.collection('addressesGlobal').doc(addressHash);

        // Add/update address in renter's subcollection
        batch.set(renterAddressRef, {
            ...renterData.address,
            addressHash,
            lastSeen: FieldValue.serverTimestamp(),
        }, { merge: true });
        // Set as primary address if none exists
        if (!globalRenterSnap.data()?.primaryAddressId) {
            batch.update(globalRenterRef, { primaryAddressId: addressHash });
        }
        
        // Add/update address in global address collection
        batch.set(globalAddressRef, {
            normalizedAddress: `${renterData.address.addressLine1}, ${renterData.address.city}, ${renterData.address.state} ${renterData.address.zip}`.toLowerCase(),
            linkedRenterGlobalIds: FieldValue.arrayUnion(globalRenterId),
            incidentCount: FieldValue.increment(1),
            updatedAt: FieldValue.serverTimestamp(),
        }, { merge: true });
    }

    // 4. Create the Global Incident record
    const incidentGlobalRef = adminDB.collection('incidentsGlobal').doc(`${companyId}_${incidentId}`);
    batch.set(incidentGlobalRef, {
        renterGlobalId,
        companyId,
        localIncidentId: incidentId,
        industry,
        type: incidentData.type,
        description: incidentData.description,
        amount: incidentData.amount || 0,
        status: incidentData.status || 'reported',
        createdAt: incidentData.createdAt,
        updatedAt: FieldValue.serverTimestamp(),
        evidence: incidentData.evidence || [],
    });

    // 5. Create a Renter Timeline Event
    const timelineEventRef = globalRenterRef.collection('timeline').doc();
    batch.set(timelineEventRef, {
        type: "INCIDENT_REPORTED",
        title: `Incident: ${incidentData.type}`,
        description: incidentData.description,
        incidentId: incidentGlobalRef.id,
        companyId,
        createdAt: FieldValue.serverTimestamp(),
    });

    // 6. Update the Global Renter's derived fields
    batch.update(globalRenterRef, {
        updatedAt: FieldValue.serverTimestamp(),
        incidentCount: FieldValue.increment(1),
        unresolvedIncidents: FieldValue.increment(incidentData.status !== 'resolved' ? 1 : 0),
        linkedCompanyIds: FieldValue.arrayUnion(companyId),
        linkedRenterIds: FieldValue.arrayUnion(renterSnap.id),
        industries: FieldValue.arrayUnion(industry),
        emails: FieldValue.arrayUnion(...(renterData.emails || [])),
        phones: FieldValue.arrayUnion(...(renterData.phones || [])),
    });

    // 7. Update Fraud Signals (placeholder for now)
    const fraudSummaryRef = adminDB.collection('fraudGlobal').doc(globalRenterId).collection('summary').doc('latest');
     batch.set(fraudSummaryRef, {
        score: FieldValue.increment(10), // Placeholder scoring
        alert: true,
        lastUpdated: FieldValue.serverTimestamp(),
    }, { merge: true });


    // Commit all database operations atomically
    await batch.commit();
    
    // 8. Trigger post-sync async tasks (e.g., embeddings, advanced risk scoring)
    // These would typically be handled by Cloud Functions listening to writes.

    return { success: true, globalRenterId, incidentGlobalId: incidentGlobalRef.id };
};
