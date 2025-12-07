'use client';

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth"; // Assuming a custom hook for auth
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import VerifyPartnerModal from "@/components/admin/VerifyPartnerModal";

export default function AdminPartnersPage() {
  const { getToken } = useAuth();
  const [partners, setPartners] = useState<any[]>([]);
  const [filters, setFilters] = useState({ type: "all", status: "all" });
  const [loading, setLoading] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<any>(null);

  useEffect(() => {
    async function fetchPartners() {
      setLoading(true);
      try {
        const token = await getToken();
        const params = new URLSearchParams();
        if (filters.type !== "all") params.set("type", filters.type);
        if (filters.status !== "all") params.set("status", filters.status);

        const res = await fetch(`/api/partners/list?${params.toString()}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (data.success) setPartners(data.partners);
        else console.error("Failed to fetch partners:", data.error);
      } catch (err) {
        console.error("Error fetching partners:", err);
      } finally {
        setLoading(false);
      }
    }
    if (getToken) fetchPartners();
  }, [filters, getToken]);

  return (
    <main className="p-6 lg:p-10">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Partner Management</h1>
        <div className="flex items-center gap-4">
          <Select value={filters.type} onValueChange={(value) => setFilters({ ...filters, type: value })}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Partner Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Partner Types</SelectItem>
              <SelectItem value="agency">Agencies</SelectItem>
              <SelectItem value="legal">Legal Firms</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="verified">Verified</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </header>

      <div className="bg-white rounded-lg shadow-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Company/Firm</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={5} className="text-center">Loading partners...</TableCell></TableRow>
            ) : partners.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="text-center">No partners found.</TableCell></TableRow>
            ) : (
              partners.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.companyName || p.firmName}</TableCell>
                  <TableCell>{p.email}</TableCell>
                  <TableCell>{p.type === "collectionAgencies" ? "Agency" : "Legal"}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${p.verificationStatus === 'verified' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {p.verificationStatus}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" onClick={() => setSelectedPartner(p)}>
                      View & Verify
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {selectedPartner && (
        <VerifyPartnerModal
          partner={selectedPartner}
          onClose={() => setSelectedPartner(null)}
        />
      )}
    </main>
  );
}
