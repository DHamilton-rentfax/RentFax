
"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2, Camera, Upload, FileCheck, User, ShieldCheck } from "lucide-react";

export default function SelfVerifyPage() {
  const params = useSearchParams();
  const router = useRouter();
  const verificationId = params.get("id");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState("");

  const [idFront, setIdFront] = useState<File | null>(null);
  const [idBack, setIdBack] = useState<File | null>(null);
  const [selfie, setSelfie] = useState<File | null>(null);

  // Camera Ref (for capturing selfie)
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraActive, setCameraActive] = useState(false);

  // ============================================================
  // Load verification link data (FireStore -> renters/…)
  // ============================================================
  useEffect(() => {
    if (!verificationId) {
      setError("Missing verification ID.");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const res = await fetch(`/api/verify/get?id=${verificationId}`);
        const json = await res.json();

        if (!res.ok) throw new Error(json.error || "Verification link invalid.");

        setData(json);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [verificationId]);

  // ============================================================
  // Selfie camera activation
  // ============================================================
  const startCamera = async () => {
    setCameraActive(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });

      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      alert("Camera access denied.");
      setCameraActive(false);
    }
  };

  const captureSelfie = () => {
    if (!videoRef.current) return;

    const canvas = document.createElement("canvas");
    canvas.width = 640;
    canvas.height = 480;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      if (blob) {
        setSelfie(new File([blob], "selfie.jpg", { type: "image/jpeg" }));
        stopCamera();
      }
    });
  };

  const stopCamera = () => {
    const stream = videoRef.current?.srcObject as MediaStream;
    stream?.getTracks().forEach((t) => t.stop());
    setCameraActive(false);
  };

  // ============================================================
  // Submit verification
  // ============================================================
  const handleSubmit = async () => {
    if (!verificationId) return;

    if (!idFront || !idBack || !selfie) {
      setError("Please upload all required documents.");
      return;
    }

    setSubmitting(true);
    setError(null);

    const form = new FormData();
    form.append("verificationId", verificationId!);
    form.append("frontId", idFront);
    form.append("idBack", idBack);
    form.append("selfie", selfie);

    try {
      const res = await fetch("/api/verify/submit", {
        method: "POST",
        body: form,
      });

      const json = await res.json();

      if (!res.ok) throw new Error(json.error || "Failed to submit verification.");

      router.push(`/verify/success?id=${verificationId}`);
    } catch (e: any) {
      alert(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  // ============================================================
  // UI RENDER
  // ============================================================

  if (loading)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-700" />
        <p className="mt-3 text-sm text-gray-600">Loading verification link…</p>
      </div>
    );

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <ShieldCheck className="h-10 w-10 text-red-600" />
        <p className="mt-4 text-center text-red-700 font-medium">{error}</p>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <ShieldCheck className="h-12 w-12 text-green-600" />
        <h2 className="text-xl font-semibold mt-4">Verification Submitted</h2>
        <p className="text-gray-600 mt-2 max-w-md">
          Thank you. Your identity verification has been submitted securely.
          The landlord or property manager will review and you’ll be notified if
          any further details are needed.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex justify-center">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-md p-8">
        <h1 className="text-2xl font-semibold">Verify Your Identity</h1>
        <p className="text-gray-600 mt-1">
          This helps protect renters and landlords from fraud and ensures your
          RentFAX information is accurate.
        </p>

        <div className="mt-6 border-t pt-6">
          <h2 className="text-lg font-medium flex items-center gap-2">
            <User className="h-5 w-5" /> Your Information
          </h2>

          <div className="mt-3 text-sm text-gray-700 space-y-1">
            <p><strong>Name:</strong> {data?.name ?? "—"}</p>
            <p><strong>Email:</strong> {data?.email ?? "—"}</p>
            <p><strong>Phone:</strong> {data?.phone ?? "—"}</p>
          </div>
        </div>

        {/* Upload sections */}
        <div className="mt-8 space-y-6">
          {/* FRONT ID */}
          <div>
            <label className="font-medium">Upload ID (Front)</label>
            <div className="mt-1 flex items-center gap-3">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setIdFront(e.target.files?.[0] || null)}
              />
              {idFront && (
                <span className="text-green-600 flex items-center gap-1 text-xs font-medium">
                  <FileCheck className="h-4 w-4" /> {idFront.name}
                </span>
              )}
            </div>
          </div>

          {/* BACK ID */}
          <div>
            <label className="font-medium">Upload ID (Back)</label>
            <div className="mt-1 flex items-center gap-3">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setIdBack(e.target.files?.[0] || null)}
              />
              {idBack && (
                <span className="text-green-600 flex items-center gap-1 text-xs font-medium">
                  <FileCheck className="h-4 w-4" /> {idBack.name}
                </span>
              )}
            </div>
          </div>

          {/* SELFIE */}
          <div className="space-y-3">
            <label className="font-medium">Selfie Verification</label>
            <p className="text-xs text-gray-500">
              Please take a clear photo of your face.
            </p>

            {!cameraActive && !selfie && (
              <Button onClick={startCamera} className="w-full">
                <Camera size={18} className="mr-2" /> Open Camera
              </Button>
            )}

            {cameraActive && (
              <div className="space-y-2">
                <video ref={videoRef} autoPlay className="w-full rounded-lg" />
                <div className="flex gap-2">
                  <Button className="w-full" onClick={captureSelfie}>
                    Capture Selfie
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={stopCamera}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {selfie && (
              <p className="text-sm text-green-600 flex items-center gap-1 font-medium">
                <FileCheck className="h-4 w-4" /> {selfie.name} captured
              </p>
            )}
          </div>
        </div>

        {/* Submit */}
        {error && (
          <div className="mt-4 text-sm text-red-700 bg-red-50 p-3 rounded-lg">
            {error}
          </div>
        )}

        <Button
          className="w-full py-5 text-lg mt-8"
          onClick={handleSubmit}
          disabled={submitting}
        >
          {submitting ? (
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
          ) : null}
          Submit Verification
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          All information is encrypted & securely stored.
        </p>
      </div>
    </div>
  );
}
