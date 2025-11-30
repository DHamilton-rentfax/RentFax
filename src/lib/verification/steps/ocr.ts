export function evaluateOcrConsistency(ocr, submitted) {
  const issues: string[] = [];
  let score = 100;

  if (ocr.fullName && submitted.fullName) {
    if (ocr.fullName.toLowerCase() !== submitted.fullName.toLowerCase()) {
      issues.push("Name mismatch");
      score -= 35;
    }
  }

  if (ocr.dob && submitted.dob) {
    if (ocr.dob !== submitted.dob) {
      issues.push("Date of birth mismatch");
      score -= 25;
    }
  }

  if (ocr.address && submitted.address) {
    if (!ocr.address.toLowerCase().includes(submitted.address.toLowerCase())) {
      issues.push("Address mismatch");
      score -= 20;
    }
  }

  return {
    score: Math.max(score, 0),
    issues,
    passed: score >= 70,
  };
}