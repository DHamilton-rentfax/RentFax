"use client";

import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { db } from "@/firebase/client";
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


export default function ApplyPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  const role = searchParams.get("role") || "General Application";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [resume, setResume] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name || !email || !resume) {
      toast({
        title: "Missing Information",
        description: "Please fill all required fields.",
        variant: "destructive",
      });
      return;
    }
    setLoading(true);

    try {
      // Upload resume
      const storage = getStorage();
      const storageRef = ref(
        storage,
        `applications/${email}-${Date.now()}-${resume.name}`,
      );
      await uploadBytes(storageRef, resume);
      const resumeUrl = await getDownloadURL(storageRef);

      // Save application to Firestore
      await addDoc(collection(db, "applications"), {
        role,
        name,
        email,
        coverLetter,
        resumeUrl,
        createdAt: new Date().toISOString(),
        status: "new",
      });

      toast({
        title: "Application Submitted!",
        description:
          "Thank you for applying. We’ll be in touch if there's a fit.",
      });
      router.push("/careers");
    } catch (e: any) {
      toast({
        title: "Submission Failed",
        description: e.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-16 px-4 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-3xl">
            Apply for {role}
          </CardTitle>
          <CardDescription>
            We're excited to learn more about you. Please fill out the form
            below.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="coverLetter">Cover Letter</Label>
            <Textarea
              id="coverLetter"
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              rows={5}
              placeholder="Tell us why you're a great fit for this role and for RentFAX."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="resume">Resume (PDF) *</Label>
            <Input
              id="resume"
              type="file"
              accept=".pdf"
              onChange={(e) => e.target.files && setResume(e.target.files[0])}
              required
            />
          </div>
          <Button
            disabled={loading}
            onClick={handleSubmit}
            className="w-full"
            size="lg"
          >
            {loading ? <Loader2 className="animate-spin" /> : null}
            {loading ? "Submitting…" : "Submit Application"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
