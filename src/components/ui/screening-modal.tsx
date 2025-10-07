"use client";
import { useState } from "react";

export function ScreeningModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    license: "",
    state: "",
    address: "",
  });

  if (!open) return null;

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // In production: Validate → Send to Stripe session API
    alert("Proceeding to secure payment for verification.");
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-6">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-8 relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
        <h2 className="text-2xl font-bold text-[#1B2A4E] mb-6 text-center">
          Start Screening
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {["name", "email", "phone", "license", "state", "address"].map(
            (field) => (
              <input
                key={field}
                name={field}
                placeholder={field[0].toUpperCase() + field.slice(1)}
                value={(form as any)[field]}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#E6B422] outline-none"
                required
              />
            )
          )}
          <button
            type="submit"
            className="w-full bg-[#1B2A4E] text-white py-3 rounded-lg font-semibold hover:bg-[#E6B422] hover:text-[#1B2A4E] transition"
          >
            Proceed to Payment ($20)
          </button>
        </form>
      </div>
    </div>
  );
}
