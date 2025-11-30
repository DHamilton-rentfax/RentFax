import { NextResponse } from "next/server";
import { adminDB } from "@/firebase/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const type = searchParams.get("type");

  if (!userId) return NextResponse.json({ logs: [] });

  if (type === "recent-searches") {
    const logsSnap = await adminDB
      .collection("searchLogs")
      .doc(userId)
      .collection("entries")
      .orderBy("timestamp", "desc")
      .limit(10)
      .get();

    const logs = logsSnap.docs.map((d) => {
        const data = d.data();
        return {
            id: d.id,
            ...data,
            // Ensure timestamp is a serializable string
            timestamp: data.timestamp ? new Date(data.timestamp).toISOString() : null,
        }
    });

    return NextResponse.json({ logs });
  }

  return NextResponse.json({ logs: [] });
}
