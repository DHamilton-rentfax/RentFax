'use client';

import { useState } from 'react';
import { Switch } from '@/components/ui/switch'; // Assuming a ShadCN-like switch component
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // Assuming ShadCN select

// Mock API call to update permissions
async function updatePermissions(userId: string, payload: any) {
    console.log(`Updating permissions for ${userId}`, payload);
    const response = await fetch('/api/support/permissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, ...payload }),
    });
    if (!response.ok) {
        // In a real app, you would have global error handling and toast notifications
        alert("Failed to update permissions!");
        // Revert UI on failure
    }
}

// A single row in the permissions table
function PermissionRow({ user, allCategories, allSeverities }) {
    const [permissions, setPermissions] = useState(user.permissions || {
        role: 'SUPPORT_AGENT',
        scopes: {},
        actions: {
            canAssign: false,
            canEscalate: false,
            canClose: false,
            canEditArticles: false,
            canOverrideAI: false,
            canViewAuditLogs: false,
        }
    });

    const handleActionChange = (action: string, value: boolean) => {
        const newActions = { ...permissions.actions, [action]: value };
        setPermissions({ ...permissions, actions: newActions });
        updatePermissions(user.id, { actions: newActions });
    };

    const handleRoleChange = (role: string) => {
        setPermissions({ ...permissions, role });
        updatePermissions(user.id, { role });
    }

    return (
        <tr className="border-b hover:bg-gray-50">
            <td className="p-4 font-medium">{user.name} ({user.email})</td>
            <td className="p-4">
                 <Select value={permissions.role} onValueChange={handleRoleChange}>
                    <SelectTrigger className="w-48">
                        <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="SUPPORT_AGENT">Agent</SelectItem>
                        <SelectItem value="SUPPORT_ADMIN">Admin</SelectItem>
                    </SelectContent>
                </Select>
            </td>
            <td className="p-4 space-y-2">
                {Object.entries(permissions.actions).map(([action, value]) => (
                     <div key={action} className="flex items-center justify-between">
                        <label htmlFor={`${user.id}-${action}`} className="text-sm font-medium text-gray-700 capitalize">
                            {action.replace(/can/g, '')}
                        </label>
                        <Switch
                            id={`${user.id}-${action}`}
                            checked={value as boolean}
                            onCheckedChange={(newValue) => handleActionChange(action, newValue)}
                            disabled={permissions.role !== 'SUPPORT_ADMIN' && (action === 'canEditArticles' || action === 'canOverrideAI' || action === 'canViewAuditLogs')}
                        />
                    </div>
                ))}
            </td>
            {/* Add scope management UI here in a real app */}
        </tr>
    )
}

// The main component to manage all users
export function SupportPermissionsManager({ initialUsers }) {
    const [users] = useState(initialUsers);
    // Mock data for scopes
    const ALL_CATEGORIES = ['BILLING', 'DISPUTES', 'FRAUD', 'TECHNICAL'];
    const ALL_SEVERITIES = ['LOW', 'NORMAL', 'HIGH', 'CRITICAL'];

    if (!users || users.length === 0) {
        return <p>No support users found.</p>;
    }

    return (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                    <tr>
                        <th scope="col" className="px-4 py-3">User</th>
                        <th scope="col" className="px-4 py-3">Role</th>
                        <th scope="col" className="px-4 py-3">Actions</th>
                        {/* <th scope="col" className="px-4 py-3">Scopes</th> */}
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <PermissionRow key={user.id} user={user} allCategories={ALL_CATEGORIES} allSeverities={ALL_SEVERITIES} />
                    ))}
                </tbody>
            </table>
        </div>
    );
}
