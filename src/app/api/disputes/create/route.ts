import { NextRequest, NextResponse } from "next/server";
import { dbAdmin } from "@/firebase/client-admin";
import { FieldValue } from "firebase-admin/firestore";

// This is a mock file upload handler. In a real application, you would
// use a service like Google Cloud Storage or AWS S3.
async function handleFileUploads(files: File[]): Promise<string[]> {
  if (!files || files.length === 0) {
    return [];
  }

  const uploadPromises = files.map(async (file) => {
    // Simulate the upload process
    await new Promise((resolve) => setTimeout(resolve, 500));
    // Return a mock URL
    return `/uploads/evidence/${Date.now()}-${file.name}`;
  });

  return Promise.all(uploadPromises);
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const id = formData.get("id") as string;
    const message = formData.get("message") as string;
    const evidenceFiles = formData.getAll("evidence") as File[];

    if (!id || !message) {
      return new NextResponse(
        JSON.stringify({ success: false, error: "Missing id or message" }),
        { status: 400 },
      );
    }

    // 1. Handle file uploads
    const evidenceUrls = await handleFileUploads(evidenceFiles);

    // 2. Create a new dispute document in Firestore
    const disputeRef = await dbAdmin.collection("disputes").add({
      id,
      message,
      evidence: evidenceUrls,
      createdAt: FieldValue.serverTimestamp(),
      status: "submitted",
    });

    // 3. Update the related incident to mark it as disputed
    const incidentRef = dbAdmin.collection("incidents").doc(id);
    await incidentRef.update({ status: "disputed" });

    return new NextResponse(
      JSON.stringify({ success: true, id: disputeRef.id }),
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating dispute:", error);
    return new NextResponse(
      JSON.stringify({ success: false, error: "Internal Server Error" }),
      { status: 500 },
    );
  }
}
