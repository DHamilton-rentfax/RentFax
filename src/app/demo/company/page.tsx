"use client";
import { useEffect, useState } from "react";
import { db } from "@/firebase/client";
import { collection, getDocs } from "firebase/firestore";
import { trackDemoEvent } from "@/firebase/tracker";
import Link from "next/link";

export default function DemoCompanyPage() {
  const [renters, setRenters] = useState<any[]>([]);

  useEffect(() => {
    trackDemoEvent("demo_company_dashboard_viewed");

    async function loadDemo() {
      const snap = await getDocs(collection(db, "demo_renters"));
      const list: any[] = [];
      snap.forEach((r) => list.push({ id: r.id, ...r.data() }));
      setRenters(list);
    }
    loadDemo();
  }, []);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">🏢 Company Demo Dashboard</h1>
      <p className="text-gray-600">
        This is a sample landlord/property manager view.
      </p>

      <h2 className="text-xl font-semibold mt-6">Uploaded Renters</h2>
      {renters.map((r) => (
        <div key={r.id} className="p-4 border rounded bg-gray-50">
          <p>
            <strong>ID:</strong> {r.id}
          </p>
          <p>
            <strong>Email:</strong> {r.email}
          </p>
          <p>
            <strong>Fraud Risk:</strong> {r.alert ? "⚠️ High" : "✅ Clean"}
          </p>
        </div>
      ))}

      <Link
        href="https://app.rentfax.io/signup?demo=1"
        onClick={() => trackDemoEvent("demo_conversion", { source: "COMPANY" })}
        className="mt-6 inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        🚀 Get Started with RentFAX
      </Link>
    </div>
  );
}
