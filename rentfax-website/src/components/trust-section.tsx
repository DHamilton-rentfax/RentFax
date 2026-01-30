import TestimonialCard from "@/components/testimonial-card";

const stats = [
  { label: "Renters Screened", value: "25,000+" },
  { label: "Rental Incidents Logged", value: "8,400+" },
  { label: "Fraud Signals Detected", value: "3,100+" },
  { label: "Avg. Risk Reduction", value: "29%" },
];

const testimonials = [
  {
    quote:
      "RentFAX caught identity inconsistencies that traditional screening missed.",
    name: "Michael R.",
    title: "Senior Property Manager",
    company: "Multi-State Housing Group",
    initials: "MR",
    highlight: "400+ applicants screened",
  },
  {
    quote:
      "The incident timelines and dispute transparency alone justify the platform.",
    name: "Danielle K.",
    title: "Operations Director",
    company: "Regional Rental Agency",
    initials: "DK",
    highlight: "27% reduction in rental losses",
  },
  {
    quote:
      "Risk signals appear before vehicles ever leave the lot.",
    name: "Carlos M.",
    title: "Fleet Owner",
    company: "Urban Mobility Services",
    initials: "CM",
    highlight: "1,200+ rentals screened",
  },
  {
    quote:
      "Disputes are structured, traceable, and fair for both sides.",
    name: "Laura T.",
    title: "Compliance Lead",
    company: "National Property Group",
    initials: "LT",
    highlight: "Enterprise compliance workflow",
  },
  {
    quote:
      "Finally — rental intelligence that isn’t a credit bureau.",
    name: "James W.",
    title: "Founder",
    company: "Independent Housing Portfolio",
    initials: "JW",
    highlight: "Trusted by independent landlords",
  },
];

export default function TrustSection() {
  return (
    <section className="py-24 px-6 bg-slate-50 border-t">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="text-4xl font-bold text-[#1A2540]">{s.value}</p>
              <p className="text-sm text-gray-600 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <TestimonialCard key={t.name} {...t} />
          ))}
        </div>
      </div>
    </section>
  );
}
