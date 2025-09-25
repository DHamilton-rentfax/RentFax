"use client";

const faqs = [
  {
    q: "What is RentFAX?",
    a: "RentFAX is a renter-risk intelligence platform that provides real-time scoring, dispute resolution, and fraud detection for rental businesses.",
  },
  {
    q: "Is my data secure?",
    a: "Yes. We use bank-level encryption and are SOC 2, GDPR, and CCPA aligned.",
  },
  {
    q: "How do I get started?",
    a: "Sign up for a free trial, connect your account, and run your first rental report within minutes.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. You can upgrade, downgrade, or cancel your plan anytime from your dashboard.",
  },
];

export default function HelpPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-6 py-24">
        <h1 className="text-5xl font-extrabold text-gray-900 text-center">Help Center</h1>
        <p className="mt-4 text-lg text-gray-600 text-center">
          Frequently asked questions and support resources.
        </p>

        <div className="mt-16 space-y-8">
          {faqs.map((faq, i) => (
            <div key={i} className="p-6 bg-white rounded-xl shadow border">
              <h3 className="text-xl font-semibold text-indigo-600">{faq.q}</h3>
              <p className="mt-2 text-gray-600">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
