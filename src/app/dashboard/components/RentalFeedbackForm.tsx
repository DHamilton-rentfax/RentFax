// ===========================================
// RentFAX | Rental Feedback Form Component
// Location: src/app/dashboard/components/RentalFeedbackForm.tsx
// ===========================================
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const feedbackSchema = z.object({
  timelinessScore: z.coerce.number().min(1).max(5),
  cleanlinessScore: z.coerce.number().min(1).max(5),
  communicationScore: z.coerce.number().min(1).max(5),
  damageReported: z.boolean().default(false),
  recommendation: z.enum(["Would rent again", "Would not rent again"]),
  notes: z.string().optional(),
});

type FeedbackFormValues = z.infer<typeof feedbackSchema>;

interface RentalFeedbackFormProps {
  renterId: string;
  rentalId: string;
  onSubmitSuccess: (data: any) => void;
}

export function RentalFeedbackForm({ renterId, rentalId, onSubmitSuccess }: RentalFeedbackFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FeedbackFormValues>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      damageReported: false,
    },
  });

  async function onSubmit(data: FeedbackFormValues) {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/rentals/end", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          renterId,
          rentalId,
          // In a real app, you'd get the current user's ID here
          submittedBy: "user_placeholder_id", 
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to submit feedback.");
      }

      onSubmitSuccess(result);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  // A simplified form structure for brevity
  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <h2 className="text-xl font-semibold">Submit Renter Feedback</h2>
      
      {/* Star ratings would be implemented here for scores */}
      <div>
        <label>Payment Timeliness</label>
        <input type="number" {...form.register("timelinessScore")} />
      </div>
      <div>
        <label>Cleanliness</label>
        <input type="number" {...form.register("cleanlinessScore")} />
      </div>
      <div>
        <label>Communication</label>
        <input type="number" {...form.register("communicationScore")} />
      </div>
      
      <div>
        <label>
          <input type="checkbox" {...form.register("damageReported")} />
          Any significant damages reported?
        </label>
      </div>

      <div>
        <label>Overall Recommendation</label>
        <select {...form.register("recommendation")}>
          <option value="Would rent again">Would rent again</option>
          <option value="Would not rent again">Would not rent again</option>
        </select>
      </div>

      <div>
        <label>Notes</label>
        <textarea {...form.register("notes")} />
      </div>

      {error && <p className="text-red-500">{error}</p>}

      <button type="submit" disabled={isLoading}>
        {isLoading ? "Submitting..." : "Submit Feedback"}
      </button>
    </form>
  );
}
