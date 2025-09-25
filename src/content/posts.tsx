
export const posts = [
  {
    slug: "building-a-risk-score",
    title: "How we build a renter risk score (and why it matters)",
    date: "Sep 20, 2025",
    read: "7 min",
    excerpt: "A transparent approach to input signals, weights, and human-in-the-loop oversight.",
    body: (
      <>
        <p>We outline the inputs (identity, history, payment heuristics), how signals are normalized, and the role of human review for edge cases.</p>
        <h2>Signals we use</h2>
        <ul><li>Duplicate identity & shared address detection</li><li>Payment risk heuristics</li><li>Device & behavior patterns</li></ul>
      </>
    ),
  },
  {
    slug: "dispute-design",
    title: "Designing a dispute flow renters actually trust",
    date: "Sep 12, 2025",
    read: "5 min",
    excerpt: "Fairness, documentation, and time-boxed steps that reduce chargebacks and support compliance.",
    body: (
      <>
        <p>We share interaction patterns and documentation prompts that improve renter trust and operator outcomes.</p>
      </>
    ),
  },
  {
    slug: "fraud-signals",
    title: "The fraud signals that predict costly incidents",
    date: "Sep 2, 2025",
    read: "6 min",
    excerpt: "From shared device fingerprints to repeated contact patterns, the signals that matter most.",
    body: (
      <>
        <p>We break down the patterns and how they influence decisioning without overfitting.</p>
      </>
    ),
  },
];
