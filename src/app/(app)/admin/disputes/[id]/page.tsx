"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getAllDisputes } from "@/lib/admin/getAllDisputes";
import { updateDisputeStatus } from "@/lib/admin/updateDisputeStatus";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import DisputeAISummary from "@/components/admin/DisputeAISummary";

export default function AdminDisputePage() {
  const { id } = useParams();
  const router = useRouter();
  const [dispute, setDispute] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const load = async () => {
      const all = await getAllDisputes();
      const found = all.find((d) => d.id === id);
      setDispute(found);
      setStatus(found?.status || "");
      setLoading(false);
    };
    load();
  }, [id]);

  const handleStatusChange = async (newStatus: string) => {
    setUpdating(true);
    await updateDisputeStatus(id as string, newStatus);
    setStatus(newStatus);
    setUpdating(false);
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  if (!dispute)
    return (
      <p className="p-8 text-center text-destructive">Dispute not found.</p>
    );

  return (
    <div className="p-4 md:p-8">
      <Button variant="outline" onClick={() => router.back()} className="mb-4">
        ← Back to Dashboard
      </Button>
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Dispute from {dispute.name || dispute.email}</CardTitle>
          <CardDescription>
            ID: {dispute.id} | Submitted:{" "}
            {dispute.createdAt
              ? formatDistanceToNow(dispute.createdAt.toDate(), {
                  addSuffix: true,
                })
              : "N/A"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold">Renter's Statement</h3>
            <p className="text-muted-foreground bg-secondary p-3 rounded-md">
              {dispute.description}
            </p>
          </div>

          {dispute.files?.length > 0 && (
            <div>
              <h3 className="font-semibold">Evidence Files</h3>
              <ul className="list-disc ml-5 mt-1 space-y-1">
                {dispute.files.map((url: string, idx: number) => (
                  <li key={idx}>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary underline"
                    >
                      View File {idx + 1}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <DisputeAISummary dispute={dispute} />
        </CardContent>
        <CardFooter className="flex items-center gap-2 pt-6 border-t">
          <span className="text-sm font-medium">Set Status:</span>
          {["submitted", "reviewing", "resolved"].map((s) => (
            <Button
              key={s}
              variant={status === s ? "default" : "outline"}
              onClick={() => handleStatusChange(s)}
              disabled={updating}
              size="sm"
            >
              {updating && status === s && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </Button>
          ))}
        </CardFooter>
      </Card>
    </div>
  );
}
