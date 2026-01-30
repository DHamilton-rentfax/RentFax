import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Data Protection",
  description: "Review the Data Protection policies for the RentFAX platform.",
};

export default function DataProtectionPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-6">Data Protection</h1>
      <div className="prose prose-lg">
        <p>Last updated: October 26, 2023</p>

        <p>This Data Protection Addendum is incorporated into the RentFAX Terms of Service and applies to the processing of personal data by RentFAX Inc.</p>

        <h2>Data Security</h2>
        <p>We implement appropriate technical and organizational measures to protect personal data against unauthorized or unlawful processing and against accidental loss, destruction, or damage.</p>

        <h2>Data Processing</h2>
        <p>RentFAX acts as a data processor. We will only process personal data on behalf of and in accordance with our customers' documented instructions.</p>

        <h2>Contact Us</h2>
        <p>If you have any questions about our data protection practices, please contact us at <a href="mailto:support@rentfax.io">support@rentfax.io</a>.</p>
      </div>
    </main>
  );
}
