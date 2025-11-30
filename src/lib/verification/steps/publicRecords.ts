export function evaluatePublicRecords(publicData, renter) {
  if (!publicData || !publicData.matches?.length) {
    return {
      score: 50,
      matched: false,
      sources: [],
    };
  }

  const best = publicData.matches[0];

  const score = best.confidence * 100;

  return {
    score: Math.round(score),
    matched: score >= 75,
    sources: publicData.matches.map((m) => m.source),
  };
}