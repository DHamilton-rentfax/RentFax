"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { ShieldCheck, Star, CheckCircle } from "lucide-react";

export default function PublicRenterProfile({
  params,
}: {
  params: { profileId: string };
}) {
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    if (!params.profileId) return;

    fetch(`/api/public/renter?pid=${params.profileId}`)
      .then((res) => res.json())
      .then(setProfile);
  }, [params.profileId]);

  if (!profile) return <p className="p-10">Loading Public Profile...</p>;

  return (
    <div className="p-10 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-6">
        <img
          src={profile.photoUrl}
          className="w-24 h-24 rounded-full object-cover"
          alt={profile.name}
        />

        <div>
          <h1 className="text-3xl font-semibold">{profile.name}</h1>

          {profile.verified && (
            <p className="text-green-600 flex items-center gap-1 mt-2">
              <ShieldCheck className="w-5 h-5" /> Verified Identity
            </p>
          )}
        </div>
      </div>

      <Card className="p-6 border-dashed bg-muted/40">
        <h2 className="text-xl font-semibold">
          Reputation Score: In Development
        </h2>
        <p className="text-sm text-muted-foreground mt-2">
          This feature is being improved and is not used for rental decisions.
        </p>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold">Badges</h2>

        <div className="flex gap-3 mt-3 flex-wrap">
          {profile.badges.map((b: any, i: number) => (
            <span
              key={i}
              className="px-3 py-1 rounded-full bg-blue-100 text-blue-600 text-sm flex gap-1 items-center"
            >
              <Star className="w-4 h-4" /> {b}
            </span>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold">Rental History Summary</h2>

        <ul className="space-y-3 mt-3">
          {profile.history.map((h: any, i: number) => (
            <li key={i} className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              {h}
            </li>
          ))}
        </ul>
      </Card>

      <p className="text-sm text-muted-foreground text-center mt-10">
        This profile is secured by RentFAX™ Identity & Behavior Trust Network.
      </p>
    </div>
  );
}