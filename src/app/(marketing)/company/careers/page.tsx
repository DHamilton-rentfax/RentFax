"use client";

import Link from "next/link";
import {
  Briefcase,
  Code,
  BrainCircuit,
  LineChart,
  Users,
  Palette,
  MapPin,
  Clock,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const jobCategories = {
  Engineering: { Icon: Code, color: "text-blue-500" },
  Product: { Icon: Briefcase, color: "text-purple-500" },
  "AI & Data": { Icon: BrainCircuit, color: "text-indigo-500" },
  "Growth & Marketing": { Icon: LineChart, color: "text-green-500" },
  "Customer & Operations": { Icon: Users, color: "text-orange-500" },
  "Design & Brand": { Icon: Palette, color: "text-pink-500" },
};

const jobs = [
  {
    title: "Full-Stack Engineer",
    team: "Engineering",
    location: "Remote (US)",
    type: "Full-time",
  },
  {
    title: "Backend Engineer (Firestore/Stripe)",
    team: "Engineering",
    location: "Remote",
    type: "Full-time",
  },
  {
    title: "QA Automation Engineer",
    team: "Engineering",
    location: "Remote",
    type: "Full-time",
  },
  {
    title: "Product Manager",
    team: "Product",
    location: "NYC or Remote",
    type: "Full-time",
  },
  {
    title: "UI/UX Designer",
    team: "Design & Brand",
    location: "Remote",
    type: "Contract-to-hire",
  },
  {
    title: "Growth Marketing Manager",
    team: "Growth & Marketing",
    location: "Remote",
    type: "Full-time",
  },
  {
    title: "SEO/Content Strategist",
    team: "Growth & Marketing",
    location: "Remote",
    type: "Full-time",
  },
  {
    title: "Customer Success Manager",
    team: "Customer & Operations",
    location: "Remote",
    type: "Full-time",
  },
  {
    title: "Technical Support Specialist",
    team: "Customer & Operations",
    location: "Remote",
    type: "Full-time",
  },
  {
    title: "Machine Learning Engineer",
    team: "AI & Data",
    location: "Remote",
    type: "Full-time",
  },
  {
    title: "Data Scientist (Fraud/Risk Analytics)",
    team: "AI & Data",
    location: "Remote",
    type: "Full-time",
  },
  {
    title: "Brand Designer",
    team: "Design & Brand",
    location: "Remote",
    type: "Full-time",
  },
];

export default function CareersPage() {
  return (
    <div className="bg-background">
      <div className="container mx-auto py-16 px-4">
        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="font-headline text-4xl md:text-5xl font-bold">
            Join Us in Building the Future of Rental Intelligence
          </h1>
          <p className="text-lg text-muted-foreground mt-4 max-w-3xl mx-auto">
            At RentFAX, we’re transforming how rental businesses assess risk.
            We’re building smarter tools, powered by AI and data, to help rental
            businesses thrive.
          </p>
          <Button asChild size="lg" className="mt-8">
            <Link href="#open-roles">View Open Roles</Link>
          </Button>
        </div>

        {/* Benefits Section */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {[
            {
              title: "Remote-First Culture",
              description: "Work from anywhere with a flexible schedule.",
            },
            {
              title: "Competitive Salary & Equity",
              description: "Share in the value we create together.",
            },
            {
              title: "Health & Wellness",
              description: "Comprehensive benefits for you and your family.",
            },
            {
              title: "Career Growth",
              description: "Stipends for courses, books, and conferences.",
            },
          ].map((item) => (
            <div key={item.title} className="text-center">
              <h3 className="font-semibold">{item.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        {/* Open Roles */}
        <div id="open-roles">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-3xl">
                Open Roles
              </CardTitle>
              <CardDescription>
                We're looking for talented people to join our mission. Explore
                our open positions below.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {Object.entries(jobCategories).map(
                  ([category, { Icon, color }]) => (
                    <div key={category}>
                      <h3
                        className={`text-xl font-semibold mb-4 flex items-center gap-3 ${color}`}
                      >
                        <Icon className="h-6 w-6" />
                        {category}
                      </h3>
                      <div className="border rounded-md">
                        {jobs
                          .filter((job) => job.team === category)
                          .map((job) => {
                            const JobIcon = (jobCategories as any)[job.team]
                              .Icon;
                            return (
                              <div
                                key={job.title}
                                className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 border-b last:border-b-0"
                              >
                                <div>
                                  <h4 className="font-semibold">{job.title}</h4>
                                  <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                                    <span className="flex items-center gap-2">
                                      <JobIcon
                                        className={`h-4 w-4 ${(jobCategories as any)[job.team].color}`}
                                      />
                                      {job.team}
                                    </span>
                                    <span className="flex items-center gap-2">
                                      <MapPin className="h-4 w-4" />
                                      {job.location}
                                    </span>
                                    <span className="flex items-center gap-2">
                                      <Clock className="h-4 w-4" />
                                      {job.type}
                                    </span>
                                  </div>
                                </div>
                                <Button
                                  asChild
                                  variant="secondary"
                                  className="mt-4 md:mt-0"
                                >
                                  <Link
                                    href={`/careers/apply?role=${encodeURIComponent(job.title)}`}
                                  >
                                    Apply
                                  </Link>
                                </Button>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  ),
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA */}
        <Card className="mt-16 bg-primary text-primary-foreground text-center">
          <CardHeader>
            <CardTitle className="font-headline text-3xl">
              Don’t See Your Role?
            </CardTitle>
            <CardDescription className="text-primary-foreground/80 text-base">
              We’re always looking for amazing people. If you're passionate
              about our mission, we'd love to hear from you.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild size="lg" variant="secondary">
              <Link href="/contact">Contact Us</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
