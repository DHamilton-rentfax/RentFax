export default function renterFailedTemplate({ phone, details }) {
  return `
    <h2>Renter Verification Failed</h2>
    <p>The renter associated with phone number ${phone} FAILED identity verification.</p>
    <p><strong>Reason:</strong> ${details.reason}</p>
    <ul>
      <li><strong>Identity:</strong> ${details.identity}</li>
      <li><strong>Fraud Risk:</strong> ${details.fraudRisk}</li>
    </ul>
  `;
}
