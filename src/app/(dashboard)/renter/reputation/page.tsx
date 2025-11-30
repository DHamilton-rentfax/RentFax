"use client";

import { useEffect, useState } from "react";
import { db } from "@/firebase/client";
import { doc, getDoc, collection, getDocs, query, where } from "firebase/firestore";
import { useAuth } from "@/hooks/use-auth";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import LifeLineBar from "@/components/renter/LifeLineBar";

export default function ReputationOverviewPage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [incidents, setIncidents] = useState([]);
  const [disputes, setDisputes] = useState([]);
  const [fraud, setFraud] = useState(null);

  useEffect(() => {
    if (!user) return;

    const load = async () => {
      const profSnap = await getDoc(doc(db, "renters", user.uid));
      setProfile(profSnap.exists() ? profSnap.data() : null);

      const incSnap = await getDocs(
        query(collection(db, "incidents"), where("renterId", "==", user.uid))
      );
      setIncidents(incSnap.docs.map((d) => ({ id: d.id, ...d.data() })));

      const dispSnap = await getDocs(
        query(collection(db, "disputes"), where("renterId", "==", user.uid))
      );
      setDisputes(dispSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
    };

    load();
  }, [user]);

  if (!profile) return <div>Loading...</div>;

  return (
    <div className="space-y-8">
      
      {/* HEADER */}
      <Card>
        <CardHeader>
          <CardTitle>Your Prestige Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            This section shows your reputation, badges, and rental history prestige.
          </p>
        </CardContent>
      </Card>

      {/* LIFE LINE */}
      <LifeLineBar incidents={incidents} disputes={disputes} fraud={fraud} />

      {/* BADGES */}
      <Card>
        <CardHeader><CardTitle>Your Badges</CardTitle></CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">

            {/* Example badges */}
            <BadgeCard title="On-Time Returns" description="Completed 10 rentals with no late returns." />
            <BadgeCard title="Zero Fraud Flags" description="Your profile has never triggered any fraud alerts." />
            <BadgeCard title="Excellent Standing" description="Reputation score above 90." />
            <BadgeCard title="Verified ID" description="Your identity has been fully verified." />

            {/* Coming soon */}
            <ComingSoonBadge title="RentFAX Elite Member" />
            <ComingSoonBadge title="Partner Rewards Access" />
            <ComingSoonBadge title="Prestige Travel Benefits" />

          </div>
        </CardContent>
      </Card>

    </div>
  );
}

function BadgeCard({ title, description }: any) {
  return (
    <div className="border rounded-lg p-4 w-60 bg-white shadow-sm">
      <p className="font-semibold">{title}</p>
      <p className="text-xs text-gray-500">{description}</p>
    </div>
  );
}

function ComingSoonBadge({ title }: any) {
  return (
    <div className="border rounded-lg p-4 w-60 bg-gray-100 opacity-60 relative">
      <p className="font-semibold">{title}</p>
      <p className="text-xs text-gray-500">Coming Soon</p>

      <span className="absolute top-2 right-2 text-[10px] bg-black text-white px-2 py-0.5 rounded">
        COMING SOON
      </span>
    </div>
  );
}
