'use client';

import { useEffect, useState } from "react";
import { ROLE_LABELS } from "@/lib/company/roles";
import { Modal } from "@/components/Modal"; // Assuming a modal component exists

export default function CompanyTeamPage() {
  const [team, setTeam] = useState([]);
  const [invites, setInvites] = useState([]);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("STAFF");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchTeam = () => {
    fetch("/api/company/team/list?companyId=CURRENT_COMPANY")
      .then((r) => r.json())
      .then((d) => setTeam(d.members));
  };

  const fetchInvites = () => {
    fetch("/api/company/team/invites/list?companyId=CURRENT_COMPANY")
      .then((r) => r.json())
      .then(setInvites);
  };

  useEffect(() => {
    fetchTeam();
    fetchInvites();
  }, []);

  const openModal = () => {
      if(email) setIsModalOpen(true);
  }

  const invite = async () => {
    await fetch("/api/company/team/invite", {
      method: "POST",
      body: JSON.stringify({
        companyId: "CURRENT_COMPANY",
        email,
        role,
      }),
    });
    alert("Invite Sent");
    fetchTeam();
    fetchInvites();
    setIsModalOpen(false);
    setEmail("");
  };

  const removeMember = async (userRecordId: string) => {
    if (window.confirm("Are you sure you want to remove this team member?")) {
      await fetch("/api/company/team/remove", {
        method: "POST",
        body: JSON.stringify({ userRecordId }),
      });
      fetchTeam();
    }
  };

  const cancelInvite = async (inviteId: string) => {
    if(window.confirm("Are you sure you want to cancel this invite?")) {
        await fetch("/api/company/team/invites/cancel", {
            method: "POST",
            body: JSON.stringify({ inviteId })
        });
        fetchInvites();
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-10 space-y-6">
      <h1 className="text-3xl font-semibold">Team</h1>

      {/* Invite section */}
      <div className="border p-6 rounded-xl">
        <h2 className="text-xl font-semibold mb-4">Invite Member</h2>

        <input
          className="border p-3 rounded w-full mb-3"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <select
          className="border p-3 rounded w-full mb-3"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          {Object.keys(ROLE_LABELS).map((r) => (
            <option key={r} value={r}>
              {ROLE_LABELS[r]}
            </option>
          ))}
        </select>

        <button
          className="bg-blue-600 text-white px-5 py-3 rounded"
          onClick={openModal}
        >
          Send Invite
        </button>
      </div>

      {/* Team list */}
      <div>
          <h2 className="text-2xl font-semibold mb-4">Team Members</h2>
          <div className="grid gap-4">
            {team.map((m) => (
              <div
                className="border p-4 rounded-xl flex justify-between items-center"
                key={m.id}
              >
                <div>
                  <p className="font-semibold">{m.email}</p>
                  <p className="text-sm text-muted-foreground">
                    {ROLE_LABELS[m.role]}
                  </p>
                </div>
                <button
                  className="bg-red-600 text-white px-4 py-2 rounded"
                  onClick={() => removeMember(m.id)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
      </div>

      {/* Pending Invites */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Pending Invites</h2>
        <div className="grid gap-4">
            {invites.map((i) => (
                 <div
                    className="border p-4 rounded-xl flex justify-between items-center"
                    key={i.id}
                >
                    <div>
                        <p className="font-semibold">{i.email}</p>
                        <p className="text-sm text-muted-foreground">
                            {ROLE_LABELS[i.role]}
                        </p>
                    </div>
                    <button
                        className="bg-gray-400 text-white px-4 py-2 rounded"
                        onClick={() => cancelInvite(i.id)}
                    >
                        Cancel
                    </button>
              </div>
            ))}
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <h2 className="text-xl font-bold mb-4">Confirm Invitation</h2>
          <p>Are you sure you want to invite <span className="font-semibold">{email}</span> as a <span className="font-semibold">{ROLE_LABELS[role]}</span>?</p>
          <div className="mt-6 flex justify-end space-x-4">
            <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded">Cancel</button>
            <button onClick={invite} className="px-4 py-2 bg-blue-600 text-white rounded">Confirm</button>
          </div>
      </Modal>
    </div>
  );
}
