
"use client";

import { useEffect, useState } from "react";
import { db } from "@/firebase/client";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { useAuth } from "@/hooks/use-auth";

export default function TeamPage() {
  const { user } = useAuth();
  const [members, setMembers] = useState<any[]>([]);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("EDITOR");

  useEffect(() => {
    async function fetchMembers() {
      if (!user) return;
      // Assuming "internalTeam" for the super admin's team management view
      const snap = await getDocs(collection(db, "teams", "internalTeam", "members"));
      const list: any[] = [];
      snap.forEach((doc) => list.push({ id: doc.id, ...doc.data() }));
      setMembers(list);
    }
    fetchMembers();
  }, [user]);

  async function inviteMember() {
    const res = await fetch("/api/invite", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        role,
        teamId: "internalTeam", // Hardcoded for the internal team management page
        invitedBy: user?.email
      })
    });
    const data = await res.json();
    if (data.success) {
      alert(`Invite sent to ${email}`);
      setEmail("");
      // Refresh member list
      const snap = await getDocs(collection(db, "teams", "internalTeam", "members"));
      const list: any[] = [];
      snap.forEach((doc) => list.push({ id: doc.id, ...doc.data() }));
      setMembers(list);
    } else {
      alert(`Error: ${data.error}`);
    }
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Internal Team Management</h1>

      {/* Invite Form */}
      <div className="flex space-x-2">
        <input
          type="email"
          placeholder="Enter email"
          className="border px-3 py-2 rounded w-64"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="ADMIN">Admin</option>
          <option value="EDITOR">Editor</option>
          <option value="SUPPORT">Support</option>
          <option value="VIEWER">Viewer</option>
        </select>
        <button onClick={inviteMember} className="bg-blue-600 text-white px-4 py-2 rounded">
          Invite
        </button>
      </div>

      {/* Members List */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Current Members</h2>
        <ul className="divide-y">
          {members.map((m) => (
            <li key={m.id} className="py-2 flex justify-between items-center">
              <div>
                <span>{m.email} — <span className="font-semibold">{m.role}</span></span>
                <p className="text-xs text-gray-500">Invited by {m.invitedBy}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
