"use client";

import { useState, useEffect } from "react";
import { db } from "@/firebase/client";
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { useAuth } from "@/hooks/use-auth";
import { usePlan } from "@/hooks/usePlan";
import { Card } from "./ui/Card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Mail } from "lucide-react";

export default function TeamInvitePanel() {
  const { user } = useAuth();
  const { plan } = usePlan();
  const [team, setTeam] = useState<any[]>([]);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const seatLimit =
    plan === "free"
      ? 1
      : plan === "starter"
      ? 3
      : plan === "pro"
      ? 10
      : plan === "enterprise"
      ? 100
      : 1;

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "teamMembers"), where("ownerId", "==", user.uid));
    const unsub = onSnapshot(q, (snap) =>
      setTeam(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    );
    return () => unsub();
  }, [user]);

  const handleInvite = async () => {
    if (!email.trim()) return;
    if (team.length >= seatLimit) {
      alert("Seat limit reached. Please upgrade your plan.");
      return;
    }
    setLoading(true);
    try {
      await addDoc(collection(db, "teamInvites"), {
        invitedBy: user.uid,
        email: email.toLowerCase(),
        plan,
        status: "pending",
        createdAt: serverTimestamp(),
      });
      setEmail("");
      alert("Invite sent successfully!");
    } catch (err) {
      console.error("Invite error:", err);
      alert("Failed to send invite.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">Team Members</h3>

      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <Input
          placeholder="Invite teammate by email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1"
        />
        <Button onClick={handleInvite} disabled={loading}>
          {loading ? <Loader2 className="animate-spin h-4 w-4" /> : <Mail className="h-4 w-4" />}
          <span className="ml-2">Invite</span>
        </Button>
      </div>

      <p className="text-xs text-gray-500 mb-4">
        Seats used: {team.length} / {seatLimit}
      </p>

      <div className="space-y-2">
        {team.length === 0 ? (
          <p className="text-gray-500 text-sm">No team members yet.</p>
        ) : (
          team.map((member) => (
            <div
              key={member.id}
              className="flex justify-between items-center bg-gray-50 px-3 py-2 rounded-md border"
            >
              <span className="text-sm text-gray-700">{member.email}</span>
              <span className="text-xs text-gray-500">{member.role ?? "Member"}</span>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
