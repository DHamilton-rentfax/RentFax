'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { auth } from "@/firebase/client";
import { useUploadPartnerDoc } from "@/hooks/use-upload-partner-doc";

export default function LegalSignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    firmName: "",
    contactName: "",
    email: "",
    phone: "",
    barNumber: "",
    jurisdiction: "",
    password: "",
    plan: "standard",
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
        body: JSON.stringify({ ...form, role: "legal", docUrl }),
      });
      const data = await res.json();
      if (data.success) {
        router.push(`/partners/checkout?role=legal&plan=${form.plan}`);
      } else alert(data.error || "Signup failed.");
    } catch (err) {
      console.error(err);
      alert("Error during signup.");
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
          firmName: form.firmName || "Unknown Firm",
          contactName: result.user.displayName || "",
          role: "legal",
          token,
          plan: form.plan,
        }),
      });
      const data = await res.json();
      if (data.success) router.push(`/partners/checkout?role=legal&plan=${form.plan}`);
      else alert(data.error || "Signup failed.");
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
          Register Your Law Firm
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input placeholder="Firm Name" value={form.firmName}
            onChange={(e) => setForm({ ...form, firmName: e.target.value })} required />
          <Input placeholder="Contact Name" value={form.contactName}
            onChange={(e) => setForm({ ...form, contactName: e.target.value })} required />
          <Input type="email" placeholder="Email" value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <Input placeholder="Phone" value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
          <Input placeholder="Bar Number" value={form.barNumber}
            onChange={(e) => setForm({ ...form, barNumber: e.target.value })} required />
          <Input placeholder="Jurisdiction (State)" value={form.jurisdiction}
            onChange={(e) => setForm({ ...form, jurisdiction: e.target.value })} />
          <select
            value={form.plan}
            onChange={(e) => setForm({ ...form, plan: e.target.value })}
            className="w-full border rounded-md p-2 text-gray-700"
          >
            <option value="standard">Standard – $99/mo</option>
            <option value="priority">Priority – $249/mo</option>
            <option value="enterprise">Enterprise – Custom</option>
          </select>
          <Input type="password" placeholder="Password" value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          <div>
            <label className="text-sm text-gray-600">Upload Bar Certificate / Firm License</label>
            <input type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={handleFile} />
            {uploading && <p className="text-xs text-blue-600 mt-1">Uploading … {Math.round(progress)}%</p>}
            {docUrl && <p className="text-xs text-green-600 mt-1">File uploaded successfully ✓</p>}
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Registering..." : "Register & Continue to Billing"}
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
