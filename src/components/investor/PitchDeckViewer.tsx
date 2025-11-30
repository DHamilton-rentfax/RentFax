'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PitchDeckViewer() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pitch Deck</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Placeholder for an embedded pitch deck (e.g., from Google Slides, DocSend) */}
        <div className="aspect-video bg-gray-200 dark:bg-gray-800 rounded-lg flex items-center justify-center">
          <p className="text-muted-foreground">Embedded Pitch Deck Coming Soon</p>
        </div>
      </CardContent>
    </Card>
  );
}
