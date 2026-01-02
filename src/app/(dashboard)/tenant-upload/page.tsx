'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { RoleGate } from "@/components/auth/RoleGate";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function TenantUploadPage() {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (file) {
      console.log('Uploading file:', file.name);
      // Placeholder for file upload logic
    }
  };

  return (
    <RoleGate requiresRole="admin">
      <div className="flex items-center justify-center h-full">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Upload Tenant Information</CardTitle>
            <CardDescription>Upload a CSV file with your tenant data.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="tenant-file">Tenant File</Label>
                <Input id="tenant-file" type="file" accept=".csv" onChange={handleFileChange} />
              </div>
              <Button type="submit" disabled={!file}>Upload</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </RoleGate>
  );
}
