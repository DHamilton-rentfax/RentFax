"use client";

import { useState } from "react";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { app } from "@/firebase/client";

export default function UploadIDCard({ onComplete }) {
  const [front, setFront] = useState<File | null>(null);
  const [back, setBack] = useState<File | null>(null);
  const [selfie, setSelfie] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const storage = getStorage(app);

  async function upload(file: File, name: string) {
    const path = `verifications/${Date.now()}-${name}`;
    const storageRef = ref(storage, path);

    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  }

  async function submit() {
    if (!front || !back || !selfie) return;

    setLoading(true);

    const idFrontUrl = await upload(front, "id-front");
    const idBackUrl = await upload(back, "id-back");
    const selfieUrl = await upload(selfie, "selfie");

    setLoading(false);
    onComplete({ idFrontUrl, idBackUrl, selfieUrl });
  }

  return (
    <div className="p-6 border rounded-lg shadow bg-white space-y-4">
      <h2 className="text-xl font-semibold">Upload Government ID</h2>

      <input type="file" accept="image/*" onChange={(e) => setFront(e.target.files?.[0] || null)} />
      <input type="file" accept="image/*" onChange={(e) => setBack(e.target.files?.[0] || null)} />
      <input type="file" accept="image/*" onChange={(e) => setSelfie(e.target.files?.[0] || null)} />

      <Button className="w-full" disabled={loading} onClick={submit}>
        {loading ? <Loader2 className="animate-spin" /> : "Continue"}
      </Button>
    </div>
  );
}
