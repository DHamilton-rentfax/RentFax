'use server';

// Mocks the data fetching for the renter's main dashboard.
export async function getRenterDashboard() {
  // In a real app, you'd get the user's UID from the session.
  const user = { uid: 'test-renter-uid' }; 

  return {
    uid: user.uid,
    universalScore: 88,
    incidentCount: 3,
    disputeCount: 1,
    alerts: [
      "A new incident was reported by 'PropertyManagement Corp' on 2024-07-21.",
      "Your dispute for incident #INC-45678 has been updated.",
    ],
  };
}
