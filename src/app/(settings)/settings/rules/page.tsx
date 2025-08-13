
'use client';

import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';

export default function RulesAndBrandingPage() {
  return (
    <div className="space-y-6">
        <div>
            <h3 className="text-lg font-medium">Rules & Branding</h3>
            <p className="text-sm text-muted-foreground">
                Customize your public rules page and company branding.
            </p>
        </div>
        <Card>
        <CardHeader>
            <CardTitle>Coming Soon</CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-muted-foreground">This page will soon allow you to set company-wide rental rules, customize colors, and upload your logo for a branded public rules page.</p>
        </CardContent>
        </Card>
    </div>
  );
}
