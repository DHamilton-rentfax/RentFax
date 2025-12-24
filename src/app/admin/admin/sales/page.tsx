"use client";

import { useState, useEffect } from "react";
import LeadBoard from "./LeadBoard";
import CreateLeadModal from "./CreateLeadModal";

export default function SalesDashboard() {
  const [leads, setLeads] = useState([]);
  const [openCreate, setOpenCreate] = useState(false);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/admin/crm/leads");
      const data = await res.json();
      setLeads(data);
    }
    load();
  }, []);

  return (
    <div className="p-8">
      <header className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Sales CRM</h1>
        <button
          onClick={() => setOpenCreate(true)}
          className="px-4 py-2 bg-black text-white rounded-lg"
        >
          New Lead
        </button>
      </header>

      <LeadBoard leads={leads} />

      <CreateLeadModal open={openCreate} onClose={() => setOpenCreate(false)} />
    </div>
  );
}
