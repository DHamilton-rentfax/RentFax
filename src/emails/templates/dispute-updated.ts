export function disputeUpdatedTemplate({ renterName, incidentId, status, comments }: { renterName: string, incidentId: string, status: string, comments: string }) {
  return `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2>Dispute Status Updated</h2>
      <p>Hello ${renterName},</p>
      <p>The status of your dispute for an incident has been updated.</p>
      <p><strong>Incident ID:</strong> ${incidentId}</p>
      <p><strong>New Status:</strong> ${status}</p>
      <p><strong>Comments:</strong></p>
      <p>${comments}</p>
      <p>You can log in to your Renter Portal for more details.</p>
      <br/>
      <p style="font-size: 12px; color: #666;">
        This is an automated notification from RentFAX.
      </p>
    </div>
  `;
}
