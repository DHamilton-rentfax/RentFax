export function disputeSubmittedTemplate(data: any) {
  return `
    <h2>Dispute Submitted</h2>
    <p>A dispute has been submitted for incident <b>${data.incidentId}</b>.</p>
    <p>Renter: ${data.renterName}</p>
    <p><a href="${process.env.APP_URL}/dashboard/disputes/${data.disputeId}">
      View Dispute Details
    </a></p>
  `;
}
