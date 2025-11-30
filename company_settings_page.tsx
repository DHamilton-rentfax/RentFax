'use client';

import { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { toast } from 'sonner';

import { db } from '@/firebase/client';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/dashboard/ui/Card';


export default function CompanySettingsPage() {
  const { user } = useAuth();
  const [company, setCompany] = useState<any>(null);
  const [businessType, setBusinessType] = useState('property');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    async function fetchCompany() {
      const ref = doc(db, 'companies', user.uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        setCompany(data);
        setBusinessType(data.businessType || 'property');
      }
      setLoading(false);
    }

    fetchCompany();
  }, [user]);

  async function saveSettings() {
    if (!user) return;
    try {
      await updateDoc(doc(db, 'companies', user.uid), {
        businessType,
      });
      toast.success('Settings updated successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to update settings.');
    }
  }

  if (loading) return <p className="text-gray-500">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-[#1A2540] mb-2">
          Business Type
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          Select the category that best describes your business.
        </p>

        <div className="flex flex-col md:flex-row gap-4 mb-4">
          {[
            { value: 'property', label: 'Property Rentals (Homes, Apartments)' },
            { value: 'vehicle', label: 'Vehicle Rentals (Cars, Trucks, Fleet)' },
            { value: 'equipment', label: 'Equipment Rentals (Tools, Machinery)' },
          ].map((opt) => (
            <label
              key={opt.value}
              className={`flex items-center border rounded-lg p-3 cursor-pointer ${
                businessType === opt.value
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-300'
              }`}
            >
              <input
                type="radio"
                name="businessType"
                value={opt.value}
                checked={businessType === opt.value}
                onChange={() => setBusinessType(opt.value)}
                className="mr-2"
              />
              <span className="text-sm">{opt.label}</span>
            </label>
          ))}
        </div>

        <Button onClick={saveSettings} className="mt-2">
          Save Changes
        </Button>
      </Card>
    </div>
  );
}
