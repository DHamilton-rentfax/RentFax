'use client';

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import SelfieModal from "@/components/verify/SelfieModal";
import { Button } from "@/components/ui/button";
import { UploadCloud, CheckCircle, Webcam, AlertTriangle } from "lucide-react";

export default function VerifyPage() {
  const searchParams = useSearchParams();
  const verificationId = searchParams.get("id");

  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [frontId, setFrontId] = useState<File | null>(null);
  const [backId, setBackId] = useState<File | null>(null);
  const [selfie, setSelfie] = useState<File | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selfieModalOpen, setSelfieModalOpen] = useState(false);

  useEffect(() => {
    async function fetchData() {
      if (!verificationId) {
        setError("Verification ID is missing from the URL.");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/verify/${verificationId}`);
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || "Failed to fetch verification data.");
        }
        const result = await res.json();
        setData(result);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [verificationId]);

  const progress = useMemo(() => {
    const total = 3;
    let completed = 0;
    if (frontId) completed++;
    if (backId) completed++;
    if (selfie) completed++;
    return (completed / total) * 100;
  }, [frontId, backId, selfie]);

  const canSubmit = progress === 100;

  const handleSubmit = async () => {
    if (!canSubmit || isSubmitting) return;

    const formData = new FormData();
    formData.append("verifyId", verificationId!);
    if (frontId) formData.append("frontId", frontId);
    if (backId) formData.append("backId", backId);
    if (selfie) formData.append("selfie", selfie);

    try {
      setIsSubmitting(true);
      const res = await fetch("/api/identity/submit", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errBody = await res.json();
        throw new Error(errBody.error || "Submission failed");
      }

      alert("Verification submitted successfully!");
      // Potentially redirect or show a success screen

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <p className="text-center pt-20">Loading verification...</p>;
  }

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <SelfieModal
        open={selfieModalOpen}
        onClose={() => setSelfieModalOpen(false)}
        onCapture={(file: File) => {
          setSelfie(file);
          setSelfieModalOpen(false);
        }}
      />

      <h1 className="text-3xl font-bold text-gray-900 mb-2">Identity Verification</h1>
      <p className="text-gray-600 mb-6">
        {data?.fullName}, please upload the required documents to verify your identity.
      </p>

      {error && (
        <div className="bg-red-100 border border-red-300 text-red-800 rounded-lg p-3 mb-6 flex items-center">
          <AlertTriangle className="h-5 w-5 mr-3"/>
          <div>{error}</div>
        </div>
      )}

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="h-2.5 w-full bg-gray-200 rounded-full">
          <div
            className="h-2.5 bg-green-600 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-500 mt-2 text-right">{Math.round(progress)}% Complete</p>
      </div>

      <div className="space-y-6">
        {/* File Uploaders */}
        <FileUpload
          label="Front of Driver License / ID"
          file={frontId}
          onFileChange={setFrontId}
        />
        <FileUpload
          label="Back of Driver License / ID"
          file={backId}
          onFileChange={setBackId}
        />

        {/* Selfie Button */}
        <div>
          <label className="font-medium text-gray-800 mb-1 block">Live Selfie</label>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              className="w-full justify-start text-left py-6"
              onClick={() => setSelfieModalOpen(true)}
            >
              <Webcam className="h-5 w-5 mr-3 text-gray-600" />
              {selfie ? "Retake Selfie" : "Take Selfie"}
            </Button>
            {selfie && <CheckCircle className="h-7 w-7 text-green-600" />}
          </div>
        </div>
      </div>

      {/* Submit */}
      <div className="mt-10">
        <Button
          onClick={handleSubmit}
          disabled={!canSubmit || isSubmitting}
          className="w-full py-3 text-base"
        >
          {isSubmitting ? "Submitting..." : "Submit for Verification"}
        </Button>
      </div>
    </div>
  );
}

// Helper component for file uploads
function FileUpload({ label, file, onFileChange }: any) {
  return (
    <div>
      <label className="font-medium text-gray-800 mb-1 block">{label}</label>
      <div className="flex items-center gap-4">
        <label
          htmlFor={label}
          className="cursor-pointer w-full border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition"
        >
          <UploadCloud className="h-7 w-7 mx-auto text-gray-500 mb-2" />
          <span className="text-sm text-gray-600">
            {file ? file.name : "Click to upload a file"}
          </span>
          <input
            id={label}
            type="file"
            className="hidden"
            onChange={(e) => onFileChange(e.target.files?.[0] || null)}
            accept="image/png, image/jpeg"
          />
        </label>
        {file && <CheckCircle className="h-7 w-7 text-green-600" />}
      </div>
    </div>
  );
}
