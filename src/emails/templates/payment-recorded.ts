export function paymentRecordedTemplate({ renterName, incidentId, amount, newBalance }: { renterName: string, incidentId: string, amount: number, newBalance: number }) {
  return `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2>Payment Recorded</h2>
      <p>Hello ${renterName},</p>
      <p>A payment has been recorded for your incident.</p>
      <p><strong>Incident ID:</strong> ${incidentId}</p>
      <p><strong>Amount Paid:</strong> $${amount}</p>
      <p><strong>New Balance:</strong> $${newBalance}</p>
      <p>Thank you for your payment.</p>
      <br/>
      <p style="font-size: 12px; color: #666;">
        This is an automated notification from RentFAX.
      </p>
    </div>
  `;
}
