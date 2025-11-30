"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function RenterPerksPage() {
  return (
    <div className="space-y-8">

      {/* HEADER */}
      <Card>
        <CardHeader>
          <CardTitle>Renter Perks & Exclusive Benefits</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 text-sm">
            RentFAX members will soon unlock exclusive benefits such as travel discounts,
            home & car rental perks, preferred pricing, loyalty rewards, and more.
            Your reputation will help you qualify for higher levels.
          </p>
        </CardContent>
      </Card>

      {/* COMING SOON GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

        <ComingSoonCard
          title="Hotel & Flight Discounts"
          description="Earn premium travel perks based on your renter history and reputation score."
        />

        <ComingSoonCard
          title="VIP Rental Car Rates"
          description="High-reputation renters unlock faster rentals and lower deposits."
        />

        <ComingSoonCard
          title="Home & Apartment Priority Access"
          description="Top renters receive priority placement for high-demand rentals."
        />

        <ComingSoonCard
          title="Exclusive Partner Perks"
          description="Coming soon — RentFAX partnerships with airlines, hotels, and brands."
        />

        <ComingSoonCard
          title="Elite Renter Status"
          description="Earn prestige status levels with real-world privileges."
        />

        <ComingSoonCard
          title="Reward Points Program"
          description="Get rewarded for responsible renting across multiple industries."
        />

      </div>
    </div>
  );
}

function ComingSoonCard({ title, description }: any) {
  return (
    <Card className="relative opacity-70">
      <div className="absolute top-3 right-3 bg-black text-white text-[10px] px-2 py-1 rounded">
        COMING SOON
      </div>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 text-sm">{description}</p>
      </CardContent>
    </Card>
  );
}
