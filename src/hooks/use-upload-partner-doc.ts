'use client';

import { useState } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

import { storage } from "@/firebase/client";

export function useUploadPartnerDoc(uid: string) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  async function uploadFile(file: File) {
    if (!file || !uid) return null;
    setUploading(true);
    try {
      const fileRef = ref(storage, `partnerDocs/${uid}/${file.name}`);
      const task = uploadBytesResumable(fileRef, file);

      return await new Promise<string>((resolve, reject) => {
        task.on(
          "state_changed",
          (snap) => setProgress((snap.bytesTransferred / snap.totalBytes) * 100),
          reject,
          async () => {
            const url = await getDownloadURL(task.snapshot.ref);
            setUploading(false);
            resolve(url);
          }
        );
      });
    } catch (err) {
      console.error("Upload failed:", err);
      setUploading(false);
      return null;
    }
  }

  return { uploadFile, uploading, progress };
}
