export function scoreVerification({ ocr, faceMatchScore, fraudSignals }) {
  let score = 0;

  if (faceMatchScore >= 0.85) score += 0.5;

  if (ocr.name) score += 0.2;
  if (ocr.dob) score += 0.1;
  if (ocr.address) score += 0.1;

  if (fraudSignals.length === 0) score += 0.1;

  return score; // 0–1
}
