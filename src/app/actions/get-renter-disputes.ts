'use server';

// Mocks the data fetching for a renter's disputes list.
export async function getRenterDisputes() {
  return [
    {
      incidentId: "INC-45678",
      status: "Under Review",
      reason: "Incorrect amount charged for damages.",
    },
  ];
}
