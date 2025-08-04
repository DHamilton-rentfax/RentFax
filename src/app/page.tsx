import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import TestimonialCard from '@/components/testimonial-card';
import {
  BarChart,
  Bot,
  CheckCircle,
  FileText,
  ShieldCheck,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const features = [
  {
    icon: <ShieldCheck className="w-12 h-12 text-primary" />,
    title: 'Comprehensive Risk Analysis',
    description: 'Our in-depth tenant screening goes beyond credit scores, giving you a complete picture of applicant risk.',
    dataAiHint: 'security analysis',
  },
  {
    icon: <FileText className="w-12 h-12 text-primary" />,
    title: 'Rental History Reports',
    description: 'Verify past rental performance and payment history to choose reliable tenants with confidence.',
    dataAiHint: 'document report',
  },
  {
    icon: <BarChart className="w-12 h-12 text-primary" />,
    title: 'Instant Background Checks',
    description: 'Get fast, reliable, and compliant background checks to streamline your leasing process.',
    dataAiHint: 'data chart',
  },
  {
    icon: <Bot className="w-12 h-12 text-primary" />,
    title: 'AI-Powered Insights',
    description: 'Leverage artificial intelligence to get smart recommendations and predict tenancy outcomes.',
    dataAiHint: 'robot intelligence',
  },
];

const testimonials = [
  {
    quote:
      'Rentfax has completely transformed how we handle tenant screening. The AI insights are a game-changer, saving us time and preventing potential issues.',
    name: 'Sarah L.',
    title: 'Property Manager',
    avatar: 'SL',
    imageUrl: 'https://placehold.co/100x100.png',
    dataAiHint: 'woman smiling',
  },
  {
    quote:
      'The detailed rental history reports are invaluable. We make more informed decisions and have seen a significant decrease in late payments.',
    name: 'Michael B.',
    title: 'Real Estate Investor',
    avatar: 'MB',
    imageUrl: 'https://placehold.co/100x100.png',
    dataAiHint: 'man portrait',
  },
  {
    quote:
      'As an independent landlord, Rentfax gives me the same tools as the big companies. It\'s easy to use and provides incredible peace of mind.',
    name: 'Jessica T.',
    title: 'Landlord',
    avatar: 'JT',
    imageUrl: 'https://placehold.co/100x100.png',
    dataAiHint: 'woman portrait',
  },
];

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      <section className="w-full bg-card py-20 md:py-32">
        <div className="container mx-auto text-center px-4">
          <h1 className="font-headline text-4xl md:text-6xl font-bold tracking-tighter mb-4">
            Smarter Rentals, Secured.
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Leverage data-driven insights and AI-powered screening to find the
            most reliable tenants for your properties.
          </p>
          <div className="flex justify-center gap-4">
            <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <Link href="/services">Get Started</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="#features">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>

      <section id="features" className="w-full py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-headline text-3xl md:text-4xl font-bold">
              Why Choose Rentfax?
            </h2>
            <p className="text-lg text-muted-foreground mt-2">
              Everything you need to make confident leasing decisions.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => (
              <Card key={feature.title} className="text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <div className="flex justify-center mb-4">{feature.icon}</div>
                  <CardTitle className="font-headline text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full bg-card py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-headline text-3xl md:text-4xl font-bold">
              Trusted by Professionals
            </h2>
            <p className="text-lg text-muted-foreground mt-2">
              Hear what our users have to say about Rentfax.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.name} {...testimonial} />
            ))}
          </div>
           <div className="text-center mt-12">
            <Button asChild variant="link" className="text-primary text-lg">
              <Link href="/success-stories">View All Success Stories →</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
