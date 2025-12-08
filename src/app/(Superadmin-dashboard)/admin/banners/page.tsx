"use client";

import { useState } from "react";
import { toast } from "sonner";

export default function AdminBannersPage() {
  const [form, setForm] = useState({
    title: "",
    message: "",
    audience: "all",
    severity: "info",
    expiresAt: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: any) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/admin/banner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error(await res.text());
      toast.success("Banner created successfully.");
      setForm({ title: "", message: "", audience: "all", severity: "info", expiresAt: "" });
    } catch (err) {
      console.error(err);
      toast.error("Failed to create banner.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-[#1A2540] mb-4">Create Global Banner</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md space-y-4">
        <input
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          className="border p-2 rounded-md w-full"
        />
        <textarea
          name="message"
          placeholder="Message"
          value={form.message}
          onChange={handleChange}
          className="border p-2 rounded-md w-full min-h-[100px]"
        />
        <div className="grid grid-cols-2 gap-4">
          <select name="audience" value={form.audience} onChange={handleChange} className="border p-2 rounded-md">
            <option value="all">All Users</option>
            <option value="company">Companies</option>
            <option value="agency">Agencies</option>
            <option value="legal">Legal Teams</option>
          </select>
          <select name="severity" value={form.severity} onChange={handleChange} className="border p-2 rounded-md">
            <option value="info">Info</option>
            <option value="warning">Warning</option>
            <option value="error">Critical</option>
          </select>
        </div>
        <input
          type="datetime-local"
          name="expiresAt"
          value={form.expiresAt}
          onChange={handleChange}
          className="border p-2 rounded-md w-full"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#1A2540] text-white font-semibold py-2 rounded-md hover:bg-[#2d3c66]"
        >
          {loading ? "Publishing..." : "Publish Banner"}
        </button>
      </form>
    </div>
  );
}
