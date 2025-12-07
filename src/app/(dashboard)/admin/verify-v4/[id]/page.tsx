"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";

export default function VerifyV4Page({ params }: any) {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/verify-v4/details?id=${params.id}`)
      .then((res) => res.json())
      .then(setData);
  }, []);

  if (!data) return <p className="p-10">Loading...</p>;

  return (
    <div className="p-10 space-y-6">
      <h1 className="text-3xl font-semibold">Global Verification Review</h1>

      <div className="grid md:grid-cols-2 gap-5">
        <Card className="p-4">
          <h2 className="text-xl font-semibold">Document — Front</h2>
          <img src={data.imageFront} className="rounded-lg mt-3" />
        </Card>

        <Card className="p-4">
          <h2 className="text-xl font-semibold">Document — Back</h2>
          <img src={data.imageBack} className="rounded-lg mt-3" />
        </Card>

        <Card className="p-4">
          <h2 className="text-xl font-semibold">Document Authenticity</h2>
          <pre className="text-xs mt-3">{JSON.stringify(data.authenticity, null, 2)}</pre>
        </Card>

        <Card className="p-4">
          <h2 className="text-xl font-semibold">Face Match</h2>
          <pre className="text-xs mt-3">{JSON.stringify(data.faceMatch, null, 2)}</pre>
        </Card>

        <Card className="p-4">
          <h2 className="text-xl font-semibold">Liveness Check</h2>
          <pre className="text-xs mt-3">{JSON.stringify(data.liveness, null, 2)}</pre>
        </Card>

        <Card className="p-4">
          <h2 className="text-xl font-semibold">Global Address</h2>
          <pre className="text-xs mt-3">{JSON.stringify(data.normalizedAddress, null, 2)}</pre>
        </Card>

        <Card className="p-4 col-span-2">
          <h2 className="text-xl font-semibold">Cross-Identity Risk</h2>
          <pre className="text-xs mt-3">{JSON.stringify(data.crossIdentityRisk, null, 2)}</pre>
        </Card>
      </div>
    </div>
  );
}
