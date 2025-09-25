"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

type Prefs = {
  disputes: { inApp: boolean; email: boolean };
  messages: { inApp: boolean; email: boolean };
  system: { inApp: boolean; email: boolean };
  digest: { enabled: boolean; frequency: "daily" | "weekly" };
};

export default function NotificationPrefsPage() {
  const { user } = useAuth();
  const [prefs, setPrefs] = useState<Prefs | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!user) return;
    fetch(`/api/notifications/prefs?uid=${user.uid}`)
      .then(r => r.json())
      .then(data => setPrefs(data || {
        disputes: { inApp: true, email: true },
        messages: { inApp: true, email: true },
        system: { inApp: true, email: false },
        digest: { enabled: true, frequency: "daily" },
      }));
  }, [user]);

  async function save() {
    if (!user || !prefs) return;
    await fetch("/api/notifications/prefs", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uid: user.uid, prefs }),
    });
    toast({ title: "Preferences updated" });
  }

  function toggle(category: keyof Prefs, field: "inApp" | "email") {
    if (category === "digest") return; // skip here
    setPrefs(prev =>
      prev ? { ...prev, [category]: { ...prev[category], [field]: !(prev[category] as any)[field] } } : prev
    );
  }

  if (!prefs) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Notification Preferences</h1>
      {(["disputes","messages","system"] as (keyof Prefs)[]).map(cat => (
        <div key={cat} className="mb-4">
          <h2 className="font-semibold capitalize">{cat}</h2>
          <label className="block">
            <input
              type="checkbox"
              checked={(prefs[cat] as any).inApp}
              onChange={() => toggle(cat, "inApp")}
            /> In-App
          </label>
          <label className="block">
            <input
              type="checkbox"
              checked={(prefs[cat] as any).email}
              onChange={() => toggle(cat, "email")}
            /> Email
          </label>
        </div>
      ))}

      <div className="mb-6">
        <h2 className="font-semibold">Digest Emails</h2>
        <label className="block">
          <input
            type="checkbox"
            checked={prefs.digest.enabled}
            onChange={() => setPrefs(prev => prev ? { ...prev, digest: { ...prev.digest, enabled: !prev.digest.enabled } } : prev)}
          /> Enable Digest
        </label>
        {prefs.digest.enabled && (
          <select
            value={prefs.digest.frequency}
            onChange={e => setPrefs(prev => prev ? { ...prev, digest: { ...prev.digest, frequency: e.target.value as "daily" | "weekly" } } : prev)}
            className="border p-2 rounded mt-2"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
          </select>
        )}
      </div>

      <Button onClick={save}>Save Preferences</Button>
    </div>
  );
}