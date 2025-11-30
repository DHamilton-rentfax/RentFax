"use client";

import { useEffect, useState } from "react";
import { db } from "@/firebase/client";
import { 
  collection, 
  getDocs, 
  addDoc, 
  doc, 
  updateDoc 
} from "firebase/firestore";

import LayoutWrapper from "@/components/dashboard/LayoutWrapper";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableRow, TableCell, TableBody, TableHead, TableHeader } from "@/components/ui/table";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Add Company Modal
  const [openAdd, setOpenAdd] = useState(false);
  const [newCompanyName, setNewCompanyName] = useState("");

  // Details Modal
  const [openDetails, setOpenDetails] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<any>(null);

  // Load companies from Firestore
  const fetchCompanies = async () => {
    const snap = await getDocs(collection(db, "companies"));
    const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setCompanies(data);
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const filteredCompanies = companies.filter((company) =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Add Company to Firestore
  const handleAddCompany = async () => {
    if (!newCompanyName.trim()) return;

    await addDoc(collection(db, "companies"), {
      name: newCompanyName.trim(),
      status: "pending_verification",
      ownerId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      plan: "free",
    });

    setOpenAdd(false);
    setNewCompanyName("");
    fetchCompanies();
  };

  // Company status update
  const updateStatus = async (companyId: string, newStatus: string) => {
    await updateDoc(doc(db, "companies", companyId), {
      status: newStatus,
      updatedAt: new Date(),
    });

    fetchCompanies();
  };

  return (
    <LayoutWrapper role="SUPER_ADMIN">
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Company Management</h1>

        <div className="mb-4 flex justify-between items-center">
          <Input
            placeholder="Search companies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />

          <Button onClick={() => setOpenAdd(true)}>Add Company</Button>
        </div>

        {/** Company Table */}
        <div className="bg-white rounded-lg shadow">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredCompanies.map((company) => (
                <TableRow key={company.id}>
                  <TableCell className="font-medium">{company.name}</TableCell>
                  <TableCell>
                    <Badge>{company.status}</Badge>
                  </TableCell>
                  <TableCell>{company.plan}</TableCell>

                  <TableCell className="space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedCompany(company);
                        setOpenDetails(true);
                      }}
                    >
                      Details
                    </Button>

                    {company.status === "pending_verification" && (
                      <Button
                        size="sm"
                        onClick={() => updateStatus(company.id, "active")}
                      >
                        Verify
                      </Button>
                    )}

                    {company.status === "active" && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => updateStatus(company.id, "suspended")}
                      >
                        Suspend
                      </Button>
                    )}

                    {company.status === "suspended" && (
                      <Button size="sm" onClick={() => updateStatus(company.id, "active")}>
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

      {/** Add Company Dialog */}
      <Dialog open={openAdd} onOpenChange={setOpenAdd}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Company</DialogTitle>
          </DialogHeader>

          <Label>Company Name</Label>
          <Input
            value={newCompanyName}
            onChange={(e) => setNewCompanyName(e.target.value)}
            placeholder="Enter company name"
          />

          <DialogFooter>
            <Button onClick={handleAddCompany}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/** Company Details Dialog */}
      <Dialog open={openDetails} onOpenChange={setOpenDetails}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Company Details</DialogTitle>
          </DialogHeader>

          {selectedCompany && (
            <div className="space-y-3">
              <p><strong>Name:</strong> {selectedCompany.name}</p>
              <p><strong>Status:</strong> {selectedCompany.status}</p>
              <p><strong>Plan:</strong> {selectedCompany.plan}</p>
              <p><strong>Created:</strong> {String(selectedCompany.createdAt)}</p>

              <p><strong>Owner:</strong> {selectedCompany.ownerId || "None"}</p>

              <p className="italic text-sm text-gray-500">
                (This modal will later show: users, renters, incidents, disputes)
              </p>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDetails(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </LayoutWrapper>
  );
}
