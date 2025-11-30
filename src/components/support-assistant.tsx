"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Send, Lightbulb } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSupport } from "@/app/(marketing)/support/actions";

const formSchema = z.object({
  query: z.string().min(10, "Please enter a query of at least 10 characters."),
});

type FormValues = z.infer<typeof formSchema>;

const getErrorMessage = (error: unknown): string => {
  if (!error) return "";
  if (typeof error === "string") return error;
  if (error instanceof Error) return error.message;
  try {
    return JSON.stringify(error);
  } catch {
    return "An unknown error occurred.";
  }
};

export default function SupportAssistant() {
  const [isLoading, setIsLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [error, setError] = useState<unknown>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { query: "" },
  });

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    setAiResponse(null);
    setError(null);
    try {
      const response = await getSupport({ query: data.query });
      setAiResponse(response.relevantResource);
    } catch (e) {
      setError(e);
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2">
          <FormField
            control={form.control}
            name="query"
            render={({ field }) => (
              <FormItem className="flex-grow">
                <FormControl>
                  <Input
                    placeholder="e.g., How do I check rental history?"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="mt-1" />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
            <span className="sr-only">Submit</span>
          </Button>
        </form>
      </Form>
      {aiResponse && (
        <Card className="bg-secondary">
          <CardHeader className="flex flex-row items-center gap-2 pb-2">
            <Lightbulb className="h-5 w-5 text-accent" />
            <CardTitle className="text-lg font-headline">
              Suggested Resource
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>{aiResponse}</p>
          </CardContent>
        </Card>
      )}
      {error && (
        <Card className="bg-destructive/10 border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive text-lg">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-destructive">{getErrorMessage(error)}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
