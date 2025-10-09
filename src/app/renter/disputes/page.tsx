"use client";

import { useEffect, useState } from "react";
import { dbClient, storageClient } from "@/lib/firebase-client";
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  updateDoc,
  doc,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Upload,
  Loader2,
  FileText,
  MessageCircle,
  Plus,
  CheckCircle2,
} from "lucide-react";

export default function DisputesPage() {
  const { user, loading: authLoading } = useAuth();
  const [disputes, setDisputes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [incidentId, setIncidentId] = useState("");
  const [description, setDescription] = useState("");
  const [newFile, setNewFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Fetch disputes for current renter
  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(dbClient, "disputes"),
      where("renterId", "==", user.uid),
      orderBy("createdAt", "desc")
    );
    const unsub = onSnapshot(q, (snap) => {
      setDisputes(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
    return () => unsub();
  }, [user]);

  // File upload for existing disputes
  const handleFileUpload = async (disputeId: string) => {
    if (!selectedFile) return;
    setUploading(disputeId);
    const fileRef = ref(storageClient, `disputes/${disputeId}/${selectedFile.name}`);
    const uploadTask = uploadBytesResumable(fileRef, selectedFile);

    uploadTask.on(
      "state_changed",
      null,
      (error) => {
        console.error(error);
        setUploading(null);
      },
      async () => {
        const url = await getDownloadURL(uploadTask.snapshot.ref);
        const disputeRef = doc(dbClient, "disputes", disputeId);
        await updateDoc(disputeRef, {
          evidence: url,
          updatedAt: new Date(),
        });
        setUploading(null);
        alert("Evidence uploaded successfully!");
      }
    );
  };

  // Submit new dispute
  const handleSubmitDispute = async () => {
    if (!incidentId || !description) {
      alert("Please fill in all required fields.");
      return;
    }

    setSubmitting(true);

    try {
      let evidenceUrl = null;

      // Upload evidence file if provided
      if (newFile) {
        const fileRef = ref(storageClient, `disputes/tmp/${Date.now()}_${newFile.name}`);
        const uploadTask = uploadBytesResumable(fileRef, newFile);
        await new Promise<void>((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            null,
            reject,
            async () => {
              evidenceUrl = await getDownloadURL(uploadTask.snapshot.ref);
              resolve();
            }
          );
        });
      }

      // Create dispute
      const newDispute = {
        renterId: user?.uid,
        renterEmail: user?.email,
        incidentId,
        description,
        evidence: evidenceUrl || null,
        status: "Open",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(dbClient, "disputes"), newDispute);

      // Generate AI summary
      const aiRes = await fetch("/api/ai/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: description }),
      });
      const { summary } = await aiRes.json();
      if (summary) {
        await updateDoc(doc(dbClient, "disputes", docRef.id), { aiSummary: summary });
      }

      // Notify admin
      await fetch("/api/disputes/notify-admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          renterEmail: user?.email,
          incidentId,
          description,
        }),
      });

      setIsModalOpen(false);
      setIncidentId("");
      setDescription("");
      setNewFile(null);
      alert("✅ Dispute submitted successfully!");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to submit dispute. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
      </div>
    );

  if (!user)
    return (
      <div className="p-10 text-center">
        <h1 className="text-2xl font-semibold mb-2">Access Restricted</h1>
        <p className="text-muted-foreground">
          Please log in to view and manage your disputes.
        </p>
        <Button onClick={() => (window.location.href = "/login")} className="mt-4">
          Log In
        </Button>
      </div>
    );

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
      </div>
    );

  return (
    <div className="min-h-screen bg-background text-foreground py-12 px-6 md:px-20">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">My Disputes</h1>
        <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() =>
                window.open(`/api/disputes/pdf?uid=${user?.uid}`, "_blank")
              }
            >
              Download Dispute Report (PDF)
            </Button>
            <Button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" /> Submit New Dispute
            </Button>
        </div>
      </div>

      {disputes.length === 0 ? (
        <p className="text-center text-muted-foreground">
          You currently have no disputes.
        </p>
      ) : (
        <div className="grid gap-6">
          {disputes.map((d) => (
            <Card key={d.id} className="border rounded-2xl shadow-md">
              <CardHeader className="flex justify-between items-center">
                <CardTitle className="text-xl">
                  Incident: {d.incidentId || "N/A"}
                </CardTitle>
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    d.status === "Resolved"
                      ? "bg-green-100 text-green-700"
                      : d.status === "Under Review"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {d.status || "Open"}
                </span>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{d.description}</p>

                {d.evidence && (
                  <a
                    href={d.evidence}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-primary hover:underline mb-3"
                  >
                    <FileText className="h-4 w-4" /> View Submitted Evidence
                  </a>
                )}

                {d.adminNotes && (
                  <div className="mt-4 bg-muted/20 p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <MessageCircle className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm font-medium text-muted-foreground">
                        Admin Notes
                      </p>
                    </div>
                    <p className="text-sm">{d.adminNotes}</p>
                  </div>
                )}

                {/* AI Summary Section */}
                {d.aiSummary && (
                  <div className="mt-6 border-t pt-4">
                    <h3 className="text-lg font-semibold mb-2">
                      🤖 AI Summary
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {d.aiSummary}
                    </p>
                  </div>
                )}

                {d.status === "Resolved" && (
                  <div className="mt-6 flex items-center text-green-600">
                    <CheckCircle2 className="h-5 w-5 mr-2" />
                    <p className="text-sm font-medium">
                      This dispute has been marked as resolved.
                    </p>
                  </div>
                )}

                {/* Upload new evidence */}
                <div className="flex items-center gap-3 mt-5">
                  <Input
                    type="file"
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  />
                  <Button
                    onClick={() => handleFileUpload(d.id)}
                    disabled={!selectedFile || uploading === d.id}
                    className="flex items-center gap-2"
                  >
                    {uploading === d.id ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" /> Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4" /> Upload
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* 🧾 Submit New Dispute Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Submit New Dispute</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Incident ID"
              value={incidentId}
              onChange={(e) => setIncidentId(e.target.value)}
            />
            <Textarea
              placeholder="Describe your dispute..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
            <Input
              type="file"
              onChange={(e) => setNewFile(e.target.files?.[0] || null)}
            />
            <Button
              onClick={handleSubmitDispute}
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Submitting...
                </>
              ) : (
                "Submit Dispute"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
