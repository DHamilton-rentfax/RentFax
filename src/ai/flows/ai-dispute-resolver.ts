// Basic heuristic + LLM placeholder – can be replaced with Genkit/Vertex call
export async function aiDisputeResolver(dispute: any, report: any) {
  const msg = dispute.message.toLowerCase()
  const result = { suggestedStatus: 'review', aiSummary: '' }

  if (msg.includes('not me') || msg.includes('identity')) {
    result.suggestedStatus = 'review'
    result.aiSummary =
      'Possible identity mismatch. Recommend manual review before resolution.'
  } else if (msg.includes('error') || msg.includes('incorrect')) {
    result.suggestedStatus = 'resolved'
    result.aiSummary =
      'Renter reports factual inaccuracies. Recommend approving correction.'
  } else if (msg.includes('fraud') || msg.includes('false report')) {
    result.suggestedStatus = 'review'
    result.aiSummary =
      'Fraud allegation detected. Escalate to compliance review.'
  } else if (msg.includes('agree') || msg.includes('ok')) {
    result.suggestedStatus = 'resolved'
    result.aiSummary = 'Renter accepts report accuracy. Mark as resolved.'
  } else {
    result.suggestedStatus = 'review'
    result.aiSummary = 'No strong pattern detected. Needs manual review.'
  }

  return result
}
