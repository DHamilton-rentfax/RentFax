export function getPlans() {
  return [
    {
      id: 'basic',
      name: 'Freemium',
      description: 'View reports, basic score monitoring.',
      price: 0,
      priceId: 'free',
    },
    {
      id: 'standard',
      name: 'Monthly Pro',
      description: 'Dispute uploads, alerts, full reports.',
      price: 19,
      priceId: 'price_monthly_pro',
    },
    {
      id: 'annual',
      name: 'Annual Pro',
      description: 'Save 15% with annual billing.',
      price: 190,
      priceId: 'price_annual_pro',
    },
  ]
}
