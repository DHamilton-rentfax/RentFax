import { NextResponse } from "next/server";

const renters = {
  "1": {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    score: 95,
    level: 8,
    xp: 7500,
    aiExplanation: "John has a long and positive rental history with no reported incidents. His identity and address are verified, and he has a strong payment record, making him a low-risk renter.",
    incidentHistory: [],
    fraudSignals: [],
    disputeSummary: [],
    paymentBehavior: {
      onTimePayments: 12,
      latePayments: 0,
      averageDelay: 0,
    },
    identityStatus: "Verified",
    addressVerification: "Verified",
  },
  "2": {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    score: 88,
    level: 7,
    xp: 6200,
    aiExplanation: "Jane has a generally positive rental history, with two minor incidents that were resolved quickly. Her identity is verified, and her payment history is consistent.",
    incidentHistory: [
      { id: "inc1", date: "2023-05-15", description: "Noise complaint, resolved with a warning." },
      { id: "inc2", date: "2022-11-20", description: "Late rent payment by 3 days, paid in full." },
    ],
    fraudSignals: [],
    disputeSummary: [{ id: "disp1", date: "2022-11-25", description: "Disputed late fee, resolved in landlord's favor." }],
    paymentBehavior: {
      onTimePayments: 11,
      latePayments: 1,
      averageDelay: 3,
    },
    identityStatus: "Verified",
    addressVerification: "Not Verified",
  },
  "3": {
    id: "3",
    name: "Peter Jones",
    email: "peter.jones@example.com",
    score: 72,
    level: 5,
    xp: 4100,
    aiExplanation: "Peter has a mixed rental history with several incidents and disputes. A fraud signal has been detected, and his identity is not yet verified. He presents a moderate risk.",
    incidentHistory: [
      { id: "inc3", date: "2023-08-01", description: "Unauthorized pet on premises." },
      { id: "inc4", date: "2023-02-10", description: "Property damage to kitchen countertop." },
      { id: "inc5", date: "2022-09-05", description: "Repeated late rent payments." },
    ],
    fraudSignals: ["Credit report shows a previously unknown address."],
    disputeSummary: [
      { id: "disp2", date: "2023-02-20", description: "Disputed damage claim, pending resolution." },
      { id: "disp3", date: "2022-09-10", description: "Disputed late fees, resolved in renter's favor." },
    ],
    paymentBehavior: {
      onTimePayments: 8,
      latePayments: 4,
      averageDelay: 8,
    },
    identityStatus: "Not Verified",
    addressVerification: "Not Verified",
  },
};

export async function GET(request, { params }) {
  const { renterId } = params;
  const renter = renters[renterId];

  if (!renter) {
    return new Response("Renter not found", { status: 404 });
  }

  return NextResponse.json(renter);
}
