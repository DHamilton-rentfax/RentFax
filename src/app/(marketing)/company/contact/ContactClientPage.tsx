"use client";

import { Loader2, Mail, Building, Phone } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

export default function ContactClientPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    // Mock form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setLoading(false);
    toast({
      title: "Message Sent!",
      description: "Thanks for reaching out. We'll get back to you shortly.",
    });
    (e.target as HTMLFormElement).reset();
  };

  return (
    <div className="bg-background py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="font-headline text-4xl md:text-5xl font-bold">
            Get in Touch
          </h1>
          <p className="text-lg text-muted-foreground mt-4 max-w-3xl mx-auto">
            Have questions about pricing, features, or anything else? Our team
            is ready to help.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          <div className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center gap-4">
                <Mail className="w-8 h-8 text-primary" />
                <div>
                  <CardTitle>Email Us</CardTitle>
                  <CardDescription>
                    For general inquiries and support.
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <a
                  href="mailto:support@rentfax.io"
                  className="font-semibold text-primary hover:underline"
                >
                  support@rentfax.io
                </a>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center gap-4">
                <Building className="w-8 h-8 text-primary" />
                <div>
                  <CardTitle>Enterprise Sales</CardTitle>
                  <CardDescription>
                    For custom plans and integrations.
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <a
                  href="mailto:sales@rentfax.io"
                  className="font-semibold text-primary hover:underline"
                >
                  sales@rentfax.io
                </a>
              </CardContent>
            </Card>
          </div>
          <div>
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Send us a message</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea id="message" required rows={5} />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
