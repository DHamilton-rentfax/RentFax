"use server";

import { adminDB } from "@/firebase/server";

export async function getUsageTimeseries(userId: string) {
  const usage = (await adminDB.collection("usage").doc(userId).get()).data() || {};

  const daily = usage.daily || {};

  const labels = [];
  const searches = [];
  const reports = [];

  for (const date of Object.keys(daily).sort()) {
    labels.push(date);
    searches.push(daily[date].searches || 0);
    reports.push(daily[date].reports || 0);
  }

  return { labels, searches, reports };
}
