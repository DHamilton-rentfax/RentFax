
import * as React from "react";

interface EmailReceiptTemplateProps {
  type: "identity-check" | "full-report";
  amount: number;
  renterName: string;
  userName: string;
  reportUrl?: string | null;
}

export function EmailReceiptTemplate({
  type,
  amount,
  renterName,
  userName,
  reportUrl,
}: EmailReceiptTemplateProps) {
  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: "20px", color: "#333" }}>
      <h2 style={{ color: "#1A2540" }}>Thank you for your purchase, {userName}</h2>

      <p>
        Your{" "}
        <strong>
          {type === "identity-check"
            ? "Renter Identity Check"
            : "Full RentFAX Report"}
        </strong>{" "}
        has been completed.
      </p>

      <p>
        <strong>Renter:</strong> {renterName}
      </p>

      <p>
        <strong>Amount Charged:</strong> ${amount.toFixed(2)}
      </p>

      {reportUrl && (
        <p>
          <a 
            href={reportUrl} 
            style={{
              display: 'inline-block',
              padding: '10px 15px',
              backgroundColor: '#1A2540',
              color: '#ffffff',
              textDecoration: 'none',
              borderRadius: '5px',
              fontWeight: 'bold'
            }}
          >
            Click here to view the full report
          </a>
        </p>
      )}

      <p style={{ marginTop: "20px", fontSize: '12px', color: "#666" }}>
        This charge will appear on your statement as "RENTFAX".
      </p>
    </div>
  );
}
