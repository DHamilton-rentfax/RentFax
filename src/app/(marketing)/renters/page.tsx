import { Metadata } from "next";
import {
  User,
  ShieldCheck,
  FileSearch,
  Clock,
  MessageSquare,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

export const metadata: Metadata = {
  title: "For Renters | Fairness, Transparency & Verified Records | RentFAX",
  description:
    "RentFAX empowers renters with transparency, dispute rights, identity verification, and a reputation system that rewards good rental behavior.",
};

export default function RentersPage() {
  return (
    <main className="min-h-screen bg-white text-gray-900">

      {/* HERO */}
      <section className="py-24 px-6 text-center bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <User className="h-12 w-12 mx-auto mb-4 opacity-90" />
        <h1 className="text-5xl font-bold mb-4">Built for Renters</h1>
        <p className="max-w-2xl mx-auto text-lg text-blue-100">
          A fair, transparent system that helps good renters stand out and correct inaccurate reports.
        </p>
      </section>

      {/* VALUE PROPS */}
      <section className="py-20 max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-10">

        <div className="p-8 border rounded-2xl shadow-sm">
          <ShieldCheck className="h-10 w-10 text-blue-600 mb-3" />
          <h3 className="text-xl font-semibold mb-2">Full Transparency</h3>
          <p className="text-gray-700 text-sm">
            See every report filed about you — incidents, disputes, notes, and verification outcomes.
          </p>
        </div>

        <div className="p-8 border rounded-2xl shadow-sm">
          <MessageSquare className="h-10 w-10 text-blue-600 mb-3" />
          <h3 className="text-xl font-semibold mb-2">Built-In Dispute Rights</h3>
          <p className="text-gray-700 text-sm">
            Upload evidence, explain your side, and request corrections. Your voice is part of the record.
          </p>
        </div>

        <div className="p-8 border rounded-2xl shadow-sm">
          <CheckCircle className="h-10 w-10 text-blue-600 mb-3" />
          <h3 className="text-xl font-semibold mb-2">Renter Reputation Profile</h3>
          <p className="text-gray-700 text-sm">
            Good renters earn positive history, trust signals, and lower risk scores for future landlords.
          </p>
        </div>

      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 bg-slate-50 border-t">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-10">How Renters Use RentFAX</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">

            <div className="p-8 bg-white border rounded-xl shadow-sm">
              <FileSearch className="h-8 w-8 text-blue-600 mb-3" />
              <h3 className="font-semibold mb-1">View Your Record</h3>
              <p className="text-sm text-gray-700">See what landlords see — your incident history, verification checks, and disputes.</p>
            </div>

            <div className="p-8 bg-white border rounded-xl shadow-sm">
              <Clock className="h-8 w-8 text-blue-600 mb-3" />
              <h3 className="font-semibold mb-1">Fix Inaccuracies</h3>
              <p className="text-sm text-gray-700">Submit disputes, evidence, and corrections directly through your dashboard.</p>
            </div>

            <div className="p-8 bg-white border rounded-xl shadow-sm">
              <ShieldCheck className="h-8 w-8 text-blue-600 mb-3" />
              <h3 className="font-semibold mb-1">Get Verified</h3>
              <p className="text-sm text-gray-700">Identity verification adds trust signals to your profile and reduces manual checks.</p>
            </div>

          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="py-24 text-center">
        <a
          href="/signup"
          className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold"
        >
          Create Your Free Renter Account <ArrowRight className="ml-2 h-5 w-5" />
        </a>
      </section>

    </main>
  );
}
