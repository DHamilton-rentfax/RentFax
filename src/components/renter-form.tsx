"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Renter } from "@/ai/flows/renters";

import { DialogFooter } from "./ui/dialog";
import { Textarea } from "./ui/textarea";

const formSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  licenseNumber: z.string().min(1, "License number is required."),
  licenseState: z.string().length(2, "State must be 2 characters."),
  dob: z
    .string()
    .refine((val) => val && !isNaN(Date.parse(val)), {
      message: "Invalid date format",
    }),
  phone: z.string().optional(),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface RenterFormProps {
  renter?: Renter;
  onSave: () => void;
}

export default function RenterForm({ renter, onSave }: RenterFormProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: renter?.id || "",
      name: renter?.name || "",
      email: renter?.email || "",
      licenseNumber: renter?.licenseNumber || "",
      licenseState: renter?.licenseState || "",
      dob: renter?.dob || "",
      phone: renter?.phone || "",
      notes: renter?.notes || "",
    },
  });

  const onSubmit = async (values: FormData) => {
    setLoading(true);
    try {
      const { upsertRenter } = await import("@/app/actions/auth");
      await upsertRenter(values);

      toast({
        title: "Renter Saved",
        description: `${values.name} has been saved.`,
      });
      onSave();
    } catch (e: any) {
      toast({
        title: "Save Failed",
        description: e?.message ?? "Unexpected error",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input placeholder="john@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="licenseNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>License Number</FormLabel>
                <FormControl>
                  <Input placeholder="D1234567" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="licenseState"
            render={({ field }) => (
              <FormItem>
                <FormLabel>State</FormLabel>
                <FormControl>
                  <Input placeholder="CA" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="dob"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date of Birth</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Internal notes about this renter..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <DialogFooter>
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Renter
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}