import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import TestimonialCard from '@/components/testimonial-card';
import {
  FileText,
  UserX,
  Users,
  ShieldQuestion,
  Database,
  Search,
  CheckCircle,
} from 'lucide-react';
import Link from 'next/link';

const features = [
  {
    icon: <FileText className="w-12 h-12 text-primary" />,
    title: 'Comprehensive Risk Reports',
    description: 'Get a detailed renter profile with a risk score, flags for missed payments, and a timeline of prior rental incidents.',
    dataAiHint: 'document report',
  },
  {
    icon: <UserX className="w-12 h-12 text-primary" />,
    title: 'Unauthorized Driver Tracking',
    description: 'Receive alerts when someone other than the approved renter drives a vehicle, protecting your assets from misuse.',
    dataAiHint: 'user alert',
  },
  {
    icon: <Users className="w-12 h-12 text-primary" />,
    title: 'Friends of Debtors System',
    description: 'Our system alerts you to renters associated with individuals who have outstanding debts or negative rental histories.',
    dataAiHint: 'people connection',
  },
  {
    icon: <ShieldQuestion className="w-12 h-12 text-primary" />,
    title: 'Dispute & Evidence System',
    description: 'A transparent system that allows renters to view their report and dispute inaccuracies with evidence.',
    dataAiHint: 'legal document',
  },
];

const howItWorks = [
    {
        icon: <Database className="w-12 h-12 text-primary" />,
        title: '1. Submit Data',
        description: 'Rental companies securely log incident, payment, and behavioral data into our system.',
    },
    {
        icon: <Search className="w-12 h-12 text-primary" />,
        title: '2. Generate Report',
        description: 'Our AI generates a comprehensive risk score based on history, severity, and frequency.',
    },
    {
        icon: <CheckCircle className="w-12 h-12 text-primary" />,
        title: '3. Screen Renter',
        description: 'Query a renter’s RentFAX profile before you rent to make an informed decision.',
    },
]

const testimonials = [
  {
    quote:
      'RentFAX has completely transformed how we handle tenant screening. The AI insights are a game-changer, saving us time and preventing potential issues.',
    name: 'Sarah L.',
    title: 'Property Manager',
    avatar: 'SL',
    imageUrl: 'https://placehold.co/100x100.png',
    dataAiHint: 'woman smiling',
  },
  {
    quote:
      'The vehicle history reports are a must-have. We\'ve reduced our insurance claims and feel much more secure renting out our fleet.',
    name: 'David C.',
    title: 'Car Rental Agency Owner',
    avatar: 'DC',
    imageUrl: 'https://placehold.co/100x100.png',
    dataAiHint: 'man portrait',
  },
  {
    quote:
      'As an independent landlord, RentFAX gives me the same tools as the big companies. It\'s easy to use and provides incredible peace of mind.',
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
      <section className="w-full bg-background py-20 md:py-32">
        <div className="container mx-auto text-center px-4">
          <h1 className="font-headline text-4xl md:text-6xl font-bold tracking-tighter mb-4">
            Know Your Renter. Minimize Your Risk.
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            RentFAX generates a comprehensive Risk Score and Report by compiling behavioral, payment, and incident data from past rental experiences.
          </p>
          <div className="flex justify-center gap-4">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Link href="/services">Get Started</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="#features">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>

      <section id="features" className="w-full bg-card py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-headline text-3xl md:text-4xl font-bold">
              A Smarter Way to Screen Renters
            </h2>
            <p className="text-lg text-muted-foreground mt-2">
              Powerful tools to protect your rental business.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => (
              <Card key={feature.title} className="text-center shadow-lg hover:shadow-xl transition-shadow duration-300 border-none">
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

      <section className="w-full bg-background py-16 md:py-24">
        <div className="container mx-auto px-4">
            <div className="text-center mb-12">
                <h2 className="font-headline text-3xl md:text-4xl font-bold">
                How It Works
                </h2>
                <p className="text-lg text-muted-foreground mt-2">
                A simple process to get the insights you need.
                </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {howItWorks.map((step) => (
                    <Card key={step.title} className="text-center shadow-lg hover:shadow-xl transition-shadow duration-300 border-none">
                        <CardHeader>
                            <div className="flex justify-center mb-4">{step.icon}</div>
                            <CardTitle className="font-headline text-xl">{step.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">{step.description}</p>
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
              Hear what our users have to say about RentFAX.
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
