'use client';

import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore";
import { Loader2, Search, ShieldCheck } from "lucide-react";

import { db } from "@/firebase/client";
import VerifyPartnerModal from "@/components/admin/VerifyPartnerModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";


export default function PartnerVerificationPage() {
  const [partners, setPartners] = useState<any[]>([]);
  const [filter, setFilter] = useState<"all" | "agency" | "legal">("all");
  const [statusFilter, setStatusFilter] = useState("pending");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedPartner, setSelectedPartner] = useState<any | null>(null);

  async function fetchPartners() {
    setLoading(true);
    const results: any[] = [];

    try {
      const agencyRef = collection(db, "collectionAgencies");
      const legalRef = collection(db, "legalPartners");

      if (filter === "all" || filter === "agency") {
        const aSnap = await getDocs(query(agencyRef, orderBy("createdAt", "desc"), limit(50)));
        aSnap.forEach((doc) => results.push({ id: doc.id, role: "agency", ...doc.data() }));
      }

      if (filter === "all" || filter === "legal") {
        const lSnap = await getDocs(query(legalRef, orderBy("createdAt", "desc"), limit(50)));
        lSnap.forEach((doc) => results.push({ id: doc.id, role: "legal", ...doc.data() }));
      }

      const filtered = results.filter((r) => {
        const matchesStatus =
          statusFilter === "all" ? true : r.verificationStatus === statusFilter;
        const matchesSearch =
          !search ||
          r.companyName?.toLowerCase().includes(search.toLowerCase()) ||
          r.firmName?.toLowerCase().includes(search.toLowerCase()) ||
          r.email?.toLowerCase().includes(search.toLowerCase());
        return matchesStatus && matchesSearch;
      });

      setPartners(filtered);
    } catch (err) {
      console.error("Error fetching partners:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPartners();
  }, [filter, statusFilter]);

  return (
    <main className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-[#1A2540] mb-6">
        Partner Verification Center
      </h1>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <Input
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as any)}
          className="border rounded-md p-2"
        >
          <option value="all">All Partners</option>
          <option value="agency">Collection Agencies</option>
          <option value="legal">Law Firms</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border rounded-md p-2"
        >
          <option value="pending">Pending</option>
          <option value="verified">Verified</option>
          <option value="rejected">Rejected</option>
          <option value="all">All</option>
        </select>

        <Button onClick={fetchPartners}>Refresh</Button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
        </div>
      ) : partners.length === 0 ? (
        <p className="text-gray-500 text-center">No partners found.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {partners.map((partner) => (
            <Card key={partner.id} className="p-5">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg text-[#1A2540]">
                    {partner.companyName || partner.firmName}
                  </h3>
                  <p className="text-sm text-gray-600">{partner.email}</p>
                  <p className="text-xs text-gray-400">
                    Role: {partner.role === "legal" ? "Legal Firm" : "Agency"}
                  </p>
                </div>
                {partner.verificationStatus === "verified" && (
                  <ShieldCheck className="h-5 w-5 text-green-500" />
                )}
              </div>

              <p className="text-xs text-gray-500 mt-3">
                Status:{" "}
                <span
                  className={`font-medium ${
                    partner.verificationStatus === "verified"
                      ? "text-green-600"
                      : partner.verificationStatus === "rejected"
                      ? "text-red-500"
                      : "text-yellow-600"
                  }`}
                >
                  {partner.verificationStatus || "pending"}
                </span>
              </p>

              <Button
                size="sm"
                className="mt-4 w-full"
                onClick={() => setSelectedPartner(partner)}
              >
                Review
              </Button>
            </Card>
          ))}
        </div>
      )}

      {/* Modal */}
      {selectedPartner && (
        <VerifyPartnerModal
          partner={selectedPartner}
          onClose={() => {
            setSelectedPartner(null);
            fetchPartners();
          }}
        />
      )}
    </main>
  );
}
