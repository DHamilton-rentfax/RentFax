"use client";

import { useState } from "react";
import { db } from "@/firebase/client";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle2 } from "lucide-react";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      await addDoc(collection(db, "newsletter_subscribers"), {
        email,
        timestamp: serverTimestamp(),
      });
      setStatus("success");
      setEmail("");
    } catch (e) {
      console.error(e);
      setStatus("error");
    }
  };

  return (
    <div className="mt-20 bg-muted/30 border rounded-2xl shadow-sm p-8 text-center">
      <h3 className="text-2xl font-semibold mb-2">Stay Updated</h3>
      <p className="text-muted-foreground mb-6">
        Get the latest RentFAX insights, renter safety news, and product
        updates.
      </p>
      {status === "success" ? (
        <div className="flex flex-col items-center gap-3">
          <CheckCircle2 className="text-green-500 h-8 w-8" />
          <p className="text-green-600 font-medium">Thanks for subscribing!</p>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto"
        >
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className="flex-1"
          />
          <Button
            type="submit"
            disabled={status === "loading"}
            className="bg-primary text-primary-foreground"
          >
            {status === "loading" ? "Joining..." : "Subscribe"}
          </Button>
        </form>
      )}
      {status === "error" && (
        <p className="text-red-500 mt-3">
          Something went wrong. Please try again.
        </p>
      )}
    </div>
  );
}
