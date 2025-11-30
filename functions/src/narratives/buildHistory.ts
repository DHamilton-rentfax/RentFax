export function buildHistoryNarrative(incidents, disputes) {
  return `
    The renter has a total of ${incidents.length} recorded incidents
    and ${disputes.length} disputes in the RentFAX network.

    Over time, the renter demonstrates:
    - ${incidents.filter(i => i.status === "unpaid").length} unpaid balances
    - ${incidents.filter(i => i.status === "paid").length} resolved balances
    - ${disputes.filter(d => d.status !== "closed").length} active disputes

    Behavioral trends include:
    (AI-generated patterns inserted later)
  `;
}
