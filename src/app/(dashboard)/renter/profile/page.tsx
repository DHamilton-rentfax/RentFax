"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";

export default function RenterProfile() {
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    async function load() {
      const { getRenterProfile } = await import("@/app/actions/get-renter-profile");
      const data = await getRenterProfile();
      setProfile(data);
    }
    load();
  }, []);

  if (!profile) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8 space-y-10">
      <h1 className="text-3xl font-semibold">My Profile</h1>

      <Card className="border shadow-sm">
        <CardHeader>
          <CardTitle>Profile Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p><strong>Name:</strong> {profile.fullName}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Date of Birth:</strong> {profile.dob}</p>
          <p><strong>ID Verification:</strong> {profile.governmentID.status}</p>
        </CardContent>
      </Card>
    </div>
  );
}
