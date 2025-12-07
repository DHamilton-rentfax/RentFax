"use client";
import { useEffect, useState } from "react";
import { db } from "@/firebase/client";
import { collection, getDocs } from "firebase/firestore";
import { trackDemoEvent } from "@/firebase/tracker";
import Link from "next/link";

export default function DemoRenterPage() {
  const [disputes, setDisputes] = useState<any[]>([]);

  useEffect(() => {
    trackDemoEvent("demo_renter_report_viewed");

    async function loadDemo() {
      const snap = await getDocs(collection(db, "demo_disputes"));
      const list: any[] = [];
      snap.forEach((d) => list.push({ id: d.id, ...d.data() }));
      setDisputes(list);
    }
    loadDemo();
  }, []);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">📄 Renter Demo Report</h1>
      <p className="text-gray-600">This is a sample renter view.</p>

      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold">Renter Summary</h2>
        <p>Email: demo.renter@rentfax.io</p>
        <p>Fraud Risk Score: High</p>
      </div>

      <h2 className="text-xl font-semibold mt-6">Incident & Dispute History</h2>
      {disputes.map((d) => (
        <div key={d.id} className="p-4 border rounded bg-gray-50">
          <p>
            <strong>ID:</strong> {d.id}
          </p>
          <p>
            <strong>Status:</strong> {d.status}
          </p>
          <p>
            <strong>Amount:</strong> ${d.amount}
          </p>
          <p>
            <strong>Company:</strong> {d.companyId}
          </p>
        </div>
      ))}

      <Link
        href="https://app.rentfax.io/signup?demo=1"
        onClick={() => trackDemoEvent("demo_conversion", { source: "RENTER" })}
        className="mt-6 inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        🚀 Sign Up for RentFAX
      </Link>
    </div>
  );
}
