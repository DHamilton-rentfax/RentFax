"use client";

import { useState, useEffect } from "react";
import { db } from "@/firebase/client";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

import LayoutWrapper from "@/components/dashboard/LayoutWrapper";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
  Table,
  TableRow,
  TableHead,
  TableHeader,
  TableCell,
  TableBody,
} from "@/components/ui/table";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function DisputesPage() {
  const [disputes, setDisputes] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [openReview, setOpenReview] = useState(false);
  const [selectedDispute, setSelectedDispute] = useState<any>(null);
  const [incidentDetails, setIncidentDetails] = useState<any>(null);
  const [renterDetails, setRenterDetails] = useState<any>(null);
  const [adminNotes, setAdminNotes] = useState("");

  // Fetch disputes from Firestore
  const fetchDisputes = async () => {
    const snap = await getDocs(collection(db, "disputes"));
    const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setDisputes(data);
  };

  // Load extra data when reviewing a dispute
  const loadDetails = async (dispute: any) => {
    setSelectedDispute(dispute);

    // Load incident
    const incidentRef = doc(db, "incidents", dispute.incidentId);
    const incidentSnap = await getDoc(incidentRef);
    setIncidentDetails(incidentSnap.exists() ? incidentSnap.data() : null);

    // Load renter
    const renterRef = doc(db, "renters", dispute.renterId);
    const renterSnap = await getDoc(renterRef);
    setRenterDetails(renterSnap.exists() ? renterSnap.data() : null);

    setAdminNotes(dispute.adminNotes || "");
    setOpenReview(true);
  };

  useEffect(() => {
    fetchDisputes();
  }, []);

  const filteredDisputes = disputes.filter((d) => {
    const matchesSearch =
      d.explanation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (d.renterId && d.renterId.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === "all" || d.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const updateStatus = async (newStatus: string) => {
    if (!selectedDispute) return;

    const disputeRef = doc(db, "disputes", selectedDispute.id);
    await updateDoc(disputeRef, {
      status: newStatus,
      adminNotes,
      updatedAt: serverTimestamp(),
    });

    setOpenReview(false);
    fetchDisputes();
  };

  return (
    <LayoutWrapper role="SUPER_ADMIN">
      <div className="p-6">

        <h1 className="text-3xl font-bold mb-6">Dispute Resolution Center</h1>

        <div className="flex gap-4 mb-4">
          <Input
            placeholder="Search disputes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />

          <select
            className="border rounded px-3 py-2"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="pending_review">Pending Review</option>
            <option value="under_investigation">Under Investigation</option>
            <option value="resolved_favor_company">Resolved - Company</option>
            <option value="resolved_favor_renter">Resolved - Renter</option>
          </select>
        </div>

        <div className="bg-white rounded-lg shadow">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Dispute ID</TableHead>
                <TableHead>Renter</TableHead>
                <TableHead>Incident</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredDisputes.map((dispute) => (
                <TableRow key={dispute.id}>
                  <TableCell className="font-mono">{dispute.id}</TableCell>
                  <TableCell>{dispute.renterId}</TableCell>
                  <TableCell>{dispute.incidentId}</TableCell>
                  <TableCell>
                    <Badge>{dispute.status}</Badge>
                  </TableCell>
                  <TableCell>
                    {dispute.createdAt
                      ? new Date(dispute.createdAt.seconds * 1000).toLocaleDateString()
                      : "—"}
                  </TableCell>
                  <TableCell>
                    <Button size="sm" variant="outline" onClick={() => loadDetails(dispute)}>
                      Review
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* REVIEW MODAL */}
        <Dialog open={openReview} onOpenChange={setOpenReview}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Review Dispute</DialogTitle>
            </DialogHeader>

            {selectedDispute && (
              <div className="space-y-4">

                <div>
                  <h3 className="font-bold text-lg mb-2">Dispute Explanation</h3>
                  <p className="text-gray-700">{selectedDispute.explanation}</p>
                </div>

                {incidentDetails && (
                  <div>
                    <h3 className="font-bold text-lg mb-2">Incident Details</h3>
                    <div className="border p-3 rounded bg-gray-50 text-sm">
                      <p><strong>Type:</strong> {incidentDetails.type}</p>
                      <p><strong>Description:</strong> {incidentDetails.description}</p>
                      <p><strong>Amount:</strong> ${incidentDetails.amount}</p>
                    </div>
                  </div>
                )}

                {renterDetails && (
                  <div>
                    <h3 className="font-bold text-lg mb-2">Renter</h3>
                    <div className="border p-3 rounded bg-gray-50 text-sm">
                      <p><strong>Name:</strong> {renterDetails.firstName} {renterDetails.lastName}</p>
                      <p><strong>Email:</strong> {renterDetails.email}</p>
                      <p><strong>Phone:</strong> {renterDetails.phone}</p>
                    </div>
                  </div>
                )}

                <div>
                  <Label>Admin Notes</Label>
                  <Textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Write internal notes here..."
                  />
                </div>

                <DialogFooter className="flex justify-between mt-4">
                  <Button
                    variant="warning"
                    onClick={() => updateStatus("under_investigation")}
                  >
                    Move to Investigation
                  </Button>

                  <Button
                    onClick={() => updateStatus("resolved_favor_company")}
                  >
                    Resolve — Company Wins
                  </Button>

                  <Button
                    variant="destructive"
                    onClick={() => updateStatus("resolved_favor_renter")}
                  >
                    Resolve — Renter Wins
                  </Button>
                </DialogFooter>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </LayoutWrapper>
  );
}
