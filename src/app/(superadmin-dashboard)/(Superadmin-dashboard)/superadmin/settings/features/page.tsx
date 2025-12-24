'use client';

import { useEffect, useState } from 'react';
import { db } from '@/firebase/client';
import {
  doc,
  getDoc,
  setDoc,
} from 'firebase/firestore';
import { Card } from '@/components/dashboard/ui/Card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Loader2, Check } from 'lucide-react';

const roles = ["company", "agency", "legal", "renter"];

// A comprehensive set of potential features. This acts as the master list.
const defaultFeatures = {
  showDashboard: true,
  showReports: true,
  showAIInsights: false, 
  showBilling: true,
  showDisputes: true,
  showLegalCases: false,
  showCollections: false,
  showAnalytics: true,
  showSettings: true,
};

export default function AdminFeatureTogglesPage() {
  const [roleSettings, setRoleSettings] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchToggles() {
      const results: Record<string, any> = {};
      for (const role of roles) {
        const ref = doc(db, "featureToggles", role);
        const snap = await getDoc(ref);
        if (snap.exists()) {
            // Merge fetched data with defaults to ensure all keys are present
            results[role] = { ...defaultFeatures, ...snap.data().dashboardPreferences };
        } else {
            results[role] = defaultFeatures;
        }
      }
      setRoleSettings(results);
      setLoading(false);
    }

    fetchToggles();
  }, []);

  async function saveChanges() {
    setSaving(true);
    try {
      for (const role of roles) {
        await setDoc(
          doc(db, "featureToggles", role),
          { dashboardPreferences: roleSettings[role] },
          { merge: true }
        );
      }
      toast.success("Feature toggles updated successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save changes.");
    } finally {
      setSaving(false);
    }
  }

  function toggleFeature(role: string, key: string) {
    setRoleSettings((prev) => ({
      ...prev,
      [role]: { ...prev[role], [key]: !prev[role][key] },
    }));
  }

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  return (
    <div className="space-y-10 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-[#1A2540]">Feature Visibility Controls</h1>
        <p className="text-sm text-gray-600 mt-1">
          Enable or disable dashboard components for each user role in real-time.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {roles.map((role) => (
          <Card key={role} className="p-6">
            <h2 className="text-lg font-semibold capitalize mb-4 border-b pb-2">
              {role} Dashboard
            </h2>
            <div className="space-y-3">
              {Object.keys(defaultFeatures).map((key) => (
                <label
                  key={key}
                  className="flex items-center justify-between rounded-md p-2 cursor-pointer hover:bg-gray-50"
                >
                  <span className="text-sm text-gray-800">
                    {/* Turns 'showAIInsights' into 'Show AI Insights' */}
                    Show {key.replace("show", "").replace(/([A-Z])/g, " $1")}
                  </span>
                  <input
                    type="checkbox"
                    checked={roleSettings[role]?.[key] ?? false}
                    onChange={() => toggleFeature(role, key)}
                    className="w-5 h-5 rounded-sm accent-blue-600 focus:ring-2 focus:ring-blue-500"
                  />
                </label>
              ))}
            </div>
          </Card>
        ))}
      </div>

      <div className="flex justify-end mt-6">
        <Button onClick={saveChanges} disabled={saving} className="w-full sm:w-auto">
          {saving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Saving...</> : <><Check className="mr-2 h-4 w-4"/> Save All Changes</>}
        </Button>
      </div>
    </div>
  );
}
