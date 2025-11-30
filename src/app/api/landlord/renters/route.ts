import { NextResponse } from "next/server";

export async function GET() {
  // Dummy data for now
  const renters = [
    {
      id: "1",
      name: "John Doe",
      email: "john.doe@example.com",
      score: 95,
      level: 8,
      xp: 7500,
      incidents: 1,
      disputes: 0,
      fraudSignals: 0,
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane.smith@example.com",
      score: 88,
      level: 7,
      xp: 6200,
      incidents: 2,
      disputes: 1,
      fraudSignals: 0,
    },
    {
      id: "3",
      name: "Peter Jones",
      email: "peter.jones@example.com",
      score: 72,
      level: 5,
      xp: 4100,
      incidents: 5,
      disputes: 2,
      fraudSignals: 1,
    },
  ];

  return NextResponse.json(renters);
}
