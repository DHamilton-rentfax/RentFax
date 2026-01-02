"use client";

import { useState } from "react";
import Image from "next/image";
import { createWhiteLabelCompany } from "@/firebase/server-actions/whitelabel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";

export default function WhiteLabelPage() {
  const [companyName, setCompanyName] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [domain, setDomain] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleCreate = async () => {
    if (!companyName || !logoFile) {
      alert("Please enter a company name and upload a logo.");
      return;
    }

    setLoading(true);
    const form = new FormData();
    form.append("companyName", companyName);
    form.append("logo", logoFile);
    form.append("domain", domain);

    const res = await createWhiteLabelCompany(form);
    setResult(res);
    setLoading(false);
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold">White Label Generator</h1>
      <p className="text-gray-600">Create a fully automated enterprise tenant.</p>

      <Card>
        <CardHeader>
          <CardTitle>Create White-Label Company</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <Input
            placeholder="Company Name"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
          />

          <Input
            placeholder="Domain (optional) — example: acme.rentfax.io"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
          />

          <Input
            type="file"
            onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
          />

          {logoFile && (
            <Image
              src={URL.createObjectURL(logoFile)}
              alt="Preview"
              width={120}
              height={120}
              className="rounded-md border object-cover"
            />
          )}

          <Button disabled={loading} onClick={handleCreate}>
            {loading ? "Creating…" : "Create White-Label Tenant"}
          </Button>
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>White Label Created</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-sm bg-gray-100 p-4 rounded-md">
              {JSON.stringify(result, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
