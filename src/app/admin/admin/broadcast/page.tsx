'use client';

import { useState } from "react";
import { toast } from "sonner";

export default function AdminBroadcastPage() {
  const [form, setForm] = useState({
    audience: "all",
    title: "",
    message: "",
    sendEmail: true,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.message.trim() || !form.title.trim()) return toast.error("All fields required.");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/broadcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error(await res.text());
      toast.success("Broadcast sent successfully.");
      setForm({ audience: "all", title: "", message: "", sendEmail: true });
    } catch (err) {
      console.error(err);
      toast.error("Failed to send broadcast.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-[#1A2540] mb-4">Broadcast Alert</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-xl shadow-md">
        <div>
          <label className="block font-semibold mb-1">Audience</label>
          <select name="audience" value={form.audience} onChange={handleChange} className="border p-2 rounded-md w-full">
            <option value="all">All Users</option>
            <option value="company">Company Users</option>
            <option value="agency">Agencies</option>
            <option value="legal">Legal Teams</option>
          </select>
        </div>
        <div>
          <label className="block font-semibold mb-1">Title</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="e.g. Policy Update: New Dispute Protocol"
            className="border p-2 rounded-md w-full"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Message</label>
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            placeholder="Type the broadcast message..."
            className="border p-2 rounded-md w-full min-h-[120px]"
          />
        </div>
        <label className="flex items-center gap-2 text-sm font-medium">
          <input type="checkbox" name="sendEmail" checked={form.sendEmail} onChange={handleChange} />
          Send email to recipients
        </label>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#1A2540] text-white font-semibold py-2 rounded-md hover:bg-[#2d3c66]"
        >
          {loading ? "Broadcasting..." : "Send Broadcast"}
        </button>
      </form>
    </div>
  );
}
