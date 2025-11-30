export default function renterVerifiedTemplate({ phone, details }) {
  return `
    <h2>Renter Verification Complete</h2>
    <p>The renter associated with phone number ${phone} has been successfully verified.</p>
    <ul>
      <li><strong>Identity:</strong> ${details.identity}</li>
      <li><strong>Fraud Risk:</strong> ${details.fraudRisk}</li>
      <li><strong>Device:</strong> ${details.device}</li>
    </ul>
  `;
}
