import { adminDb } from "@/firebase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const totalTickets = (await adminDb.collection("support_chats").get()).size;

  const statsSnap = await adminDb.collection("support_stats").doc("global").get();
  const stats = statsSnap.data() || {};

  const articleSnap = await adminDb.collection("help_articles").get();
  const articleData = articleSnap.docs.map((d) => ({
    title: d.data().title,
    views: d.data().views || 0,
  }));

  return NextResponse.json({
    totalTickets,
    avgResponseTime: stats.avgResponseTime || 0,
    csat: stats.csat || 0,
    ticketVolumeChart: stats.ticketVolumeChart || {},
    articleViewChart: {
      labels: articleData.map((a) => a.title),
      datasets: [
        {
          label: "Views",
          data: articleData.map((a) => a.views),
          backgroundColor: "rgba(54, 162, 235, 0.5)",
        },
      ],
    },
    missingTopics: stats.missingTopics || [],
  });
}
