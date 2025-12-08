"use client";

import LayoutWrapper from "@/components/dashboard/LayoutWrapper";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function SettingsPage() {

  return (
    <LayoutWrapper role="superadmin">
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Global Settings</h1>

        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Feature Flags</CardTitle>
                    <CardDescription>Enable or disable major features across the platform.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <FeatureToggle name="Enable Real-Time Dispute Resolution" description="Allow renters and companies to resolve disputes in real-time." />
                    <FeatureToggle name="Enable AI-Powered Fraud Detection" description="Use machine learning to flag suspicious activities." defaultChecked={true} />
                    <FeatureToggle name="Enable Public API Access" description="Allow third-party developers to access public data." />
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>API Keys & Integrations</CardTitle>
                    <CardDescription>Manage third-party service credentials.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <ApiKeyInput service="Stripe" apiKey="pk_test_..." />
                    <ApiKeyInput service="Google Maps" apiKey="AIzaSy..." />
                    <ApiKeyInput service="Twilio" apiKey="AC..." />
                </CardContent>
            </Card>

            <div className="flex justify-end">
                <Button size="lg">Save All Changes</Button>
            </div>
        </div>
      </div>
    </LayoutWrapper>
  );
}


const FeatureToggle = ({ name, description, defaultChecked = false }) => (
    <div className="flex items-center justify-between p-4 border rounded-md">
        <div>
            <Label htmlFor={name} className="font-semibold">{name}</Label>
            <p className="text-sm text-gray-500">{description}</p>
        </div>
        <Switch id={name} defaultChecked={defaultChecked} />
    </div>
);

const ApiKeyInput = ({ service, apiKey }) => (
    <div className="space-y-2">
        <Label htmlFor={service}>{service} API Key</Label>
        <div className="flex items-center space-x-2">
            <Input id={service} defaultValue={apiKey} className="font-mono" />
            <Button variant="outline">Revoke</Button>
        </div>
    </div>
);
