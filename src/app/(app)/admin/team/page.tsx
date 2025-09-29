'use client';
import { useEffect, useState } from 'react';
import {
  collection,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
  updateDoc,
} from 'firebase/firestore';
import { db } from '@/firebase/client';
import { useAuth } from '@/hooks/use-auth';

export default function TeamPage() {
  const { user } = useAuth();
  const [members, setMembers] = useState<any[]>([]);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('EDITOR');
  const [loading, setLoading] = useState(false);
  const [loadingMembers, setLoadingMembers] = useState(true);

  // This should be replaced with your actual organization logic
  const orgId = user?.uid;

  async function loadMembers() {
    if (!orgId) return;
    setLoadingMembers(true);
    const snap = await getDocs(collection(db, `orgs/${orgId}/members`));
    setMembers(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    setLoadingMembers(false);
  }

  useEffect(() => {
    loadMembers();
  }, [orgId]);

  async function inviteMember() {
    if (!inviteEmail || !orgId) return;
    setLoading(true);
    const uid = crypto.randomUUID(); // Temporary ID before join
    const newMember = {
      email: inviteEmail,
      role: inviteRole,
      status: 'INVITED',
      invitedBy: user?.email || 'system',
      invitedAt: new Date(),
    };

    await setDoc(doc(db, `orgs/${orgId}/members/${uid}`), newMember);

    setMembers([ ...members, { id: uid, ...newMember}]);
    setInviteEmail('');
    setLoading(false);
  }

  async function removeMember(id: string) {
    if (!orgId) return;
    await deleteDoc(doc(db, `orgs/${orgId}/members/${id}`));
    setMembers(members.filter(m => m.id !== id));
  }

  async function changeRole(id: string, newRole: string) {
    if (!orgId) return;
    await updateDoc(doc(db, `orgs/${orgId}/members/${id}`), { role: newRole });
    setMembers(members.map(m => m.id === id ? { ...m, role: newRole } : m));
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Team Management</h1>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Invite Team Member</h2>
        <div className="flex gap-2">
          <input
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            placeholder="Email"
            className="border px-3 py-2 w-64"
          />
          <select
            value={inviteRole}
            onChange={(e) => setInviteRole(e.target.value)}
            className="border px-3 py-2"
          >
            <option value="ADMIN">Admin</option>
            <option value="EDITOR">Editor</option>
            <option value="VIEWER">Viewer</option>
          </select>
          <button
            onClick={inviteMember}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            {loading ? 'Inviting...' : 'Invite'}
          </button>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">Current Team</h2>
        <table className="w-full border text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-2">Email</th>
              <th className="p-2">Role</th>
              <th className="p-2">Status</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loadingMembers ? (
                <tr><td colSpan={4} className="p-4 text-center">Loading members...</td></tr>
            ) : members.map((m) => (
              <tr key={m.id} className="border-t">
                <td className="p-2">{m.email}</td>
                <td className="p-2">
                  <select
                    value={m.role}
                    onChange={(e) => changeRole(m.id, e.target.value)}
                    className="border px-2 py-1"
                    disabled={m.role === 'OWNER'}
                  >
                    <option value="OWNER" disabled>Owner</option>
                    <option value="ADMIN">Admin</option>
                    <option value="EDITOR">Editor</option>
                    <option value="VIEWER">Viewer</option>
                  </select>
                </td>
                <td className="p-2">{m.status}</td>
                <td className="p-2">
                  {m.role !== 'OWNER' && (
                    <button
                      onClick={() => removeMember(m.id)}
                      className="text-red-600 hover:underline"
                    >
                      Remove
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
