'use server';

// Mocks the data fetching for a renter's profile details.
export async function getRenterProfile() {
  return {
    fullName: "Jane Doe",
    email: "jane.doe@example.com",
    dob: "1990-05-15",
    governmentID: {
      status: "Verified",
    },
  };
}
