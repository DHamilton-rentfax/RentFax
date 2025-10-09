"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/firebase/client";
import { onAuthStateChanged } from "firebase/auth";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  onSnapshot,
} from "firebase/firestore";
import Link from "next/link";

export default function RenterDashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [renter, setRenter] = useState<any>(null);
  const [incidents, setIncidents] = useState<any[]>([]);
  const [resolutions, setResolutions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Track renter auth state
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        window.location.href = "/renter/login";
        return;
      }
      setUser(currentUser);

      // Fetch renter document
      const renterRef = doc(db, "renters", currentUser.uid);
      const renterSnap = await getDoc(renterRef);
      if (renterSnap.exists()) {
        const renterData = renterSnap.data();
        setRenter(renterData);

        // Fetch linked incidents
        if (renterData.linkedIncidents?.length) {
          const incQuery = query(
            collection(db, "incidents"),
            where("__name__", "in", renterData.linkedIncidents.slice(0, 10)) // Firestore limit
          );
          const incSnap = await getDocs(incQuery);
          setIncidents(incSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
        }

        // Fetch linked resolutions
        if (renterData.linkedResolutions?.length) {
          const resQuery = query(
            collection(db, "resolutions"),
            where("__name__", "in", renterData.linkedResolutions.slice(0, 10))
          );
          const resSnap = await getDocs(resQuery);
          setResolutions(resSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
        }
      }
      setLoading(false);
    });

    return () => unsub();
  }, []);

  if (loading)
    return (
      <div className="min-h-screen flex justify-center items-center text-gray-600">
        Loading your dashboard...
      </div>
    );

  if (!renter)
    return (
      <div className="min-h-screen flex flex-col justify-center items-center text-center p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Renter Account Not Found
        </h1>
        <p className="text-gray-600 mb-4">
          Please complete your registration first.
        </p>
        <Link href="/renter/signup" className="text-blue-600 underline">
          Go to Sign Up
        </Link>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome, {renter.fullName}
        </h1>
        <p className="text-gray-600 mb-8">
          Here’s an overview of your rental record and active resolutions.
        </p>

        {/* --- Quick Stats --- */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-gray-500 text-sm mb-1">Linked Incidents</h2>
            <p className="text-2xl font-bold text-gray-900">
              {incidents.length}
            </p>
          </div>
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-gray-500 text-sm mb-1">Active Resolutions</h2>
            <p className="text-2xl font-bold text-gray-900">
              {
                resolutions.filter(
                  (r) => r.status && r.status !== "resolved"
                ).length
              }
            </p>
          </div>
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-gray-500 text-sm mb-1">Resolved Cases</h2>
            <p className="text-2xl font-bold text-gray-900">
              {
                resolutions.filter(
                  (r) => r.status && r.status === "resolved"
                ).length
              }
            </p>
          </div>
        </div>

        {/* --- Incidents Section --- */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Your Incidents
          </h2>
          {incidents.length ? (
            <div className="bg-white shadow-sm rounded-xl border border-gray-100 divide-y">
              {incidents.map((inc) => (
                <div
                  key={inc.id}
                  className="p-4 flex justify-between items-center hover:bg-gray-50 transition"
                >
                  <div>
                    <p className="font-medium text-gray-900">
                      {inc.incidentType || "Unspecified Incident"}
                    </p>
                    <p className="text-sm text-gray-600">
                      Status: {inc.status || "N/A"}
                    </p>
                  </div>
                  <span className="text-xs text-gray-400">
                    {inc.createdAt ? new Date(inc.createdAt.toDate()).toLocaleDateString() : ''}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">
              No incidents linked to your profile yet.
            </p>
          )}
        </div>

        {/* --- Resolutions Section --- */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Your Resolutions
          </h2>
          {resolutions.length ? (
            <div className="bg-white shadow-sm rounded-xl border border-gray-100 divide-y">
              {resolutions.map((res) => (
                <Link
                  key={res.id}
                  href={`/renter/resolution/${res.id}`}
                  className="p-4 flex justify-between items-center hover:bg-gray-50 transition"
                >
                  <div>
                    <p className="font-medium text-gray-900">
                      {res.summary?.slice(0, 60) || "No summary provided"}
                    </p>
                    <p className="text-sm text-gray-600">
                      Status: {res.status || "N/A"}
                    </p>
                  </div>
                  <span className="text-xs text-gray-400">
                     {res.createdAt ? new Date(res.createdAt.toDate()).toLocaleDateString() : ''}
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No active resolutions yet.</p>
          )}
        </div>

        {/* --- CTA Button --- */}
        <div className="text-center mt-10">
          <Link
            href="/renter/start-resolution"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
          >
            Start a New Resolution
          </Link>
        </div>
      </div>
    </div>
  );
}
