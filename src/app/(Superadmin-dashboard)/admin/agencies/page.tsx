'use client';

import { useEffect, useState } from "react";
import { db } from "@/firebase/client";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";

import LayoutWrapper from "@/components/dashboard/LayoutWrapper";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableRow,
  TableCell,
  TableBody,
  TableHead,
  TableHeader,
} from "@/components/ui/table";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";

import { Label } from "@/components/ui/label";

export default function AgenciesPage() {
  const [agencies, setAgencies] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [openAdd, setOpenAdd] = useState(false);
  const [newAgencyName, setNewAgencyName] = useState("");
  const [newAgencyContact, setNewAgencyContact] = useState("");

  const [openManage, setOpenManage] = useState(false);
  const [selectedAgency, setSelectedAgency] = useState<any>(null);

  // Load agencies from Firestore
  const fetchAgencies = async () => {
    const snap = await getDocs(collection(db, "agencies"));
    const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setAgencies(data);
  };

  useEffect(() => {
    fetchAgencies();
  }, []);

  const filteredAgencies = agencies.filter((agency) =>
    agency.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Add new agency
  const addAgency = async () => {
    if (!newAgencyName.trim()) return;

    await addDoc(collection(db, "agencies"), {
      name: newAgencyName.trim(),
      contact: newAgencyContact.trim() || "",
      clients: 0,
      status: "pending",
      createdAt: serverTimestamp(),
    });

    setNewAgencyName("");
    setNewAgencyContact("");
    setOpenAdd(false);
    fetchAgencies();
  };

  // Update agency status
  const updateAgencyStatus = async (id: string, newStatus: string) => {
    await updateDoc(doc(db, "agencies", id), {
      status: newStatus,
      updatedAt: serverTimestamp(),
    });
    fetchAgencies();
  };

  return (
    <LayoutWrapper role="superadmin">
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Agency Management</h1>

        <div className="mb-4 flex justify-between items-center">
          <Input
            placeholder="Search agencies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />

          <Button onClick={() => setOpenAdd(true)}>Add Agency</Button>
        </div>

        <div className="bg-white rounded-lg shadow">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Agency Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Clients</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredAgencies.map((agency) => (
                <TableRow key={agency.id}>
                  <TableCell className="font-medium">{agency.name}</TableCell>
                  <TableCell>{agency.contact}</TableCell>
                  <TableCell>{agency.clients || 0}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{agency.status}</Badge>
                  </TableCell>

                  <TableCell className="space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedAgency(agency);
                        setOpenManage(true);
                      }}
                    >
                      Manage
                    </Button>

                    {agency.status === 'pending' && (
                      <Button
                        size="sm"
                        onClick={() =>
                          updateAgencyStatus(agency.id, "verified")
                        }
                      >
                        Approve
                      </Button>
                    )}

                    {agency.status === 'verified' && (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() =>
                          updateAgencyStatus(agency.id, "suspended")
                        }
                      >
                        Suspend
                      </Button>
                    )}

                    {agency.status === 'suspended' && (
                      <Button
                        size="sm"
                        onClick={() =>
                          updateAgencyStatus(agency.id, "verified")
                        }
                      >
                        Reactivate
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/** Add Agency Dialog */}
      <Dialog open={openAdd} onOpenChange={setOpenAdd}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Agency</DialogTitle>
          </DialogHeader>

          <Label>Name</Label>
          <Input
            placeholder="Agency Name"
            value={newAgencyName}
            onChange={(e) => setNewAgencyName(e.target.value)}
          />

          <Label className="mt-3">Primary Contact</Label>
          <Input
            placeholder="Contact Person"
            value={newAgencyContact}
            onChange={(e) => setNewAgencyContact(e.target.value)}
          />

          <DialogFooter>
            <Button onClick={addAgency}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/** Manage Agency Dialog */}
      <Dialog open={openManage} onOpenChange={setOpenManage}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manage Agency</DialogTitle>
          </DialogHeader>

          {selectedAgency && (
            <div className="space-y-3">
              <p><strong>Name:</strong> {selectedAgency.name}</p>
              <p><strong>Contact:</strong> {selectedAgency.contact}</p>
              <p><strong>Status:</strong> {selectedAgency.status}</p>
              <p><strong>Clients:</strong> {selectedAgency.clients}</p>

              <p className="italic text-gray-500 text-sm">
                (Future expansion: linked disputes, agency activity log, users, documents)
              </p>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenManage(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </LayoutWrapper>
  );
}
