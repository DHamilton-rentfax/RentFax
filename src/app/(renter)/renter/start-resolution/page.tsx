
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/firebase/client";
import {
  onAuthStateChanged,
} from "firebase/auth";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";

export default function StartResolutionPage() {
  const [user, setUser] = useState<any>(null);
  const [incidents, setIncidents] = useState<any[]>([]);
  const [selectedIncident, setSelectedIncident] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // 🔹 Auth check
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        window.location.href = "/renter/login";
        return;
      }
      setUser(currentUser);

      // Fetch linked incidents for dropdown
      const renterSnap = await getDoc(doc(db, "renters", currentUser.uid));
      if (renterSnap.exists()) {
        const renter = renterSnap.data();
        if (renter.linkedIncidents?.length) {
          const incQuery = query(
            collection(db, "incidents"),
            where("__name__", "in", renter.linkedIncidents.slice(0, 10))
          );
          const incSnap = await getDocs(incQuery);
          setIncidents(incSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
        }
      }
    });
    return () => unsub();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIncident || !summary.trim()) {
      alert("Please select an incident and provide your statement.");
      return;
    }

    setLoading(true);
    try {
      const newResolutionRef = await addDoc(collection(db, "resolutions"), {
        renterId: user.uid,
        incidentId: selectedIncident,
        summary: summary.trim(),
        status: "pending",
        evidenceUrls: [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      // 🔗 Update renter and incident
      await updateDoc(doc(db, "renters", user.uid), {
        linkedResolutions: arrayUnion(newResolutionRef.id),
        updatedAt: serverTimestamp(),
      });

      await updateDoc(doc(db, "incidents", selectedIncident), {
        status: "disputed",
      });

      alert("Resolution submitted successfully!");
      router.push(`/renter/resolution/${newResolutionRef.id}`);
    } catch (err: any) {
      alert("Error submitting resolution: " + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6 flex justify-center">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-2xl">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Start a New Resolution
        </h1>
        <p className="text-gray-600 mb-8">
          Submit your statement to clarify or challenge an incident reported about you.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Incident dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Related Incident
            </label>
            <select
              value={selectedIncident}
              onChange={(e) => setSelectedIncident(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">-- Choose an Incident --</option>
              {incidents.map((inc) => (
                <option key={inc.id} value={inc.id}>
                  {inc.incidentType || "Incident"} — {inc.status}
                </option>
              ))}
            </select>
          </div>

          {/* Renter statement */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Your Statement
            </label>
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              required
              placeholder="Explain your side of the story..."
              rows={6}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow-sm"
          >
            {loading ? "Submitting..." : "Submit Resolution"}
          </button>
        </form>

        <div className="mt-8 text-center">
          <a
            href="/renter/dashboard"
            className="text-blue-600 hover:underline text-sm"
          >
            ← Back to Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}
