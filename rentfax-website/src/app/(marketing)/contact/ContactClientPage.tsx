'use client';

export default function ContactClientPage() {
  return (
    <section className="max-w-4xl mx-auto py-24 px-6">
      <h1 className="text-4xl font-bold mb-4">Contact RentFAX</h1>
      <p className="text-gray-600 mb-8">
        Request a demo, ask a question, or talk to our team.
      </p>

      <form className="grid gap-4">
        <input
          className="border p-3 rounded"
          placeholder="Full Name"
          required
        />
        <input
          type="email"
          className="border p-3 rounded"
          placeholder="Email"
          required
        />
        <textarea
          className="border p-3 rounded"
          placeholder="How can we help?"
          rows={5}
        />
        <button className="bg-[#1A2540] text-white py-3 rounded">
          Send Message
        </button>
      </form>
    </section>
  );
}
