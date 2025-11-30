"use client";

import { useEffect, useState } from "react";
import {
  collectionGroup,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "@/firebase/client";
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
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogFooter,
} from "@/components/ui/dialog";

export default function FraudCenterPage() {
  const [signals, setSignals] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [openReview, setOpenReview] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [renterDetails, setRenterDetails] = useState<any>(null);

  /** Fetch fraud signals using COLLECTION GROUP query */
  const fetchFraudSignals = async () => {
    const snap = await getDocs(collectionGroup(db, "fraud_signals"));

    const results = await Promise.all(
      snap.docs.map(async (d) => {
        const renterId = d.ref.parent.parent?.id;
        if (!renterId) return null;

        // Load renter details
        const renterSnap = await getDoc(doc(db, "renters", renterId));

        return {
          id: d.id,
          renterId,
          renter: renterSnap.data() || null,
          ...d.data(),
        };
      })
    );

    setSignals(results.filter(Boolean));
  };

  useEffect(() => {
    fetchFraudSignals();
  }, []);

  const filtered = signals.filter((s) => {
    if (!s.renter) return false;

    const fullName =
      `${s.renter.firstName} ${s.renter.lastName}`.toLowerCase();

    return (
      fullName.includes(searchTerm.toLowerCase()) ||
      s.renter.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.renterId.includes(searchTerm.toLowerCase())
    );
  });

  const openInvestigation = async (s: any) => {
    setSelected(s);
    setRenterDetails(s.renter);
    setOpenReview(true);
  };

  const markReviewed = async () => {
    if (!selected) return;

    const ref = doc(
      db,
      "renters",
      selected.renterId,
      "fraud_signals",
      selected.id
    );

    await updateDoc(ref, {
      status: "reviewed",
      updatedAt: serverTimestamp(),
    });

    setOpenReview(false);
    fetchFraudSignals();
  };

  return (
    <LayoutWrapper role="SUPER_ADMIN">
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Fraud & Risk Center</h1>

        {/* Global Search */}
        <div className="max-w-sm mb-6">
          <Input
            placeholder="Search renters by name, email, or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Main Table */}
        <div className="bg-white rounded-lg shadow">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Renter</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Risk Score</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Signals</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filtered.map((s, i) => (
                <TableRow key={i}>
                  <TableCell>
                    {s.renter ? (
                      <span className="font-medium">
                        {s.renter.firstName} {s.renter.lastName}
                      </span>
                    ) : (
                      "Unknown Renter"
                    )}
                  </TableCell>

                  <TableCell>{s.renter?.email}</TableCell>

                  <TableCell className="font-bold text-center">
                    {s.score}
                  </TableCell>

                  <TableCell>
                    <Badge
                      variant={
                        s.alert ? "destructive" : s.status === "reviewed"
                        ? "success"
                        : "warning"
                      }
                    >
                      {s.status}
                    </Badge>
                  </TableCell>

                  <TableCell>{s.signals?.length || 0}</TableCell>

                  <TableCell>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openInvestigation(s)}
                    >
                      Investigate
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* INVESTIGATION MODAL */}
        <Dialog open={openReview} onOpenChange={setOpenReview}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Fraud Investigation</DialogTitle>
            </DialogHeader>

            {selected && renterDetails && (
              <div className="space-y-4">

                {/* Renter Info */}
                <div>
                  <h3 className="font-bold text-lg mb-2">Renter Details</h3>
                  <div className="border p-3 rounded bg-gray-50 text-sm">
                    <p><strong>Name:</strong> {renterDetails.firstName} {renterDetails.lastName}</p>
                    <p><strong>Email:</strong> {renterDetails.email}</p>
                    <p><strong>Phone:</strong> {renterDetails.phone}</p>
                    <p><strong>ID:</strong> {selected.renterId}</p>
                  </div>
                </div>

                {/* Risk Score */}
                <div>
                  <h3 className="font-bold text-lg mb-2">Risk Score</h3>
                  <p className="text-2xl font-bold">{selected.score}</p>
                </div>

                {/* Signals */}
                <div>
                  <h3 className="font-bold text-lg mb-2">Fraud Signals</h3>
                  <div className="space-y-3">
                    {selected.signals?.map((sig: any, idx: number) => (
                      <div
                        key={idx}
                        className="border p-3 rounded bg-gray-50 text-sm"
                      >
                        <p><strong>Type:</strong> {sig.type}</p>
                        <p><strong>Confidence:</strong> {(sig.confidence * 100).toFixed(0)}%</p>
                        <p><strong>Explanation:</strong> {sig.explanation}</p>

                        {sig.related?.length > 0 && (
                          <p><strong>Related IDs:</strong> {sig.related.join(", ")}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <DialogFooter className="mt-6">
                  <Button onClick={markReviewed}>Mark as Reviewed</Button>
                  <Button variant="outline" onClick={() => setOpenReview(false)}>
                    Close
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
