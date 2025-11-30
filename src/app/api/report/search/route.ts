import { NextResponse } from 'next/server';

// THIS IS A MOCK API ENDPOINT.
// In a real application, this would query a database and external fraud detection services.

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get('name');
  const identifier = searchParams.get('id'); // phone or email

  // Basic validation
  if (!name || !identifier) {
    return NextResponse.json({ error: 'Search parameters missing' }, { status: 400 });
  }

  // Mock Data: This simulates finding a user with a complex history.
  const mockReport = {
    // Publicly visible info (before purchase)
    preview: {
      renterInfo: {
        firstName: name.split(' ')[0],
        city: 'New York, NY', // City-level only
      },
      riskScore: 88, // 0-100 scale, higher is riskier
      riskLevel: 'High',
      riskTeaserSummary: "This renter has a pattern of payment inconsistencies, 2 landlord disputes, and a high activity spike in the last 6 months.",
      reportStrength: {
        identitySignals: true,
        behaviorHistory: true,
        disputeRecord: true,
        fraudNetworkCheck: true,
        financialIncidents: true,
        verificationStatus: false, // In this case, verification is not complete
      },
      counts: {
        incidents: 3,
        disputes: 2,
        unpaidBalances: 1,
        identityMismatches: 1,
        fraudNetworkConnections: 6,
      },
      timelineSummary: "Activity detected in the last 2 years, with a notable increase in early 2024.",
      blurredThumbnailUrl: '/images/blurred-report-thumbnail.png', // Placeholder for the blurred report image
    },

    // Locked data (revealed after purchase)
    fullReport: {
      incidentDetails: [
        { id: 'INC-001', title: 'Unpaid Rent - August 2024', date: '2024-09-05', amount: '$820.00', status: 'Open' },
        { id: 'INC-002', title: 'Property Damage', date: '2024-08-20', amount: '$250.00', status: 'Disputed' },
        { id: 'INC-003', title: 'Lease Violation', date: '2024-07-10', amount: '$0.00', status: 'Resolved' },
      ],
      disputeDetails: [
        { id: 'DIS-001', incidentId: 'INC-002', reason: 'The claimed amount is excessive.', outcome: 'Under Review' },
        { id: 'DIS-002', incidentId: 'OLD-INC-555', reason: 'Never received a refund for security deposit.', outcome: 'Closed in renter\'s favor' },
      ],
      identityVerification: {
        status: 'Mismatch',
        reason: 'Selfie photo does not match government ID.',
        checkedOn: '2024-09-01'
      },
      fraudNetwork: {
        mapUrl: '/images/fraud-network-map.png', // Placeholder
        connections: [
          { profileId: 'p-xyz', risk: 'High' },
          { profileId: 'p-abc', risk: 'Medium' }
        ]
      },
      aiDecisionConfidence: {
        score: 92,
        summary: "High confidence in risk assessment due to corroborating evidence from multiple sources, including payment history and identity flags."
      },
      fullAddressHistory: [
        { address: '123 Main St, New York, NY', startDate: '2023-01-15', endDate: '2024-08-31' }
      ]
    }
  };

  // Simulate network delay
  await new Promise(res => setTimeout(res, 1000));

  return NextResponse.json(mockReport);
}
