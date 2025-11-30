// Inside your PDF HTML builder
const identitySection = `
  <h2 style="font-size:18px;margin-bottom:8px;">Identity Verification</h2>

  <div style="font-size:14px;margin-bottom:6px;">
    <strong>Status:</strong> ${renter.verificationStatus ?? "UNVERIFIED"}
  </div>

  <div style="font-size:14px;margin-bottom:6px;">
    <strong>Match Score:</strong> ${report.matchScore ?? 0}/100
  </div>

  <div style="font-size:14px;margin-bottom:6px;">
    <strong>Fraud Score:</strong> ${renter.fraudScore ?? 0}/100
  </div>

  ${
    fraudSignals?.duplicateEmailCount > 0 ||
    fraudSignals?.duplicatePhoneCount > 0
      ? `<div style="color:#b91c1c;font-size:14px;margin-bottom:6px;">
          ⚠ Shares email/phone with other renters.
        </div>`
      : ""
  }

  ${
    fraudSignals?.sharedAddressFlaggedCount > 0
      ? `<div style="color:#dc2626;font-size:14px;margin-bottom:6px;">
          ⚠ Shared address with flagged renters.
        </div>`
      : ""
  }

  <hr style="margin:16px 0;" />
`;
