'use client';

const partners = [
  {
    name: "Stripe",
    desc: "Payment processing and subscription billing.",
    logo: "/partners/stripe.svg",
  },
  {
    name: "Plaid",
    desc: "Bank account connectivity and financial insights.",
    logo: "/partners/plaid.svg",
  },
  {
    name: "Firebase",
    desc: "Secure backend infrastructure and authentication.",
    logo: "/partners/firebase.svg",
  },
];

export default function PartnersPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-24">
        <h1 className="text-5xl font-extrabold text-gray-900 text-center">Our Partners</h1>
        <p className="mt-4 text-lg text-gray-600 text-center">
          RentFAX is built on a foundation of world-class technology and trusted partners.
        </p>

        <div className="mt-16 grid md:grid-cols-3 gap-12">
          {partners.map((p, i) => (
            <div
              key={i}
              className="p-8 bg-white rounded-xl border shadow-sm text-center hover:shadow-md"
            >
              <img
                src={p.logo}
                alt={p.name}
                className="mx-auto h-12 mb-6"
              />
              <h3 className="text-xl font-semibold text-gray-900">{p.name}</h3>
              <p className="mt-2 text-gray-600">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
