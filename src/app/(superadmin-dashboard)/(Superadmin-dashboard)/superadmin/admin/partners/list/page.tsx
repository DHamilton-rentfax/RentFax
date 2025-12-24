"use client";

import { useEffect, useState } from "react";
import { Loader2, CheckCircle, XCircle, AlertTriangle, Search } from "lucide-react";
import { toast } from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface Partner {
  id: string;
  type: "collectionAgencies" | "legalPartners";
  companyName?: string;
  firmName?: string;
  contactName?: string;
  email: string;
  phone?: string;
  verificationStatus: string;
  docUrl?: string;
  createdAt?: any;
}

export default function AdminPartnersPage() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [filterType, setFilterType] = useState<"all" | "agency" | "legal">("all");
  const [status, setStatus] = useState<"all" | "pending" | "verified" | "rejected">("all");
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  async function fetchPartners() {
    try {
      setLoading(true);
      const url = new URL("/api/partners/list", window.location.origin);
      if (filterType !== "all") url.searchParams.set("type", filterType);
      if (status !== "all") url.searchParams.set("status", status);
      const res = await fetch(url.toString());
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Failed to fetch");
      setPartners(data.partners || []);
    } catch (err) {
      console.error(err);
      toast.error("Error fetching partners.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPartners();
  }, [filterType, status]);

  async function updateStatus(partnerId: string, type: string, newStatus: string) {
    try {
      const res = await fetch(`/api/admin/partners/update-status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ partnerId, type, newStatus }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      toast.success(`Partner marked as ${newStatus}`);
      fetchPartners();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update status.");
    }
  }

  const filtered = partners.filter((p) => {
    const text = search.toLowerCase();
    return (
      p.companyName?.toLowerCase().includes(text) ||
      p.firmName?.toLowerCase().includes(text) ||
      p.email?.toLowerCase().includes(text)
    );
  });

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[#1A2540]">Partner Management</h1>
        <Button onClick={fetchPartners}>Refresh</Button>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <Input
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as any)}
          className="border rounded-md p-2"
        >
          <option value="all">All Types</option>
          <option value="agency">Collection Agencies</option>
          <option value="legal">Legal Firms</option>
        </select>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as any)}
          className="border rounded-md p-2"
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="verified">Verified</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
        </div>
      ) : filtered.length === 0 ? (
        <p className="text-center text-gray-500">No partners found.</p>
      ) : (
        <div className="grid gap-4">
          {filtered.map((partner) => (
            <Card key={partner.id} className="p-4 border border-gray-200 bg-white rounded-xl shadow-sm">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold text-[#1A2540]">
                    {partner.companyName || partner.firmName || "Unnamed Partner"}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {partner.email} · {partner.phone || "No phone"}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {partner.type === "collectionAgencies" ? "Agency" : "Legal Partner"}
                  </p>
                </div>

                <div className="text-right">
                  {partner.verificationStatus === "verified" && (
                    <span className="text-green-600 font-semibold text-sm flex items-center justify-end gap-1">
                      <CheckCircle className="h-4 w-4" /> Verified
                    </span>
                  )}
                  {partner.verificationStatus === "pending" && (
                    <span className="text-yellow-600 font-semibold text-sm flex items-center justify-end gap-1">
                      <AlertTriangle className="h-4 w-4" /> Pending
                    </span>
                  )}
                  {partner.verificationStatus === "rejected" && (
                    <span className="text-red-600 font-semibold text-sm flex items-center justify-end gap-1">
                      <XCircle className="h-4 w-4" /> Rejected
                    </span>
                  )}
                </div>
              </div>

              {partner.docUrl && (
                <a
                  href={partner.docUrl}
                  target="_blank"
                  className="text-blue-600 text-sm underline mt-2 inline-block"
                >
                  View Uploaded Document
                </a>
              )}

              <div className="flex justify-end gap-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateStatus(partner.id, partner.type, "verified")}
                >
                  Approve
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => updateStatus(partner.id, partner.type, "rejected")}
                >
                  Reject
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => updateStatus(partner.id, partner.type, "needs_review")}
                >
                  Review
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}
