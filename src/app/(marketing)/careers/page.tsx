import { Metadata } from "next";
import { Rocket, HeartHandshake, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Careers at RentFAX",
  description:
    "Join RentFAX and help build the national rental intelligence network that protects landlords and renters.",
};

export default function CareersPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* HERO */}
      <section className="py-24 text-center bg-gradient-to-b from-blue-50 to-white px-6">
        <h1 className="text-5xl font-bold">Careers at RentFAX</h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto mt-4">
          We'''re building something big — and we want mission-driven people to help us.
        </p>
      </section>

      {/* CULTURE */}
      <section className="py-20 max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-10">
        {[
          {
            icon: <Rocket className="h-10 w-10 text-blue-600" />,
            title: "Move Fast",
            desc: "We ship quickly, learn continuously, and iterate with intention.",
          },
          {
            icon: <HeartHandshake className="h-10 w-10 text-blue-600" />,
            title: "Serve Fairness",
            desc: "We build systems that are fair, transparent, and accessible for everyone.",
          },
          {
            icon: <ShieldCheck className="h-10 w-10 text-blue-600" />,
            title: "Protect the Community",
            desc: "Every feature we build protects someone’s property, livelihood, or next home.",
          },
        ].map((block) => (
          <div key={block.title} className="border bg-white p-8 rounded-xl shadow-sm">
            {block.icon}
            <h3 className="text-xl font-semibold mt-4 mb-2">{block.title}</h3>
            <p className="text-gray-600">{block.desc}</p>
          </div>
        ))}
      </section>

      {/* POSITIONS */}
      <section className="py-16 text-center">
        <h2 className="text-3xl font-bold mb-4">Open Roles</h2>
        <p className="text-gray-600 mb-6">We'''re not hiring yet — but soon.</p>
      </section>
    </main>
  );
}
