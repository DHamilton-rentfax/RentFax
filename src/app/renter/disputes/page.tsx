
"use client";

import { useEffect, useState } from "react";
import { dbClient, storageClient } from "@/lib/firebase-client";
import {
  collection,
  query,
  where,
  onSnapshot,
  updateDoc,
  doc,
  orderBy,
} from "firebase/firestore";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Loader2, FileText, MessageCircle, CheckCircle2 } from "lucide-react";

export default function DisputesPage() {
  const { user } = useAuth();
  const [disputes, setDisputes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

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

  if (!user)
    return (
      <div className="p-10 text-center">
        <p className="text-lg text-muted-foreground">
          Please log in to view your disputes.
        </p>
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
      <h1 className="text-4xl font-bold mb-8 text-center">My Disputes</h1>

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

                {/* Evidence Upload Section */}
                <div className="flex items-center gap-3 mb-4">
                  <Input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    className="flex-1"
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

                {/* Evidence Display */}
                {d.evidence && (
                  <a
                    href={d.evidence}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-primary hover:underline"
                  >
                    <FileText className="h-4 w-4" /> View Submitted Evidence
                  </a>
                )}

                {/* Admin Notes */}
                {d.adminNotes && (
                  <div className="mt-6 bg-muted/20 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <MessageCircle className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm font-medium text-muted-foreground">
                        Admin Notes
                      </p>
                    </div>
                    <p className="text-sm leading-relaxed">{d.adminNotes}</p>
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

                {/* Status Completed */}
                {d.status === "Resolved" && (
                  <div className="mt-6 flex items-center text-green-600">
                    <CheckCircle2 className="h-5 w-5 mr-2" />
                    <p className="text-sm font-medium">
                      This dispute has been marked as resolved.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
