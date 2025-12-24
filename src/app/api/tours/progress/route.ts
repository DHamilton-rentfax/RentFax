import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/firebase/server";
import { getOptionalUser } from "@/lib/auth/optionalUser";
import { FieldValue } from "firebase-admin/firestore";

export async function POST(req: NextRequest) {
  const user = await getOptionalUser(req);
  if (!user) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  const body = await req.json();
  const { tourSlug, status, currentStepIndex } = body;

  if (!tourSlug || !status || currentStepIndex === undefined) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const docId = `${user.id}_${tourSlug}`;
  const progressRef = adminDb.collection("user_tour_progress").doc(docId);

  try {
    await adminDb.runTransaction(async (transaction) => {
        const doc = await transaction.get(progressRef);

        const data: any = {
            userId: user.id,
            tourSlug: tourSlug,
            status: status,
            currentStepIndex: currentStepIndex,
            updatedAt: FieldValue.serverTimestamp(),
        };

        if (!doc.exists) {
            data.startedAt = FieldValue.serverTimestamp();
        }

        if (status === "completed") {
            data.completedAt = FieldValue.serverTimestamp();
        } else if (status === "dismissed") {
            data.dismissedAt = FieldValue.serverTimestamp();
        }
        
        if (doc.exists) {
            transaction.update(progressRef, data);
        } else {
            transaction.set(progressRef, data);
        }
    });

    // Also, log this to your main analytics collection
    await adminDb.collection("support_metrics").add({
        type: `TOUR_${status.toUpperCase()}`,
        tourSlug,
        stepIndex: currentStepIndex,
        userId: user.id,
        role: user.role,
        createdAt: new Date(),
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Error updating tour progress:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
