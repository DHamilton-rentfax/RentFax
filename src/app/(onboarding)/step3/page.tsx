
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { useAuth } from "@/hooks/use-auth.tsx";
import OnboardingProgress from "@/components/OnboardingProgress";
import { useFileUpload } from "@/hooks/use-file-upload";

export default function Step3Page() {
  const router = useRouter();
  const { user, token } = useAuth();
  const { uploading, uploadedUrl, handleUpload } = useFileUpload();

  const [form, setForm] = useState({
    logoUrl: "",
    primaryColor: "#000000",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = await handleUpload(file, `logos/${user?.uid}`);
      if (url) {
        setForm({ ...form, logoUrl: url });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/onboarding/branding", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        throw new Error("Failed to save branding");
      }

      router.push("/onboarding/step4");
    } catch (err) {
      console.error(err);
      setError("Failed to save. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-black text-white p-6">
      <div className="max-w-lg w-full bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl p-8 text-center">
        <OnboardingProgress step={3} totalSteps={5} />
        <h1 className="text-3xl font-bold mb-2">Branding</h1>
        <p className="text-gray-300 mb-6">Customize your company's appearance.</p>

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div>
            <label className="block text-sm mb-1">Company Logo</label>
            <input
              type="file"
              onChange={handleFileChange}
              className="w-full p-3 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-500"
              accept="image/*"
            />
            {uploading && <p className="text-sm text-gray-400 mt-2">Uploading...</p>}
            {uploadedUrl && <img src={uploadedUrl} alt="Logo preview" className="mt-4 h-20 w-auto" />}
          </div>
          <div>
            <label className="block text-sm mb-1">Primary Color</label>
            <input
              type="color"
              value={form.primaryColor}
              onChange={(e) => setForm({ ...form, primaryColor: e.target.value })}
              className="w-full h-12 p-1 bg-white/10 border border-white/20 rounded-xl"
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading || uploading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 py-3 rounded-xl font-medium hover:opacity-90 flex justify-center items-center gap-2 disabled:opacity-50"
          >
            {(loading || uploading) && <Loader2 className="animate-spin" size={18} />}
            {loading ? "Saving..." : "Continue"}
          </button>
        </form>
      </div>
    </main>
  );
}
