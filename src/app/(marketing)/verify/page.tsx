"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function VerifyIdentityPage() {
  const [selfie, setSelfie] = useState<File | null>(null);
  const [idPhoto, setIdPhoto] = useState<File | null>(null);

  async function submit() {
    const fd = new FormData();
    if (selfie) fd.append("selfie", selfie);
    if (idPhoto) fd.append("idPhoto", idPhoto);

    const res = await fetch("/api/renter/verify", {
      method: "POST",
      body: fd,
    });

    const data = await res.json();
    alert("Verification submitted!");
  }

  return (
    <div className="max-w-xl mx-auto p-10 space-y-6">
      <h1 className="text-3xl font-bold">Verify Your Identity</h1>
      <p className="text-gray-500">
        Upload a selfie + your government-issued ID.
      </p>

      <input type="file" accept="image/*" onChange={(e) => setSelfie(e.target.files?.[0] ?? null)} />
      <input type="file" accept="image/*" onChange={(e) => setIdPhoto(e.target.files?.[0] ?? null)} />

      <Button onClick={submit} className="w-full">
        Submit Verification
      </Button>
    </div>
  );
}
