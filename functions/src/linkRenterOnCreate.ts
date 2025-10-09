
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

if(admin.apps.length === 0) {
  admin.initializeApp();
}

export const linkRenterOnCreate = functions.firestore
  .document("renters/{renterId}")
  .onCreate(async (snap, context) => {
    const renterId = context.params.renterId;
    const renter = snap.data();

    if (!renter) {
        console.log("No renter data found for renterId:", renterId);
        return;
    }

    const { fullName, dateOfBirth, govIdLast4 } = renter;
    const db = admin.firestore();

    const incidentQuery = await db
      .collection("incidents")
      .where("renterName", "==", fullName)
      .get();

    const matchedIncidents: string[] = [];

    for (const doc of incidentQuery.docs) {
      const data = doc.data();
      if (
        (data.renterDOB && data.renterDOB === dateOfBirth) ||
        (data.renterGovIdLast4 && data.renterGovIdLast4 === govIdLast4)
      ) {
        matchedIncidents.push(doc.id);
        await doc.ref.update({ renterId });
      }
    }

    const resolutionQuery = await db.collection("resolutions").get();
    const matchedResolutions: string[] = [];

    for (const doc of resolutionQuery.docs) {
      const data = doc.data();
      if (matchedIncidents.includes(data.incidentId)) {
        matchedResolutions.push(doc.id);
        await doc.ref.update({ renterId });
      }
    }

    await db.collection("renters").doc(renterId).update({
      linkedIncidents: matchedIncidents,
      linkedResolutions: matchedResolutions,
      updatedAt: new Date().toISOString(),
    });
  });
