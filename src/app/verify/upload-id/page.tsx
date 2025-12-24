"use client";

import { useState } from "react";

export default function UploadIDPage() {
  const [file, setFile] = useState<File | null>(null);

  return (
    <div className="p-10 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Upload Your ID</h1>

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        className="border p-3 w-full rounded-lg mb-6"
      />

      <a
        href="/renter/verify/selfie"
        className="bg-blue-600 text-white px-6 py-3 rounded-lg inline-block"
      >
        Continue
      </a>
    </div>
  );
}
