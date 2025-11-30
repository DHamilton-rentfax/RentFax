export function incidentCreatedTemplate({ renterName, incidentId, amount }: { renterName: string, incidentId: string, amount: number }) {
  return `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2>New Incident Reported</h2>
      <p>Hello ${renterName},</p>
      <p>A new incident has been filed against you in the RentFAX system.</p>
      <p><strong>Incident ID:</strong> ${incidentId}</p>
      <p><strong>Amount:</strong> $${amount}</p>
      <p>You can log in to your Renter Portal to view details and submit a dispute if needed.</p>
      <br/>
      <p style="font-size: 12px; color: #666;">
        This is an automated notification from RentFAX.
      </p>
    </div>
  `;
}
