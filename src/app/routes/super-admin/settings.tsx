"use client";

import { useState, useEffect } from "react";
import { db } from "@/firebase/client";
import { doc, updateDoc } from "firebase/firestore";
import { useAdminSettings } from "@/hooks/use-admin-settings";

export default function AdminSettingsPage() {
  const { settings, loading } = useAdminSettings();
  const [formData, setFormData] = useState({
    alertThreshold: 10,
    autoResolve: true,
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (settings) {
      setFormData({
        alertThreshold: settings.alertThreshold ?? 10,
        autoResolve: settings.autoResolve ?? true,
      });
    }
  }, [settings]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : Number(value),
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const ref = doc(db, "config", "admin-settings");
      await updateDoc(ref, {
        ...formData,
        lastUpdated: new Date(),
      });
      setMessage("✅ Settings updated successfully.");
    } catch (error) {
      console.error("Error updating settings:", error);
      setMessage("❌ Failed to update settings.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="p-6">Loading settings...</p>;

  return (
    <div className="max-w-xl mx-auto bg-white shadow-md rounded-xl p-8 mt-10">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        ⚙️ Admin Settings
      </h1>

      <div className="space-y-6">
        {/* Alert Threshold */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Alert Threshold
          </label>
          <input
            type="number"
            name="alertThreshold"
            min="1"
            max="100"
            value={formData.alertThreshold}
            onChange={handleChange}
            className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Auto Resolve Toggle */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            name="autoResolve"
            checked={formData.autoResolve}
            onChange={handleChange}
            className="w-5 h-5 text-blue-600"
          />
          <label className="text-gray-700">Enable Auto-Resolve</label>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>

        {message && (
          <p
            className={`mt-3 font-medium ${
              message.startsWith("✅") ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
