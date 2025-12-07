"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { ShieldCheck, ShieldAlert } from "lucide-react";

export default function RenterWalletPage() {
  const [wallet, setWallet] = useState<any>(null);

  useEffect(() => {
    fetch("/api/renter/wallet")
      .then((res) => res.json())
      .then(setWallet);
  }, []);

  if (!wallet) return <p className="p-10">Loading...</p>;

  return (
    <div className="p-10 space-y-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-semibold">Identity Wallet</h1>

      <Card className="p-6 flex items-center gap-6">
        <img src={wallet.photoUrl} className="w-28 h-28 rounded-xl object-cover" />

        <div>
          <h2 className="text-2xl font-semibold">{wallet.name}</h2>
          <p className="text-muted-foreground">{wallet.email}</p>

          {wallet.verified ? (
            <p className="text-green-600 flex items-center gap-1 mt-2">
              <ShieldCheck className="w-5 h-5" /> Verified Identity
            </p>
          ) : (
            <p className="text-yellow-600 flex items-center gap-1 mt-2">
              <ShieldAlert className="w-5 h-5" /> Identity Pending Verification
            </p>
          )}

          <p className="text-sm mt-2">Confidence Score: {wallet.confidence}/100</p>
        </div>
      </Card>

      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-3">Identity History</h3>

        <ul className="space-y-2">
          {wallet.timeline.map((event: any, i: number) => (
            <li key={i} className="text-sm">
              <strong>{event.date}</strong> — {event.event}
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
