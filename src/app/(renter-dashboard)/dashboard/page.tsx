import {
  Fingerprint,
  ShieldCheck,
  MessageCircle,
  FileText,
  Activity,
  Lock,
  Globe,
} from "lucide-react";

export default function HowItWorks() {
  return (
    <div className="bg-white text-black">
      {/* HERO */}
      <section className="relative px-8 pt-40 pb-48 max-w-7xl mx-auto">
        <p className="uppercase tracking-widest text-sm text-gray-500 mb-6">
          The Global Rental Trust Standard
        </p>

        <h1 className="text-[4.5rem] md:text-[6rem] font-bold leading-[0.95] tracking-tight max-w-5xl">
          Protected
          <br />
          by RentFAX
        </h1>

        <p className="mt-10 text-2xl text-gray-600 max-w-3xl">
          RentFAX is the world’s first renter and rental trust infrastructure.
          Not a blacklist. Not a judgment engine.
          A verified, transparent system that protects people, property, and truth.
        </p>

        <div className="mt-16 flex flex-wrap gap-8 text-sm text-gray-500">
          <span>Identity verification</span>
          <span>Renter consent</span>
          <span>Evidence-backed reporting</span>
          <span>Pattern-based intelligence</span>
          <span>Immutable audit trails</span>
        </div>
      </section>

      {/* GLOBAL STANDARD */}
      <section className="px-8 py-40 bg-gray-50">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-24 items-center">
          <div>
            <p className="uppercase tracking-widest text-sm text-gray-500 mb-6">
              A New Category
            </p>

            <h2 className="text-5xl font-semibold leading-tight mb-10">
              RentFAX is not a database.
              <br />
              It’s a standard.
            </h2>

            <p className="text-xl text-gray-600 leading-relaxed max-w-xl">
              Just as payment networks standardized trust in commerce,
              RentFAX standardizes trust in rentals.
              Every interaction is verified, documented, and reviewable —
              without assuming guilt or punishing mistakes.
            </p>
          </div>

          <div className="space-y-10">
            <StandardItem
              icon={Fingerprint}
              title="Verified Access Only"
              desc="No anonymous lookups. Every data access is tied to a verified person or organization."
            />
            <StandardItem
              icon={MessageCircle}
              title="Renter-Aware by Design"
              desc="Renters are contacted before outcomes occur. No silent reporting. Ever."
            />
            <StandardItem
              icon={ShieldCheck}
              title="Neutral by Default"
              desc="Single events never define people. Context and patterns matter."
            />
          </div>
        </div>
      </section>

      {/* SYSTEM FLOW */}
      <section className="px-8 py-48 max-w-7xl mx-auto">
        <p className="uppercase tracking-widest text-sm text-gray-500 mb-8">
          How the System Works
        </p>

        <h2 className="text-6xl font-semibold mb-24 max-w-4xl leading-tight">
          A transparent system
          <br />
          from first access
          <br />
          to final resolution.
        </h2>

        <div className="space-y-32">
          <FlowStep
            icon={Fingerprint}
            title="Access Is Verified"
            desc="Every lookup is logged with identity, intent, time, and organization. This protects renters and gives businesses defensible proof of legitimate use."
          />
          <FlowStep
            icon={MessageCircle}
            title="Renters Are Contacted"
            desc="Before disputes or outcomes, renters confirm whether a rental relationship exists. Identity misuse is stopped before damage occurs."
          />
          <FlowStep
            icon={FileText}
            title="Evidence Is Required"
            desc="Claims without documentation are never assumed true. Evidence determines credibility — not authority."
          />
          <FlowStep
            icon={Activity}
            title="Patterns Are Evaluated"
            desc="The system looks across time. Accidents fade. Abuse emerges. Action is taken only when behavior proves intent."
          />
          <FlowStep
            icon={Lock}
            title="Everything Is Auditable"
            desc="Every action is preserved in an immutable audit trail suitable for courts, regulators, insurers, and enterprises."
          />
        </div>
      </section>

      {/* SOCIAL PROOF / CULTURAL */}
      <section className="px-8 py-48 bg-black text-white">
        <div className="max-w-6xl mx-auto text-center">
          <Globe size={56} className="mx-auto mb-12 text-gray-400" />

          <h2 className="text-5xl font-semibold mb-12">
            Trust becomes visible.
          </h2>

          <p className="text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Properties display it.
            Vehicles wear it.
            Equipment is marked by it.
            <br />
            When you see “Protected by RentFAX”,
            you know verification comes first.
          </p>

          <div className="mt-16 text-sm tracking-widest text-gray-400 uppercase">
            Protected by RentFAX™
          </div>
        </div>
      </section>

      {/* MANIFESTO */}
      <section className="px-8 py-48 max-w-7xl mx-auto">
        <h3 className="text-6xl font-semibold leading-tight max-w-5xl">
          RentFAX does not punish people.
          <br />
          It protects reality.
        </h3>

        <p className="mt-16 text-2xl text-gray-600 max-w-4xl leading-relaxed">
          Mistakes are human.
          Silence enables abuse.
          Transparency creates safety.
          <br />
          RentFAX exists to make trust permanent —
          and visible to everyone.
        </p>
      </section>
    </div>
  );
}

function StandardItem({ icon: Icon, title, desc }: any) {
  return (
    <div className="flex gap-6">
      <div className="h-12 w-12 rounded-full bg-black text-white flex items-center justify-center shrink-0">
        <Icon size={22} />
      </div>
      <div>
        <h4 className="text-xl font-semibold mb-2">{title}</h4>
        <p className="text-gray-600">{desc}</p>
      </div>
    </div>
  );
}

function FlowStep({ icon: Icon, title, desc }: any) {
  return (
    <div className="max-w-4xl">
      <div className="flex items-center gap-6 mb-6">
        <div className="h-14 w-14 rounded-full bg-black text-white flex items-center justify-center">
          <Icon size={24} />
        </div>
        <h3 className="text-4xl font-semibold">{title}</h3>
      </div>
      <p className="text-xl text-gray-600 leading-relaxed max-w-3xl">
        {desc}
      </p>
    </div>
  );
}
