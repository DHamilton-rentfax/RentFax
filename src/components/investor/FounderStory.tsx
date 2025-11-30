'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function FounderStory() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Founder's Story: Why I Built RentFAX</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="aspect-video bg-gray-200 dark:bg-gray-800 rounded-lg flex items-center justify-center">
          <p className="text-muted-foreground">Founder Video Coming Soon</p>
        </div>
        <div>
          <h3 className="font-semibold text-lg">From Personal Loss to a Mission-Driven Company</h3>
          <p className="text-muted-foreground mt-2">
            "It started with a car rental. A simple transaction that cost me thousands and revealed a broken system. I discovered that trust in the rental economy is a bigger problem than anyone was admitting. That's why I built RentFAX: to create the infrastructure of trust for a new generation of renters and businesses."
          </p>
          <p className="font-semibold mt-2">- Dominique Hamilton, Founder & CEO</p>
        </div>
        <Button variant="outline">Read the Full Story</Button>
      </CardContent>
    </Card>
  );
}
