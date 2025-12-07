'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/dashboard/ui/Card";
import { signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase/client";
import { useUploadPartnerDoc } from "@/hooks/use-upload-partner-doc";

export default function AgencySignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    companyName: "",
    contactName: "",
    email: "",
    phone: "",
    license: "",
    coverageAreas: "",
    password: "",
    plan: "starter",
  });
  const [loading, setLoading] = useState(false);
  const { uploadFile, uploading, progress } = useUploadPartnerDoc(form.email || "temp");
  const [docUrl, setDocUrl] = useState<string | null>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const url = await uploadFile(file);
      if (url) setDocUrl(url);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/partners/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, role: "agency", docUrl }),
      });
      const data = await res.json();
      if (data.success) {
        router.push(`/partners/checkout?role=agency&plan=${form.plan}`);
      } else {
        alert(data.error || "Registration failed.");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSignup() {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const token = await result.user.getIdToken();
      const res = await fetch("/api/partners/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: result.user.email,
          companyName: form.companyName || "Unknown Agency",
          contactName: result.user.displayName || "",
          role: "agency",
          token,
          plan: form.plan,
        }),
      });
      const data = await res.json();
      if (data.success) {
        router.push(`/partners/checkout?role=agency&plan=${form.plan}`);
      } else {
        alert(data.error || "Signup failed.");
      }
    } catch (err) {
      console.error(err);
      alert("Google signup failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center py-20">
      <Card className="max-w-lg w-full p-8 bg-white shadow-xl rounded-lg">
        <h1 className="text-2xl font-bold text-center mb-6 text-[#1A2540]">
          Register Your Collection Agency
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input placeholder="Company Name" value={form.companyName}
            onChange={(e) => setForm({ ...form, companyName: e.target.value })} required />
          <Input placeholder="Contact Name" value={form.contactName}
            onChange={(e) => setForm({ ...form, contactName: e.target.value })} required />
          <Input type="email" placeholder="Email" value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <Input placeholder="Phone Number" value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
          <Input placeholder="License Number" value={form.license}
            onChange={(e) => setForm({ ...form, license: e.target.value })} required />
          <Input placeholder="Coverage Areas (States)" value={form.coverageAreas}
            onChange={(e) => setForm({ ...form, coverageAreas: e.target.value })} />
          <select
            value={form.plan}
            onChange={(e) => setForm({ ...form, plan: e.target.value })}
            className="w-full border rounded-md p-2 text-gray-700"
          >
            <option value="starter">Starter – $49/mo</option>
            <option value="pro">Pro – $149/mo</option>
            <option value="enterprise">Enterprise – Custom</option>
          </select>
          <Input type="password" placeholder="Password (for login)"
            value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />

          <div>
            <label className="text-sm text-gray-600">Upload Business License or Certificate (PDF/PNG)</label>
            <input type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={handleFile} />
            {uploading && (
              <p className="text-xs text-blue-600 mt-1">Uploading… {Math.round(progress)}%</p>
            )}
            {docUrl && <p className="text-xs text-green-600 mt-1">File uploaded successfully ✓</p>}
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating Account..." : "Register & Continue to Billing"}
          </Button>
        </form>

        <div className="my-6 text-center text-gray-500">— or —</div>

        <Button
          onClick={handleGoogleSignup}
          className="w-full bg-white border text-gray-800 hover:bg-gray-100"
          disabled={loading}
        >
          Sign up with Google
        </Button>
      </Card>
    </main>
  );
}
