import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Review the Privacy Policy for the RentFAX platform.",
};

export default function PrivacyPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <div className="prose prose-lg">
        <p>Last updated: October 26, 2023</p>

        <p>RentFAX Inc. operates the https://rentfax.io website and the RentFAX application. This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service.</p>

        <h2>Information Collection and Use</h2>
        <p>We collect several different types of information for various purposes to provide and improve our Service to you.</p>

        <h2>Types of Data Collected</h2>
        <p>While using our Service, we may ask you to provide us with certain personally identifiable information, including but not limited to: email address, name, and phone number.</p>

        <h2>Use of Data</h2>
        <p>RentFAX uses the collected data to provide and maintain the Service, notify you about changes, and provide customer support.</p>

        <h2>Contact Us</h2>
        <p>If you have any questions about this Privacy Policy, please contact us at <a href="mailto:support@rentfax.io">support@rentfax.io</a>.</p>
      </div>
    </main>
  );
}
