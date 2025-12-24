"use client";

import { useEffect, useState } from "react";

export default function NotificationSettings() {
  const [prefs, setPrefs] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/notifications/prefs")
      .then(r => r.json())
      .then(d => setPrefs(d.prefs));
  }, []);

  async function save(next: any) {
    setSaving(true);
    setPrefs(next);
    await fetch("/api/notifications/prefs", {
      method: "PUT",
      body: JSON.stringify(next),
    });
    setSaving(false);
  }

  if (!prefs) return <div className="p-8">Loading…</div>;

  return (
    <div className="max-w-3xl mx-auto py-10 space-y-6">
      <h1 className="text-3xl font-semibold">Notification Settings</h1>

      <div className="border rounded-xl p-5 bg-white space-y-4">
        <h2 className="font-semibold">Channels</h2>

        <ToggleRow
          label="In-app notifications"
          value={prefs.channels?.inApp ?? true}
          onChange={(v) => save({ ...prefs, channels: { ...prefs.channels, inApp: v } })}
        />
        <ToggleRow
          label="Email notifications"
          value={prefs.channels?.email ?? true}
          onChange={(v) => save({ ...prefs, channels: { ...prefs.channels, email: v } })}
        />
        <ToggleRow
          label="SMS notifications"
          value={prefs.channels?.sms ?? false}
          onChange={(v) => save({ ...prefs, channels: { ...prefs.channels, sms: v } })}
        />

        <ToggleRow
          label="Only send external alerts for critical events"
          value={prefs.criticalOnlyExternal ?? false}
          onChange={(v) => save({ ...prefs, criticalOnlyExternal: v })}
        />

        <div className="pt-2 text-xs text-gray-500">
          {saving ? "Saving…" : "Changes save automatically."}
        </div>
      </div>

      <div className="border rounded-xl p-5 bg-white space-y-3">
        <h2 className="font-semibold">Quiet Hours</h2>
        <p className="text-sm text-gray-600">
          External notifications (email/SMS) can be suppressed during quiet hours.
        </p>

        <div className="grid grid-cols-3 gap-3">
          <input
            className="border rounded-lg p-2"
            placeholder="Start (HH:MM)"
            value={prefs.quietHours?.start || ""}
            onChange={(e) =>
              save({
                ...prefs,
                quietHours: { ...(prefs.quietHours || {}), start: e.target.value, timezone: "America/New_York" },
              })
            }
          />
          <input
            className="border rounded-lg p-2"
            placeholder="End (HH:MM)"
            value={prefs.quietHours?.end || ""}
            onChange={(e) =>
              save({
                ...prefs,
                quietHours: { ...(prefs.quietHours || {}), end: e.target.value, timezone: "America/New_York" },
              })
            }
          />
          <input
            className="border rounded-lg p-2"
            readOnly
            value="America/New_York"
          />
        </div>
      </div>
    </div>
  );
}

function ToggleRow({ // @ts-ignore
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="text-sm">{label}</div>
      <button
        onClick={() => onChange(!value)}
        className={`px-3 py-2 rounded-lg border text-sm ${value ? "bg-black text-white" : "bg-white"}`}>
        {value ? "On" : "Off"}
      </button>
    </div>
  );
}