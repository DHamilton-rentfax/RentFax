'use client';

import { useState } from "react";

// Mock user data
const mockUser = {
    companyId: 'company-123',
};

export default function SettingsPage() {
    const [user, setUser] = useState(mockUser);
    const [loading, setLoading] = useState(false);

    async function purchaseCredits(pack: number) {
        setLoading(true);
        try {
            const res = await fetch("/api/identity/credits/purchase", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    companyId: user.companyId,
                    pack,
                }),
            });

            const json = await res.json();
            if (json.url) {
                window.location.href = json.url;
            } else {
                // Handle error
                console.error("Failed to get checkout URL");
            }
        } catch (error) {
            console.error("Purchase failed", error);
        }
        setLoading(false);
    }

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-6">Company Settings</h1>
            <div className="space-y-4">
                <h2 className="text-xl font-semibold">Identity Credits</h2>
                <p className="text-gray-600">Purchase additional identity credits for your team.</p>
                <div className="flex gap-4">
                    <button
                        onClick={() => purchaseCredits(50)}
                        disabled={loading}
                        className="px-6 py-3 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800 disabled:bg-gray-400"
                    >
                        {loading ? 'Processing...' : 'Buy 50 Credits — $149'}
                    </button>

                    <button
                        onClick={() => purchaseCredits(200)}
                        disabled={loading}
                        className="px-6 py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 disabled:bg-gray-400"
                    >
                        {loading ? 'Processing...' : 'Buy 200 Credits — $299'}
                    </button>
                </div>
            </div>
        </div>
    );
}
