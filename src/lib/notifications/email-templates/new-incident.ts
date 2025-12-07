// src/lib/notifications/email-templates/new-incident.ts

export const newIncidentTemplate = (incidentId: string, renterName: string) => `
  <h2>A new incident has been filed</h2>
  <p>Renter: ${renterName}</p>
  <p>Incident ID: ${incidentId}</p>
  <a href="${process.env.APP_URL}/dashboard/incidents/${incidentId}">
    View Incident
  </a>
`;
