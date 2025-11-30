"use client";
import { useState } from "react";

export default function RenterVerificationPage() {
  const [front, setFront] = useState<File | null>(null);
  const [back, setBack] = useState<File | null>(null);
  const [selfie, setSelfie] = useState<File | null>(null);

  const submit = async () => {
    const form = new FormData();
    if (front) form.append("front", front);
    if (back) form.append("back", back);
    if (selfie) form.append("selfie", selfie);

    await fetch("/api/renter/verify/upload", {
      method: "POST",
      body: form
    });
  };

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-4">Identity Verification</h1>

      <input type="file" onChange={(e) => setFront(e.target.files![0])} />
      <input type="file" onChange={(e) => setBack(e.target.files![0])} />
      <input type="file" onChange={(e) => setSelfie(e.target.files![0])} />

      <button onClick={submit} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">
        Submit Verification
      </button>
    </div>
  );
}
