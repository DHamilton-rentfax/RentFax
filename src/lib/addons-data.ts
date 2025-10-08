'''// In a real-world app, this data would likely come from a headless CMS.
export const addonDetails = [
  {
    slug: "ai-dispute-draft-assistant",
    name: "AI Dispute Draft Assistant",
    tagline: "Resolve Tenant Disputes 10x Faster",
    overview: "Leverage generative AI to automatically create professional, legally-sound responses to tenant disputes, saving you hours of manual work and reducing legal risks.",
    keyBenefits: [
      "Drastically reduce time spent on paperwork.",
      "Ensure consistency and compliance in all communications.",
      "Leverage pre-vetted legal language to strengthen your position.",
    ],
    useCase: {
      title: "Scenario: Tenant Disputes a Late Fee",
      content: "Instead of manually drafting a response, you input the dispute details. The AI instantly generates a formal letter citing the relevant clauses in your lease agreement, explains the fee structure, and provides a clear path to resolution. What took 30 minutes now takes 30 seconds.",
    },
    priceId: "addon_ai_dispute", // Matches the ID from the pricing page
  },
  // ... Add comprehensive details for other add-ons here
];

export const getAddonBySlug = (slug: string) => {
  return addonDetails.find((addon) => addon.slug === slug);
};
'''