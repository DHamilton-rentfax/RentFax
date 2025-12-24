"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function NewEvidencePage() {
  const [files, setFiles] = useState<File[]>([]);
  const [timeline, setTimeline] = useState("");

  async function submit() {
    const form = new FormData();
    files.forEach((f) => form.append("files", f));
    form.append("timeline", timeline);

    await fetch("/api/renter/evidence/new", {
      method: "POST",
      body: form,
    });
    alert("Evidence submitted");
  }

  return (
    <div className="p-10 max-w-2xl mx-auto space-y-4">
      <h1 className="text-3xl font-semibold">Submit Evidence</h1>

      <textarea
        placeholder="Describe the timeline of events..."
        className="w-full p-3 border rounded h-40"
        value={timeline}
        onChange={(e) => setTimeline(e.target.value)}
      />

      <input
        type="file"
        multiple
        onChange={(e) => setFiles([...e.target.files!])}
        className="w-full border p-3 rounded"
      />

      <Button onClick={submit} className="w-full">Upload Evidence</Button>
    </div>
  );
}
