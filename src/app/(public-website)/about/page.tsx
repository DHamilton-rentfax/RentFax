"use client";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gray-50 text-gray-800 p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-4xl font-bold font-headline text-blue-900">
          About RentFAX
        </h1>

        <p className="text-lg leading-relaxed">
          RentFAX is a modern rental intelligence platform designed to bring
          transparency and accountability to the rental market. Our mission is
          to empower property owners, renters, and landlords with verified
          data, AI-driven insights, and a trusted record of rental history.
        </p>

        <p className="text-lg leading-relaxed">
          Using AI and real-time data analysis, RentFAX identifies fraud
          signals, tracks incident reports, and provides clear dispute
          resolution workflows — ensuring fair treatment and reliable reporting
          for all parties involved.
        </p>

        <p className="text-lg leading-relaxed">
          Whether you’re a property manager or an individual renter, RentFAX
          gives you access to the data that matters most — because reputation
          should be verified, not assumed.
        </p>
      </div>
    </main>
  );
}
