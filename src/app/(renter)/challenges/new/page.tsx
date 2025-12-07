"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function NewChallengePage() {
  const [text, setText] = useState("");
  
  async function submit() {
    await fetch("/api/renter/challenges/new", {
      method: "POST",
      body: JSON.stringify({ text }),
    });
    alert("Challenge submitted");
  }

  return (
    <div className="p-10 max-w-2xl mx-auto">
      <h1 className="text-3xl font-semibold mb-4">Challenge an Item</h1>

      <Card className="p-5 space-y-4">

        <textarea
          placeholder="Explain what needs to be corrected..."
          className="w-full border rounded p-3 h-40"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <Button onClick={submit} className="w-full">Submit Challenge</Button>
      </Card>
    </div>
  );
}
