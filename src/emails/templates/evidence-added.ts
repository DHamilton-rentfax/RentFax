export function evidenceAddedTemplate({ renterName, incidentId, evidenceType }: { renterName: string, incidentId: string, evidenceType: string }) {
  return `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2>New Evidence Added to Incident Report</h2>
      <p>Hello ${renterName},</p>
      <p>New evidence has been added to an incident report involving you.</p>
      <p><strong>Incident ID:</strong> ${incidentId}</p>
      <p><strong>Evidence Type:</strong> ${evidenceType}</p>
      <p>You can log in to your Renter Portal to review the new evidence.</p>
      <br/>
      <p style="font-size: 12px; color: #666;">
        This is an automated notification from RentFAX.
      </p>
    </div>
  `;
}
