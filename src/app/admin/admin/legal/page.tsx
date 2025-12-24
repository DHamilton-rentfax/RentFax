"use client";

import LayoutWrapper from "@/components/dashboard/LayoutWrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Shield, Briefcase, Download } from "lucide-react";

export default function LegalCenterPage() {

  return (
    <LayoutWrapper role="superadmin">
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Legal & Compliance Center</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <ActionCard 
                title="Audit Logs"
                description="Review all administrative and user actions across the platform."
                icon={<Briefcase className="text-blue-500" />}
                actionText="View Logs"
                href="/admin/audit"
            />
            <ActionCard 
                title="Compliance Reports"
                description="Generate and view monthly and quarterly compliance summaries."
                icon={<Shield className="text-green-500" />}
                actionText="Run Reports"
                href="#"
            />
            <ActionCard 
                title="Legal Documents"
                description="Manage Terms of Service, Privacy Policy, and other legal agreements."
                icon={<FileText className="text-gray-500" />}
                actionText="Manage Docs"
                href="#"
            />
        </div>

        <Card>
            <CardHeader>
                <CardTitle>Recent Legal Activities</CardTitle>
            </CardHeader>
            <CardContent>
                <ul className="space-y-4">
                    <ActivityItem 
                        title="Terms of Service Update"
                        description="Version 3.2 was published by Admin."
                        timestamp="2023-10-27 14:00 UTC"
                    />
                    <ActivityItem 
                        title="Data Deletion Request"
                        description="Request #1138 processed for user R-9876."
                        timestamp="2023-10-26 11:30 UTC"
                    />
                    <ActivityItem 
                        title="New Agency Agreement Signed"
                        description={`"Justice Partners" onboarded.`}
                        timestamp="2023-10-25 09:00 UTC"
                    />
                </ul>
            </CardContent>
        </Card>
      </div>
    </LayoutWrapper>
  );
}


const ActionCard = ({ title, description, icon, actionText, href }) => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-bold">{title}</CardTitle>
            {icon}
        </CardHeader>
        <CardContent>
            <p className="text-sm text-gray-600 mb-4">{description}</p>
            <Button as="a" href={href}>{actionText}</Button>
        </CardContent>
    </Card>
);

const ActivityItem = ({ title, description, timestamp }) => (
    <li className="border-l-4 border-blue-500 pl-4 py-2">
        <p className="font-bold">{title}</p>
        <p className="text-sm text-gray-700">{description}</p>
        <p className="text-xs text-gray-500 mt-1">{timestamp}</p>
    </li>
);
