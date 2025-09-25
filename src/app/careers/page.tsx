
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building, Code, Zap, BarChart2, MessageCircle, PenTool, MapPin } from 'lucide-react';
import Link from "next/link";

const jobCategories = {
  "Engineering & Product": { icon: Code, color: "text-blue-500" },
  "AI & Data": { icon: Zap, color: "text-purple-500" },
  "Growth & Marketing": { icon: BarChart2, color: "text-pink-500" },
  "Customer & Operations": { icon: MessageCircle, color: "text-green-500" },
  "Design & Brand": { icon: PenTool, color: "text-orange-500" },
};

const allJobs = [
  { team: "Engineering & Product", title: "Full-Stack Engineer (Next.js + Firebase)", location: "Remote" },
  { team: "Engineering & Product", title: "Backend Engineer (Firestore/Stripe)", location: "Remote" },
  { team: "AI & Data", title: "Machine Learning Engineer", location: "Remote (US)" },
  { team: "Growth & Marketing", title: "Growth Marketing Manager", location: "New York, NY" },
  { team: "Customer & Operations", title: "Customer Success Manager", location: "Remote" },
  { team: "Design & Brand", title: "UI/UX Designer", location: "Remote" },
];

export default function CareersPage() {
  const [filter, setFilter] = useState("All");

  const filteredJobs =
    filter === "All"
      ? allJobs
      : allJobs.filter((job) => job.team === filter);

  return (
    <div className="bg-background">
      {/* Hero */}
      <section className="py-20 md:py-32 bg-secondary border-b">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold font-headline tracking-tight">
            Join Us in Redefining Rental Risk Intelligence
          </h1>
          <p className="mt-6 max-w-3xl mx-auto text-lg text-muted-foreground">
            At RentFAX, we’re transforming how rental businesses assess risk. We’re building smarter tools, powered by AI and data, to help rental businesses thrive.
          </p>
          <Button asChild size="lg" className="mt-8">
            <a href="#open-roles">View Open Roles</a>
          </Button>
        </div>
      </section>

      {/* Why Work Here */}
       <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold font-headline text-center mb-12">
            Why Work at RentFAX?
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 text-center">
            {
              ['Remote-first culture', 'Fast-growing SaaS', 'Competitive salary & equity', 'Health & wellness benefits', 'Career development'].map(perk => (
                <div key={perk} className="flex flex-col items-center">
                   <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary mb-4">
                     <Building className="h-6 w-6"/>
                   </div>
                  <h3 className="font-semibold">{perk}</h3>
                </div>
              ))
            }
          </div>
        </div>
      </section>


      {/* Open Roles */}
      <section id="open-roles" className="py-20 bg-secondary">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold font-headline text-center mb-12">
            Open Roles
          </h2>
          <div className="flex flex-col md:flex-row gap-8">
            {/* Filters */}
            <aside className="md:w-1/4 lg:w-1/5">
              <h3 className="font-semibold mb-4">Departments</h3>
              <ul className="space-y-2">
                {["All", ...Object.keys(jobCategories)].map(cat => (
                  <li key={cat}>
                    <button 
                      onClick={() => setFilter(cat)}
                      className={`w-full text-left p-2 rounded-md ${filter === cat ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
                    >
                      {cat}
                    </button>
                  </li>
                ))}
              </ul>
            </aside>
            
            {/* Job Grid */}
            <div className="flex-1 space-y-6">
              {filteredJobs.length > 0 ? (
                filteredJobs.map((job, idx) => (
                  <Card key={idx} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <h3 className="text-lg font-semibold">{job.title}</h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                           <span className="flex items-center gap-2">
                            {(jobCategories as any)[job.team].icon({className: `h-4 w-4 ${(jobCategories as any)[job.team].color}`})}
                            {job.team}
                          </span>
                           <span className="flex items-center gap-2">
                            <MapPin className="h-4 w-4"/>
                            {job.location}
                          </span>
                        </div>
                      </div>
                      <Button asChild className="mt-4 sm:mt-0">
                        <Link href="#">Apply</Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-12">No open roles in this department. Check back soon!</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
           <h2 className="text-3xl font-bold font-headline">
            Don't see your role?
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
            We're always looking for talented and passionate people to join our mission. If you believe you're a great fit, we'd love to hear from you.
          </p>
          <Button asChild size="lg" className="mt-8">
            <Link href="mailto:careers@rentfax.ai">Send Your Resume</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
