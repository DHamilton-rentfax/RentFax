const cases = [
  {
    title: "Multi-Property Landlord",
    before: "Manual screening, late payments, eviction risk",
    after: "Verified identities, structured disputes, early fraud flags",
    result: "32% reduction in tenant loss",
  },
  {
    title: "Vehicle Rental Fleet",
    before: "Stolen vehicles, false identities",
    after: "Identity consistency checks before pickup",
    result: "Zero theft incidents in 90 days",
  },
  {
    title: "Rental Agency",
    before: "Unstructured disputes, compliance risk",
    after: "Centralized incident timelines & audit logs",
    result: "Enterprise-ready compliance workflow",
  },
];

export default function CaseStudies() {
  return (
    <section className="py-24 px-6 bg-white border-t">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-16">
          Real-World Outcomes
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {cases.map((c) => (
            <div key={c.title} className="border rounded-2xl p-6">
              <h3 className="font-bold text-lg mb-4">{c.title}</h3>
              <p className="text-sm text-gray-600 mb-2">
                <strong>Before:</strong> {c.before}
              </p>
              <p className="text-sm text-gray-600 mb-2">
                <strong>After:</strong> {c.after}
              </p>
              <p className="text-sm font-semibold text-emerald-600 mt-4">
                {c.result}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
