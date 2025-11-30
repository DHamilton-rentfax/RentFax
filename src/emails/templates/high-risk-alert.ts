export function highRiskAlertTemplate({ adminName, incidentId, renterName, reason }: { adminName: string, incidentId: string, renterName: string, reason: string }) {
  return `
    <div style="font-family: Arial, sans-serif; padding: 20px; border: 2px solid #ff0000;">
      <h2 style="color: #ff0000;">High-Risk Alert</h2>
      <p>Hello ${adminName},</p>
      <p>A high-risk incident has been flagged in the system.</p>
      <p><strong>Incident ID:</strong> ${incidentId}</p>
      <p><strong>Renter:</strong> ${renterName}</p>
      <p><strong>Reason:</strong> ${reason}</p>
      <p>Immediate review is recommended. Please log in to the Admin Dashboard for full details.</p>
      <br/>
      <p style="font-size: 12px; color: #666;">
        This is an automated notification from RentFAX.
      </p>
    </div>
  `;
}
