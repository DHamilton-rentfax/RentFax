'use client';

import { Button } from "@/components/ui/button";
import { RoleGate } from "@/components/auth/RoleGate";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <RoleGate requiresRole="admin">
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h1 className="text-4xl font-bold">Welcome to your Dashboard</h1>
          <p className="mt-2 text-lg text-gray-500">Get started by uploading your tenant information.</p>
          <Link href="/dashboard/tenant-upload">
            <Button className="mt-4">Get Started</Button>
          </Link>
        </div>
      </div>
    </RoleGate>
  );
}
