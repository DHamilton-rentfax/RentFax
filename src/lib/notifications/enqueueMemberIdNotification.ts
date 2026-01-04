import { adminDb } from "@/firebase/server";

/**
 * Enqueues a notification to be sent to a renter about the outcome of their decision.
 * In a production system, this would likely add a job to a queue (e.g., Google Cloud Tasks)
 * which would then be processed by a separate worker to handle the actual sending of the
 * email or SMS, including retries and error handling.
 */
export async function enqueueMemberIdNotification(
  requestId: string,
  renterId: string,
  orgName: string,
  status: "APPROVED" | "DENIED"
) {
  console.log(
    `Enqueuing notification for request ${requestId} (Renter: ${renterId}, Org: ${orgName}, Status: ${status})`
  );

  // For this implementation, we'll create a document in a collection.
  // A Cloud Function could listen to this collection to send the actual notifications.
  try {
    await adminDb.collection("memberIdNotifications").add({
      requestId,
      renterId,
      orgName,
      status,
      sent: false,
      createdAt: new Date(),
      processedAt: null,
    });
  } catch (error) {
    console.error("Failed to enqueue Member ID notification:", error);
    // It's important not to let a notification failure cause the primary API to fail.
  }
}
