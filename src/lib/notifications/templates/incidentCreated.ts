export function incidentCreatedTemplate(data: any) {
  return `
    <h2>New Incident Report Added</h2>
    <p>An incident has been filed for renter <b>${data.renterName}</b>.</p>
    <p>Type: ${data.type}</p>
    <p>Amount: $${data.amount}</p>
    <p><a href="${process.env.APP_URL}/dashboard/incidents/${data.incidentId}">
      View Incident Details
    </a></p>
  `;
}
