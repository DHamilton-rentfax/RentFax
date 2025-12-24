import { ChevronDown } from "lucide-react";

export default function FAQPage() {
  const faqs = [
    {
      q: "What is the RentFAX Risk Score?",
      a: "It is a behavioral risk indicator generated from incidents, disputes, verification data, and fraud signals.",
    },
    {
      q: "Can renters dispute a report?",
      a: "Yes — renters can log in to their dashboard to provide evidence, statements, and corrections.",
    },
    {
      q: "How do I submit an incident?",
      a: "Property owners or companies may file incidents from their dashboard under 'Create Report'.",
    },
  ];

  return (
    <main>
      <h1 className="text-4xl font-bold mb-6">Frequently Asked Questions</h1>

      <div className="space-y-4 max-w-3xl">
        {faqs.map((faq, i) => (
          <details key={i} className="border p-4 rounded-lg shadow-sm">
            <summary className="cursor-pointer flex justify-between items-center font-medium">
              {faq.q}
              <ChevronDown className="w-5 h-5" />
            </summary>
            <p className="mt-3 text-gray-600">{faq.a}</p>
          </details>
        ))}
      </div>
    </main>
  );
}
