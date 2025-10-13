"use client";
import { useState } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "@/firebase/client";

export const useFileUpload = () => {
  const [progress, setProgress] = useState(0);

  const uploadFile = async (file: File, folder = "evidence") => {
    return new Promise<string>((resolve, reject) => {
      const fileRef = ref(storage, `${folder}/${Date.now()}_${file.name}`);
      const task = uploadBytesResumable(fileRef, file);

      task.on(
        "state_changed",
        (snap) => setProgress((snap.bytesTransferred / snap.totalBytes) * 100),
        (err) => reject(err),
        async () => {
          const url = await getDownloadURL(task.snapshot.ref);
          resolve(url);
        },
      );
    });
  };

  return { uploadFile, progress };
};
