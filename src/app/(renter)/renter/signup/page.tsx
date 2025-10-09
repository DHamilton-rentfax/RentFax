
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/firebase/client";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export default function RenterSignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    dateOfBirth: "",
    govIdLast4: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userCred = await createUserWithEmailAndPassword(auth, form.email, form.password);
      const uid = userCred.user.uid;

      await setDoc(doc(db, "renters", uid), {
        fullName: form.fullName.trim(),
        email: form.email,
        dateOfBirth: form.dateOfBirth,
        govIdLast4: form.govIdLast4,
        linkedIncidents: [],
        linkedResolutions: [],
        verified: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        role: "RENTER",
      });

      // 🔗 Call the linking API to connect incidents/resolutions
      await fetch("/api/renters/link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ renterId: uid }),
      });

      alert("Account created successfully! Redirecting to dashboard...");
      router.push("/renter/dashboard");
    } catch (err: any) {
      alert("Signup failed: " + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center items-center px-6">
      <form
        onSubmit={handleSignup}
        className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md space-y-6 border border-gray-100"
      >
        <h1 className="text-2xl font-bold text-gray-800 text-center">Create Your Renter Account</h1>

        <div>
          <label className="block text-sm font-medium text-gray-700">Full Name</label>
          <input
            type="text"
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            required
            className="mt-1 w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
          <input
            type="date"
            name="dateOfBirth"
            value={form.dateOfBirth}
            onChange={handleChange}
            required
            className="mt-1 w-full rounded-lg border-gray-300 shadow-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Last 4 of Gov ID</label>
          <input
            type="text"
            name="govIdLast4"
            value={form.govIdLast4}
            onChange={handleChange}
            maxLength={4}
            required
            className="mt-1 w-full rounded-lg border-gray-300 shadow-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            className="mt-1 w-full rounded-lg border-gray-300 shadow-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            className="mt-1 w-full rounded-lg border-gray-300 shadow-sm"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow-sm"
        >
          {loading ? "Creating Account..." : "Create Account"}
        </button>

        <p className="text-center text-sm text-gray-500 mt-3">
          Already have an account?{" "}
          <a href="/renter/login" className="text-blue-600 hover:underline">
            Log in
          </a>
        </p>
      </form>
    </div>
  );
}
