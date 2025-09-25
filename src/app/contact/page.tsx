'use client';

import { useState } from "react";

export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "sent">("idle");

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-3xl mx-auto px-6 py-24">
        <h1 className="text-5xl font-extrabold text-gray-900 text-center">Contact Us</h1>
        <p className="mt-6 text-lg text-gray-600 text-center">
          Have questions, feedback, or partnership ideas? We’d love to hear from you.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            setStatus("sent");
          }}
          className="mt-12 bg-gray-50 p-8 rounded-2xl shadow space-y-6"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              required
              className="mt-2 w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-600 focus:ring-indigo-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              required
              className="mt-2 w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-600 focus:ring-indigo-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Message</label>
            <textarea
              rows={5}
              required
              className="mt-2 w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-600 focus:ring-indigo-600"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 px-6 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700"
          >
            {status === "sent" ? "Message Sent!" : "Send Message"}
          </button>
        </form>

        <div className="mt-16 text-center text-gray-600">
          <p>Email: <a href="mailto:support@rentfax.com" className="text-indigo-600">support@rentfax.com</a></p>
          <p className="mt-2">Phone: +1 (555) 123-4567</p>
        </div>
      </div>
    </div>
  );
}
