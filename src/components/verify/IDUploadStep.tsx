import { useState } from 'react';
import { UploadCloud } from 'lucide-react';

export function IDUploadStep({ side, onComplete }: { side: "Front" | "Back"; onComplete: (file: File) => void }) {
  const [preview, setPreview] = useState<string | null>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      onComplete(file);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Upload {side} of ID</h2>
      <p className="text-sm text-gray-600 mb-6">Make sure the image is clear and all text is readable.</p>
      <label htmlFor="id-upload" className="cursor-pointer">
        <div className="w-full h-48 bg-gray-100 rounded-lg border-2 border-dashed flex items-center justify-center text-center p-4 relative overflow-hidden">
          {preview ? (
            <img src={preview} alt={`${side} of ID preview`} className="absolute top-0 left-0 w-full h-full object-contain" />
          ) : (
            <div className="flex flex-col items-center text-gray-500">
              <UploadCloud size={40} className="mb-2"/>
              <p className="font-semibold">Click to upload or drag & drop</p>
              <p className="text-xs mt-1">PNG, JPG, or WEBP. Max 5MB.</p>
            </div>
          )}
        </div>
      </label>
      <input id="id-upload" type="file" className="hidden" onChange={handleFile} accept="image/png, image/jpeg, image/webp" />
      <button onClick={() => document.getElementById('id-upload')!.click()} className="w-full mt-4 rounded-full bg-blue-600 text-white py-3 font-semibold hover:bg-blue-700 transition">
          Choose File
      </button>
    </div>
  );
}