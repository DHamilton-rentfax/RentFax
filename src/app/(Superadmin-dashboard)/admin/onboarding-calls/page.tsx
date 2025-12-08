"use client";

import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { CheckCircle, Loader2, ClipboardList } from "lucide-react";

import { db } from "@/firebase/client";

export default function OnboardingCallsPage() {
  const [session, setSession] = useState({
    companyName: "",
    contactName: "",
    repName: "",
  });
  const [steps, setSteps] = useState([
    { id: 1, label: "Confirm account email verified", done: false },
    { id: 2, label: "Walk through RentFAX dashboard overview", done: false },
    { id: 3, label: "Create sample renter report together", done: false },
    { id: 4, label: "Explain compliance & fraud system", done: false },
    { id: 5, label: "Review billing & add-ons", done: false },
    { id: 6, label: "Schedule follow-up or mark complete", done: false },
  ]);

  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleToggle = (id: number) => {
    setSteps((prev) =>
      prev.map((s) => (s.id === id ? { ...s, done: !s.done } : s))
    );
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
        await addDoc(collection(db, "onboardingCalls"), {
        ...session,
        steps,
        completedAt: serverTimestamp(),
        });
        setSaved(true);
    } catch (error) {
        console.error("Error saving session:", error);
    }
    setLoading(false);
  };

  return (
    <main className="max-w-5xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-[#1A2540] mb-2">Onboarding Call Session</h1>
      <p className="text-gray-600">Track each call and mark steps as completed.</p>

      <div className="bg-white rounded-xl shadow-md p-6 border">
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <input
            type="text"
            placeholder="Company Name"
            value={session.companyName}
            onChange={(e) => setSession({ ...session, companyName: e.target.value })}
            className="p-3 border rounded-lg"
          />
          <input
            type="text"
            placeholder="Contact Name"
            value={session.contactName}
            onChange={(e) => setSession({ ...session, contactName: e.target.value })}
            className="p-3 border rounded-lg"
          />
          <input
            type="text"
            placeholder="Your Name (Rep)"
            value={session.repName}
            onChange={(e) => setSession({ ...session, repName: e.target.value })}
            className="p-3 border rounded-lg"
          />
        </div>

        <ul className="space-y-3">
          {steps.map((step) => (
            <li
              key={step.id}
              className={`flex justify-between items-center border p-3 rounded-lg ${
                step.done ? "bg-green-50 border-green-300" : "bg-gray-50 border-gray-200"
              }`}
            >
              <span>{step.label}</span>
              <button
                onClick={() => handleToggle(step.id)}
                className={`px-3 py-1 rounded-lg font-medium ${
                  step.done
                    ? "bg-green-600 text-white"
                    : "bg-gray-300 text-gray-700 hover:bg-gray-400"
                }`}
              >
                {step.done ? "Done" : "Mark Done"}
              </button>
            </li>
          ))}
        </ul>

        <div className="flex justify-end mt-6">
          <button
            disabled={loading || saved}
            onClick={handleSubmit}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-6 py-3 rounded-xl font-medium hover:opacity-90"
          >
            {loading && <Loader2 className="animate-spin" size={18} />}
            {saved ? <CheckCircle size={18} /> : <ClipboardList size={18} />}
            {saved ? "Saved" : "Save Session"}
          </button>
        </div>
      </div>
    </main>
  );
}
