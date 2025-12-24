'use client';

import { useEffect, useState } from "react";

export default function DeliveryMonitor() {
    const [deliveries, setDeliveries] = useState<any[]>([]);

    useEffect(() => {
        fetch("/api/admin/deliveries")
            .then(r => r.json())
            .then(d => setDeliveries(d.deliveries));
    }, []);

    return (
        <div className="max-w-6xl mx-auto py-10 space-y-6">
            <h1 className="text-3xl font-semibold">Message Deliveries</h1>

            <div className="border rounded-xl divide-y">
                {deliveries.map(d => (
                    <div key={d.id} className="p-4">
                        <div className="font-semibold">
                            {d.channel.toUpperCase()} • {d.status}
                        </div>
                        <div className="text-sm text-gray-600">
                            To: {d.to}
                        </div>
                        <pre className="bg-gray-100 p-2 rounded text-xs mt-2">
                            {d.renderedBody}
                        </pre>
                        {d.error && (
                            <div className="text-xs text-red-600 mt-1">
                                Error: {d.error}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}