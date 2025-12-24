"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/firebase/client";

export default function SupportContactPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault();

    await addDoc(collection(db, "support_tickets"), {
      email,
      message,
      createdAt: serverTimestamp(),
    });

    setSubmitted(true);
  };

  return (
    <main>
      <h1 className="text-4xl font-bold mb-4">Contact Support</h1>
      <p className="text-gray-600 mb-8 max-w-xl">
        Submit your question or issue and our team will follow up shortly.
      </p>

      {submitted ? (
        <p className="text-green-600 text-lg font-semibold">
          Thank you — our team will contact you shortly.
        </p>
      ) : (
        <form onSubmit={submitForm} className="max-w-xl space-y-4">
          <Input
            type="email"
            placeholder="you@example.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Textarea
            placeholder="How can we help?"
            rows={6}
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          <Button type="submit" className="bg-blue-600">
            Submit Ticket
          </Button>
        </form>
      )}
    </main>
  );
}
