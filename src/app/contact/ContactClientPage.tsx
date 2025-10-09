
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { db } from "@/firebase/client";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { CheckCircle2, Mail, Building2, Phone } from "lucide-react";

export default function ContactClientPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
    inquiryType: "General",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      await addDoc(collection(db, "contact_requests"), {
        ...form,
        timestamp: serverTimestamp(),
      });
      setStatus("success");
      setForm({
        name: "",
        email: "",
        company: "",
        message: "",
        inquiryType: "General",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero */}
      <section className="py-20 text-center bg-gradient-to-b from-background to-muted/30">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl md:text-6xl font-bold mb-6"
        >
          Get in Touch with RentFAX
        </motion.h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Have questions or want to see RentFAX in action? Reach out to our team
          for a demo, partnership inquiry, or general support.
        </p>
      </section>

      {/* Contact Form */}
      <section className="py-20 px-6 md:px-20">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="bg-card border rounded-2xl shadow-lg p-8"
          >
            <h2 className="text-2xl font-semibold mb-6">
              Send Us a Message
            </h2>
            {status === "success" ? (
              <div className="flex flex-col items-center py-10">
                <CheckCircle2 className="h-12 w-12 text-green-600 mb-3" />
                <p className="text-lg font-medium">
                  Message received! We’ll get back to you shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm mb-1">Name</label>
                  <Input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Email</label>
                  <Input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Company / Organization</label>
                  <Input
                    name="company"
                    value={form.company}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Inquiry Type</label>
                  <select
                    name="inquiryType"
                    value={form.inquiryType}
                    onChange={(e) =>
                      setForm({ ...form, inquiryType: e.target.value })
                    }
                    className="w-full border rounded-md p-2 bg-background"
                  >
                    <option>General</option>
                    <option>Enterprise / API Access</option>
                    <option>Request a Demo</option>
                    <option>Partnership / Media</option>
                    <option>Support</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm mb-1">Message</label>
                  <Textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows={4}
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-primary text-primary-foreground"
                  disabled={status === "loading"}
                >
                  {status === "loading" ? "Sending..." : "Submit Message"}
                </Button>
              </form>
            )}
            {status === "error" && (
              <p className="text-red-500 text-sm mt-3">
                Something went wrong. Please try again.
              </p>
            )}
          </motion.div>

          {/* Info Section */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="flex flex-col justify-center space-y-8"
          >
            <div>
              <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                Corporate Offices
              </h3>
              <p className="text-muted-foreground">
                123 Innovation Drive, Suite 200<br />Miami, FL 33101
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary" />
                Email Us
              </h3>
              <p className="text-muted-foreground">
                info@rentfax.io
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                <Phone className="h-5 w-5 text-primary" />
                Phone
              </h3>
              <p className="text-muted-foreground">+1 (305) 555-0199</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 text-center bg-gradient-to-b from-muted/20 to-background">
        <h2 className="text-3xl font-bold mb-6">
          Ready to see RentFAX in action?
        </h2>
        <p className="text-muted-foreground mb-10">
          Join property professionals using RentFAX to make smarter rental decisions.
        </p>
        <Button
          asChild
          size="lg"
          className="bg-primary text-primary-foreground"
        >
          <a href="/how-it-works">Learn How It Works</a>
        </Button>
      </section>
    </div>
  );
}
