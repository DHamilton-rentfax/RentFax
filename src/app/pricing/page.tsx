
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { CheckCircle, ShieldCheck, Zap } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pricing - RentFAX',
  description: 'Choose the perfect plan for your rental business. From free starter plans to enterprise solutions, RentFAX has you covered.',
};

const tiers = [
  {
    name: 'Free',
    price: '$0',
    description: 'For individuals getting started',
    features: [
      'Search preview only',
      'Limited support'
    ],
    cta: 'Get Started',
    href: '/signup'
  },
  {
    name: 'Pro',
    price: '$49',
    description: 'For professionals and small businesses',
    isPopular: true,
    features: [
      'Unlimited reports',
      'AI Risk Assistant',
      'Custom branding',
      'Priority support',
    ],
    cta: 'Choose Pro',
    href: '/signup'
  },
  {
    name: 'Enterprise',
    price: '$299',
    description: 'For large-scale operations',
    features: [
      'Team management',
      'API access',
      'Dedicated support',
      'Fraud graph visualization'
    ],
    cta: 'Contact Sales',
    href: 'mailto:sales@rentfax.app'
  }
];

const faqs = [
    {
        question: "What is a renter risk report?",
        answer: "A renter risk report is a comprehensive summary of a potential renter's history, including incidents like property damage, late payments, or rule violations, as reported by other rental operators in the RentFAX network. Our AI provides a score from 0-100 to help you make informed decisions."
    },
    {
        question: "Can renters dispute information on their report?",
        answer: "Yes. RentFAX provides a transparent dispute resolution process. Renters can submit a dispute for any incident on their report directly from their portal, and our system facilitates a review process with the reporting operator."
    },
    {
        question: "Is my data secure?",
        answer: "Absolutely. We use industry-standard encryption for all data, both in transit and at rest. Your company's data is isolated and only shared according to our strict privacy policy and with your explicit consent."
    },
    {
        question: "Can I cancel my plan at any time?",
        answer: "Yes, you can cancel your subscription at any time through the billing portal. You will retain access to your plan's features until the end of the current billing cycle."
    }
]

export default function PricingPage() {
  return (
    <div className="bg-background">
      <div className="container mx-auto py-16 px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-headline text-4xl md:text-5xl font-bold">
            Choose Your Plan
          </h1>
          <p className="text-lg text-muted-foreground mt-4 max-w-2xl mx-auto">
            Simple, transparent pricing for every rental business. No hidden fees.
          </p>
        </div>

        {/* Pricing Tiers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {tiers.map((tier) => (
            <Card key={tier.name} className={`flex flex-col ${tier.isPopular ? 'border-primary shadow-lg' : ''}`}>
              <CardHeader className="text-center">
                <CardTitle className="font-headline text-2xl">{tier.name}</CardTitle>
                <CardDescription>{tier.description}</CardDescription>
                <div className="text-4xl font-bold py-4">{tier.price}<span className="text-sm font-normal text-muted-foreground">/mo</span></div>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="space-y-3">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button asChild className={`w-full ${tier.isPopular ? '' : 'variant="outline"'}`}>
                  <Link href={tier.href}>{tier.cta}</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto mt-24">
             <div className="text-center mb-12">
                <h2 className="font-headline text-3xl font-bold">
                    Frequently Asked Questions
                </h2>
             </div>
             <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                    <AccordionItem value={`item-${index}`} key={index}>
                        <AccordionTrigger className="text-lg">{faq.question}</AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                        {faq.answer}
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>

      </div>
    </div>
  );
}
