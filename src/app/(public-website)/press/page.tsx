"use client";

const mentions = [
  {
    outlet: "TechCrunch",
    title: "RentFAX Raises Seed Round to Reinvent Rental Risk",
    link: "#",
  },
  {
    outlet: "Forbes",
    title: "The Future of Rentals: How RentFAX Uses AI for Safer Transactions",
    link: "#",
  },
  {
    outlet: "Fast Company",
    title: "Top 10 SaaS Startups to Watch in 2025",
    link: "#",
  },
];

export default function PressPage() {
  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-5xl mx-auto px-6 py-24">
        <h1 className="text-5xl font-extrabold text-gray-900 text-center">
          Press & Media
        </h1>
        <p className="mt-4 text-lg text-gray-600 text-center">
          Read what the media and industry are saying about RentFAX.
        </p>

        <div className="mt-16 space-y-8">
          {mentions.map((m, i) => (
            <a
              key={i}
              href={m.link}
              className="block p-6 rounded-xl border shadow-sm hover:shadow-md transition"
            >
              <h3 className="text-xl font-semibold text-gray-900">{m.title}</h3>
              <p className="mt-2 text-gray-600">Published in {m.outlet}</p>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
