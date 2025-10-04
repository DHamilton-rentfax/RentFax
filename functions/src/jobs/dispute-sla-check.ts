import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

// This is a placeholder for the actual createNotification function
// In a real scenario, you would import this from its actual file location
async function createNotification(notification: any): Promise<any> {
    try {
        const docRef = await admin.firestore().collection("notifications").add({
            ...notification,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            read: false,
        });
        console.log("Notification created with ID: ", docRef.id);
        return { success: true, id: docRef.id };
    } catch (error) {
        console.error("Error creating notification:", error);
        return { success: false, error };
    }
}

export const disputeSlaCheck = functions.pubsub
  .schedule("every 24 hours")
  .onRun(async () => {

    const db = admin.firestore();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const slaBreachedDisputes = await db
      .collection("disputes")
      .where("status", "in", ["open", "pending"])
      .where("createdAt", "<", admin.firestore.Timestamp.fromDate(sevenDaysAgo))
      .get();

    if (slaBreachedDisputes.empty) {
      console.log("No SLA breaches found.");
      return null;
    }

    console.log(`Found ${slaBreachedDisputes.size} SLA breaches.`);

    const notificationPromises: Promise<any>[] = [];

    slaBreachedDisputes.docs.forEach((doc) => {
      const message = `Dispute #${doc.id} has been open for more than 7 days and has breached the SLA.`;

      const notification = {
        message,
        userId: "SUPER_ADMIN", // Target super admins
        priority: "high",
        type: "DISPUTE_SLA_BREACH",
        link: `/admin/super-dashboard/disputes/${doc.id}`,
      };

      notificationPromises.push(createNotification(notification));
    });

    await Promise.all(notificationPromises);

    return null;
  });
