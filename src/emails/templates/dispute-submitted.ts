export function disputeSubmittedTemplate({ adminName, incidentId, renterName }: { adminName: string, incidentId: string, renterName: string }) {
  return `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2>Dispute Submitted for Incident</h2>
      <p>Hello ${adminName},</p>
      <p>A dispute has been submitted by a renter for an incident report.</p>
      <p><strong>Incident ID:</strong> ${incidentId}</p>
      <p><strong>Renter:</strong> ${renterName}</p>
      <p>Please log in to the Admin Dashboard to review the dispute and take action.</p>
      <br/>
      <p style="font-size: 12px; color: #666;">
        This is an automated notification from RentFAX.
      </p>
    </div>
  `;
}
