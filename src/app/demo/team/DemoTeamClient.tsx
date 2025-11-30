'use client';

import { Users, Mail, Shield, UserPlus } from 'lucide-react';
import { useState } from 'react';

const teamMembers = [
    { name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin', status: 'Active' },
    { name: 'Bob Williams', email: 'bob@example.com', role: 'Manager', status: 'Active' },
    { name: 'Charlie Brown', email: 'charlie@example.com', role: 'Agent', status: 'Pending' },
];

export default function DemoTeamClient() {
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('Agent');

  return (
    <>
        <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center gap-3">
            <Users size={36} className="text-emerald-600" /> Team Management
        </h1>
        <p className="text-lg text-gray-600 mb-8 max-w-3xl">
            Invite, manage, and set permissions for your team members.
        </p>

        {/* Invite New Member */}
        <div className="bg-white border border-gray-100 shadow-sm rounded-xl p-8 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2"><UserPlus/> Invite New Member</h2>
            <div className="flex flex-col sm:flex-row gap-4">
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="new.member@example.com"
                    className="border border-gray-300 rounded-lg px-4 py-2 w-full"
                />
                <select value={role} onChange={(e) => setRole(e.target.value)} className="border border-gray-300 rounded-lg px-4 py-2 w-full sm:w-auto">
                    <option>Agent</option>
                    <option>Manager</option>
                    <option>Admin</option>
                </select>
                <button className="px-6 py-2 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition w-full sm:w-auto">
                    Send Invite
                </button>
            </div>
        </div>

        {/* Member List */}
        <div className="bg-white border border-gray-100 shadow-sm rounded-xl p-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Current Members</h2>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-gray-200">
                            <th className="pb-3 font-semibold text-gray-600">Name</th>
                            <th className="pb-3 font-semibold text-gray-600">Role</th>
                            <th className="pb-3 font-semibold text-gray-600">Status</th>
                            <th className="pb-3 font-semibold text-gray-600"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {teamMembers.map((member) => (
                            <tr key={member.email} className="border-b border-gray-100">
                                <td className="py-4">
                                    <p className="font-medium text-gray-800">{member.name}</p>
                                    <p className="text-sm text-gray-500">{member.email}</p>
                                </td>
                                <td>
                                    <span className="flex items-center gap-2 text-gray-700">
                                        <Shield size={16} /> {member.role}
                                    </span>
                                </td>
                                <td>
                                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${member.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                        {member.status}
                                    </span>
                                </td>
                                <td className="text-right">
                                    <button className="text-sm font-medium text-red-600 hover:text-red-800">Remove</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </>
  );
}
