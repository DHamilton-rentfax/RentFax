// ===========================================
// RentFAX | Cloud Functions
// Location: functions/src/index.ts
// ===========================================
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

const db = admin.firestore();

/**
 * A scheduled function that runs daily to check for leases that ended recently
 * and triggers a notification to the landlord to submit a behavioral review.
 */
export const promptForLeaseEndReview = functions.pubsub
  .schedule("every 24 hours") // Runs once a day
  .onRun(async (context) => {
    console.log("Running daily check for leases that have ended...");

    const today = admin.firestore.Timestamp.now();
    // Look for leases that ended in the last 24 hours and haven't been prompted for review yet
    const yesterday = new admin.firestore.Timestamp(today.seconds - 86400, today.nanoseconds);

    const leasesEndedRecently = await db
      .collection("rentals")
      .where("leaseEnd", "<=", today)
      .where("leaseEnd", ">", yesterday)
      .where("reviewPromptSent", "==", false) // Make sure we don't send duplicate prompts
      .get();

    if (leasesEndedRecently.empty) {
      console.log("No leases ended in the last 24 hours that need a review prompt.");
      return null;
    }

    console.log(`Found ${leasesEndedRecently.docs.length} leases to process.`);

    for (const doc of leasesEndedRecently.docs) {
      const rental = doc.data();
      const { ownerId, renterRef } = rental;

      try {
        // Fetch renter details to personalize the notification
        const renterDoc = await db.collection("renterProfiles").doc(renterRef).get();

        if (!renterDoc.exists) {
          console.warn(`Skipping rental ${doc.id}: Renter profile not found.`);
          continue;
        }

        const renterData = renterDoc.data()!;
        const renterName = renterData.name;

        // Call the notification API to send the prompt
        // IMPORTANT: Replace with your actual app URL and a real secret
        await fetch(`https://your-app-url.com/api/notifications/send`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                // This is crucial for securing your internal API
                "Authorization": `Bearer ${process.env.INTERNAL_API_SECRET}` 
            },
            body: JSON.stringify({
                userId: ownerId,
                template: "rental_review_prompt",
                data: {
                    renterName: renterName,
                    rentalId: doc.id,
                },
            }),
        });


        // Mark the rental as having been prompted to prevent re-sending
        await db.collection("rentals").doc(doc.id).update({
          reviewPromptSent: true,
        });

        console.log(`Successfully sent review prompt for rental ${doc.id} to owner ${ownerId}.`);

      } catch (error) {
        console.error(`Failed to process rental ${doc.id}:`, error);
      }
    }

    return null;
  });

/**
 * Triggered on the creation of any new document in the 'rentalReviews' collection.
 * It automatically recalculates the aggregate behaviorScore for the corresponding renter.
 */
export const recalculateBehaviorScore = functions.firestore
  .document("rentalReviews/{reviewId}")
  .onCreate(async (snap, context) => {
    const newReview = snap.data();
    const renterId = newReview.renterRef;

    if (!renterId) {
      console.log("Review is missing a renterRef. Exiting function.");
      return null;
    }

    // 1. Get all reviews for this renter
    const reviewsSnapshot = await db
      .collection("rentalReviews")
      .where("renterRef", "==", renterId)
      .get();

    if (reviewsSnapshot.empty) {
      return null;
    }

    let totalScore = 0;
    let reviewCount = 0;
    const reviewHistory: { reviewId: string; score: number }[] = [];

    // 2. Loop through all reviews to calculate the new aggregate score
    reviewsSnapshot.forEach((doc) => {
      const review = doc.data();
      // Calculate the average score for a single review
      const singleReviewScore =
        (review.timelinessScore + review.cleanlinessScore + review.communicationScore) / 3;

      totalScore += singleReviewScore;
      reviewCount++;
      reviewHistory.push({ reviewId: doc.id, score: singleReviewScore });
    });

    const newBehaviorScore = totalScore / reviewCount;
    const renterProfileRef = db.collection("renterProfiles").doc(renterId);

    // 3. Update the renter's profile with the new, accurate score
    try {
      await renterProfileRef.update({
        behaviorScore: parseFloat(newBehaviorScore.toFixed(2)),
        behavioralReviews: reviewHistory, // Store a history of contributing reviews
        lastBehaviorUpdate: admin.firestore.FieldValue.serverTimestamp(),
      });
      console.log(
        `Successfully recalculated behavior score for renter ${renterId} to ${newBehaviorScore.toFixed(2)}.`
      );
    } catch (error) {
      console.error(
        `Failed to update profile for renter ${renterId}:`,
        error
      );
    }

    return null;
  });
