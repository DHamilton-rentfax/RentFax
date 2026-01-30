import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Review the Terms of Service for using the RentFAX platform.",
};

export default function TermsPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>

      <div className="prose prose-lg">
        <p>Last updated: October 26, 2023</p>

        <p>
          Please read these Terms of Service ("Terms") carefully before using
          the RentFAX website and application.
        </p>

        <h2>Accounts</h2>
        <p>
          When you create an account, you must provide accurate and complete
          information at all times.
        </p>

        <h2>Intellectual Property</h2>
        <p>
          The Service and its original content are the exclusive property of
          RentFAX.
        </p>

        <h2>Termination</h2>
        <p>
          We may suspend or terminate access immediately for any breach of
          these Terms.
        </p>

        <h2>Governing Law</h2>
        <p>
          These Terms are governed by the laws of the United States.
        </p>

        <h2>Contact</h2>
        <p>
          Questions? Email{" "}
          <a href="mailto:support@rentfax.io">support@rentfax.io</a>.
        </p>
      </div>
    </main>
  );
}
