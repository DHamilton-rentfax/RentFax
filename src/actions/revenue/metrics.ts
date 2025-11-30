"use server";

import { db } from "@/lib/firebase/server";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";

export async function getRevenueMetrics() {
  const dealsSnap = await getDocs(collection(db, "deals"));
  const deals = dealsSnap.docs.map(d => ({ id: d.id, ...d.data() }));

  const repsSnap = await getDocs(collection(db, "users"));
  const reps = repsSnap.docs.map(d => ({ id: d.id, ...d.data() }));

  const activitiesSnap = await getDocs(
    query(collection(db, "activities"), orderBy("timestamp", "desc"))
  );
  const activities = activitiesSnap.docs.map(d => ({ id: d.id, ...d.data() }));

  const won = deals.filter(d => d.stage === "won");
  const lost = deals.filter(d => d.stage === "lost");
  const open = deals.filter(d => !["won", "lost"].includes(d.stage));

  // MRR & ARR
  const totalMRR = won.reduce((s, d) => s + (d.amountMonthly || 0), 0);
  const totalARR = totalMRR * 12;

  // Monthly New MRR
  const last30 = Date.now() - 1000 * 60 * 60 * 24 * 30;
  const newMRR = won
    .filter(d => d.updatedAt?.seconds * 1000 >= last30)
    .reduce((s, d) => s + (d.amountMonthly || 0), 0);

  // Leaderboard
  const leaderboard = reps.map(rep => ({
    rep,
    deals: won.filter(d => d.repId === rep.id),
    mrr: won.filter(d => d.repId === rep.id)
             .reduce((s, d) => s + (d.amountMonthly || 0), 0),
  }));

  // Pipeline by stage
  const pipeline = {
    new: open.filter(d => d.stage === "new"),
    qualified: open.filter(d => d.stage === "qualified"),
    demo: open.filter(d => d.stage === "demo"),
    proposal: open.filter(d => d.stage === "proposal"),
    negotiation: open.filter(d => d.stage === "negotiation"),
  };

  const pipelineTotals = Object.fromEntries(
    Object.entries(pipeline).map(([k, v]) => [
      k,
      v.reduce((s, d) => s + (d.amountMonthly || 0), 0)
    ])
  );

  // Win rate
  const winRate = won.length / (won.length + lost.length || 1);

  // Forecast calculations
  const forecast = {
    bestCase: open.reduce((s, d) => s + d.amountMonthly * 1.0, 0),
    mostLikely: open.reduce((s, d) => s + d.amountMonthly * (d.probability / 100), 0),
    commit: open
      .filter(d => d.probability >= 80)
      .reduce((s, d) => s + d.amountMonthly, 0),
  };

  return {
    totalMRR,
    totalARR,
    newMRR,
    leaderboard,
    pipelineTotals,
    winRate,
    forecast,
    openDeals: open,
    lostDeals: lost,
    wonDeals: won,
    activities,
  };
}
