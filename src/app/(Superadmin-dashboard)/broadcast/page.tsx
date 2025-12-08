'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-hot-toast";
import { Loader2, Send } from "lucide-react";

export default function AdminBroadcastPage() {
  const [message, setMessage] = useState("");
  const [audience, setAudience] = useState("all");
  const [scheduleDate, setScheduleDate] = useState("");
  const [expireDate, setExpireDate] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSend() {
    if (!message.trim()) return toast.error("Please enter a message.");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/broadcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, audience, scheduleDate, expireDate }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      toast.success(
        scheduleDate
          ? "Broadcast scheduled successfully!"
          : "Broadcast sent successfully!"
      );
      setMessage("");
      setScheduleDate("");
      setExpireDate("");
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to send broadcast.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-[#1A2540] mb-6">
        Broadcast Message Center
      </h1>

      <div className="bg-white shadow-md rounded-xl p-6 max-w-2xl space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Audience
          </label>
          <select
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
            className="border rounded-md p-2 w-full"
          >
            <option value="all">All Users</option>
            <option value="agencies">Collection Agencies</option>
            <option value="legal">Legal Partners</option>
            <option value="clients">Client Companies</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Message
          </label>
          <Textarea
            rows={4}
            placeholder="Enter your announcement or update..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-700 mb-2">
              Schedule (optional)
            </label>
            <Input
              type="datetime-local"
              value={scheduleDate}
              onChange={(e) => setScheduleDate(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-2">
              Expire (optional)
            </label>
            <Input
              type="datetime-local"
              value={expireDate}
              onChange={(e) => setExpireDate(e.target.value)}
            />
          </div>
        </div>

        <Button
          onClick={handleSend}
          disabled={loading}
          className="flex items-center gap-2"
        >
          {loading ? (
            <Loader2 className="animate-spin h-4 w-4" />
          ) : (
            <Send className="h-4 w-4" />
          )}
          {scheduleDate ? "Schedule Broadcast" : "Send Broadcast"}
        </Button>
      </div>

      <p className="text-xs text-gray-400 mt-6">
        💡 You can schedule future messages and set them to expire automatically.
      </p>
    </main>
  );
}
