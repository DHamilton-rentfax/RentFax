export function incidentUpdatedTemplate({ renterName, incidentId, changes }: { renterName: string, incidentId: string, changes: string }) {
  return `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2>Incident Report Updated</h2>
      <p>Hello ${renterName},</p>
      <p>An incident report involving you has been updated.</p>
      <p><strong>Incident ID:</strong> ${incidentId}</p>
      <p><strong>Changes:</strong></p>
      <pre>${changes}</pre>
      <p>You can log in to your Renter Portal to view the latest details.</p>
      <br/>
      <p style="font-size: 12px; color: #666;">
        This is an automated notification from RentFAX.
      </p>
    </div>
  `;
}
