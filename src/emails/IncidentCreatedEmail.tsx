// src/emails/IncidentCreatedEmail.tsx
import * as React from "react";

export function IncidentCreatedEmail({
  renterName,
  incidentType,
  incidentDescription,
  dashboardUrl,
}: {
  renterName: string;
  incidentType: string;
  incidentDescription: string;
  dashboardUrl: string;
}) {
  return (
    <div style={{ fontFamily: "Arial, sans-serif", lineHeight: "1.6" }}>
      <h2>New Incident Added to Your RentFAX Profile</h2>

      <p>Hi {renterName},</p>

      <p>
        A new <strong>{incidentType}</strong> incident has been added to your
        RentFAX record.
      </p>

      <p>
        <strong>Description:</strong>
        <br />
        {incidentDescription}
      </p>

      <p>
        You can review this incident and provide a dispute if necessary in your
        renter dashboard:
      </p>

      <p>
        <a href={dashboardUrl} style={{ color: "#2563eb" }}>
          View Your Dashboard
        </a>
      </p>

      <p>If you believe this incident was filed in error, you may dispute it.</p>

      <p>— The RentFAX Team</p>
    </div>
  );
}
