// src/lib/fraudEngine/scorePublicRecords.ts

export async function scorePublicRecords(input: {
  firstName: string;
  lastName: string;
  address: string;
  dob: string;
}) {
  // For now: safe neutral score so it costs $0
  return 70;
}
