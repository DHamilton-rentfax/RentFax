import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about the mission and team behind RentFAX.",
};

export default function AboutPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-6">About RentFAX</h1>
      <div className="prose prose-lg">
        <p>RentFAX is building the world’s first AI-driven risk and identity platform for housing, car rentals, and equipment lending. Our mission is to stop fraud and predict reliability before assets are handed over.</p>
        <p>Our team is comprised of experienced engineers, data scientists, and industry experts who are passionate about solving the trust problem in the rental economy.</p>
      </div>
    </main>
  );
}
