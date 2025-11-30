export function describeTimeline(events) {
  events.sort((a, b) => a.createdAt - b.createdAt);

  return events.map(e => {
    switch (e.action) {
      case "INCIDENT_CREATED":
        return `Incident created on ${new Date(e.createdAt).toLocaleDateString()}.`;
      case "EVIDENCE_UPLOADED":
        return `Evidence uploaded by ${e.actorId} on ${new Date(e.createdAt).toLocaleString()}.`;
      case "DISPUTE_SUBMITTED":
        return `Renter submitted a dispute on ${new Date(e.createdAt).toLocaleString()}.`;
      case "STATUS_CHANGED":
        return `Incident status changed to ${e.data?.newStatus}.`;
      default:
        return `Event: ${e.action}`;
    }
  }).join(" ");
}
