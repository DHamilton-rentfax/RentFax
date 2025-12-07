export function generateRiskSummary(fraud: any, incidents: any[]) {
  let text = "";

  if (!fraud) {
    return "No identity or fraud anomalies detected for this renter.";
  }

  const { identityScore, fraudScore, fraudSignals } = fraud;

  text += `Identity Confidence: ${identityScore}%\n`;
  text += `Fraud Risk: ${fraudScore}%\n\n`;

  if (fraudSignals.length === 0) {
    text += "No fraud indicators were detected.";
  } else {
    text += "Detected fraud indicators:\n";
    fraudSignals.forEach((s) => {
      text += ` • ${s}\n`;
    });
  }

  if (incidents.length > 0) {
    text += `\nPrevious incidents on record: ${incidents.length}.\n`;
  }

  return text.trim();
}
