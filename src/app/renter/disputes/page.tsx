
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
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Loader2 } from "lucide-react";

export default function DisputesPage() {
  const { user, loading: authLoading } = useAuth();
  const [disputes, setDisputes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<string | null>(null);

  // ✅ Only run this when user is logged in
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

  // ✅ Handle states clearly
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
      <h1 className="text-4xl font-bold mb-8 text-center">My Disputes</h1>

      {disputes.length === 0 ? (
        <p className="text-center text-muted-foreground">
          You currently have no disputes.
        </p>
      ) : (
        <div className="grid gap-6">
          {disputes.map((d) => (
            <Card key={d.id} className="border rounded-2xl shadow-md">
              <CardHeader>
                <CardTitle className="text-xl">
                  Incident: {d.incidentId || "N/A"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{d.description}</p>

                {/* Evidence Upload */}
                <div className="flex items-center gap-3">
                  <Input
                    type="file"
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  />
                  <Button
                    onClick={() => handleFileUpload(d.id)}
                    disabled={!selectedFile || uploading === d.id}
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
    </div>
  );

  async function handleFileUpload(disputeId: string) {
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
  }
}
