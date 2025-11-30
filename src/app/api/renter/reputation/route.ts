import { NextResponse } from "next/server";

export async function GET() {
  // Dummy data for a specific renter (e.g., Jane Smith)
  const reputationData = {
    score: 88,
    level: 7,
    xp: 6200,
    nextLevelXp: 7000,
    achievements: [
      { id: 1, title: "Early Bird", description: "Paid rent 3 days early.", xp: 50, unlocked: true },
      { id: 2, title: "Consistent Payer", description: "Paid rent on time for 6 consecutive months.", xp: 200, unlocked: true },
      { id: 3, title: "Identity Verified", description: "Completed identity verification.", xp: 100, unlocked: true },
      { id: 4, title: "Profile Complete", description: "Filled out all profile sections.", xp: 50, unlocked: false },
      { id: 5, title: "Zero Incidents", description: "Maintain a clean record for 1 year.", xp: 500, unlocked: false },
    ],
    history: [
      { date: "2023-10-01", event: "Rent Paid On Time", xpChange: 10 },
      { date: "2023-09-01", event: "Rent Paid On Time", xpChange: 10 },
      { date: "2023-08-01", event: "Rent Paid On Time", xpChange: 10 },
      { date: "2023-07-01", event: "Rent Paid On Time", xpChange: 10 },
      { date: "2023-06-01", event: "Rent Paid On Time", xpChange: 10 },
      { date: "2023-05-15", event: "Noise complaint", xpChange: -50 },
      { date: "2023-05-01", event: "Rent Paid On Time", xpChange: 10 },
    ],
  };

  return NextResponse.json(reputationData);
}
