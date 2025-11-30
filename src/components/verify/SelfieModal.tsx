'use client';

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Camera, X } from "lucide-react";

export default function SelfieModal({ open, onClose, onCapture }: any) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [streamed, setStreamed] = useState(false);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setStreamed(true);
      }
    } catch (err) {
      alert("Camera permission denied");
    }
  };

  const captureImage = () => {
    const video = videoRef.current;
    if (!video) return;

    const canvas = document.createElement("canvas");
    canvas.width = 600;
    canvas.height = 600;

    const ctx = canvas.getContext("2d");
    ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], "selfie.png", { type: "image/png" });
        onCapture(file);
      }
    });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl shadow-lg max-w-sm w-full relative">
        <X
          className="absolute top-3 right-3 cursor-pointer"
          onClick={onClose}
        />

        <h2 className="text-xl font-semibold mb-4">Take a Selfie</h2>

        {!streamed ? (
          <Button onClick={startCamera} className="w-full">
            <Camera className="mr-2" /> Start Camera
          </Button>
        ) : (
          <>
            <video ref={videoRef} autoPlay className="rounded-xl mb-4" />
            <Button onClick={captureImage} className="w-full">
              Capture Selfie
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
