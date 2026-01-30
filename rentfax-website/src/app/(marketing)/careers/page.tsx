import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Careers at RentFAX",
  description: "Join RentFAX and help build the future of rental trust and fraud prevention.",
};

export default function CareersPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold mb-6 text-[#1A2540]">
        Careers at RentFAX
      </h1>

      <div className="prose prose-lg">
        <p>
          RentFAX is building the global trust layer for rentals — protecting
          property owners, vehicle fleets, and equipment operators through
          verified identity and fraud intelligence.
        </p>

        <p>
          We are an early-stage company focused on engineering excellence,
          fairness, and long-term impact. While we are not actively hiring at
          this moment, we expect to open roles as the platform continues to
          scale.
        </p>

        <p>
          If you’re passionate about trust, data integrity, and building
          infrastructure that protects people and assets, we’d love to hear
          from you.
        </p>

        <p>
          Please check back soon for open positions.
        </p>
      </div>
    </main>
  );
}
