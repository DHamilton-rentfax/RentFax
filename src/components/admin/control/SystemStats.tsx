"use client";

import { useEffect, useState } from "react";
import { db } from "@/firebase/client";
import { collection, getCountFromServer } from "firebase/firestore";

export default function SystemStats() {
  const [stats, setStats] = useState({
    companies: 0,
    renters: 0,
    disputes: 0,
  });

  useEffect(() => {
    async function load() {
      const companies = await getCountFromServer(collection(db, "companies"));
      const renters = await getCountFromServer(collection(db, "renterProfiles"));
      const disputes = await getCountFromServer(collection(db, "disputes"));

      setStats({
        companies: companies.data().count,
        renters: renters.data().count,
        disputes: disputes.data().count,
      });
    }

    load();
  }, []);

  return (
    <div className="grid grid-cols-3 gap-4">
      <Stat label="Companies" value={stats.companies} />
      <Stat label="Renters" value={stats.renters} />
      <Stat label="Disputes" value={stats.disputes} />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="p-4 border rounded-lg bg-white shadow-sm text-center">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-xl font-bold text-[#1A2540]">{value}</p>
    </div>
  );
}
