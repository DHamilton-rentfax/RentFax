'use server';

// Mocks the data fetching for a renter's incidents list.
export async function getRenterIncidents() {
  return [
    {
      industry: "Housing",
      type: "Late Rent",
      amount: 150.00,
      date: "2024-07-21",
    },
    {
      industry: "Automotive",
      type: "Excessive Wear",
      amount: 450.50,
      date: "2024-05-10",
    },
    {
      industry: "Housing",
      type: "Lease Break",
      amount: 2500.00,
      date: "2023-11-01",
    },
  ];
}
