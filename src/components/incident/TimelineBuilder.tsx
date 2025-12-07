"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

export default function TimelineBuilder() {
  const [events, setEvents] = useState([
    {
      type: "",
      description: "",
      internalOnly: false,
    },
  ]);

  const updateEvent = (index: number, field: string, value: any) => {
    const copy = [...events];
    // @ts-ignore
    copy[index][field] = value;
    setEvents(copy);
  };

  const addEvent = () => {
    setEvents([...events, { type: "", description: "", internalOnly: false }]);
  };

  const removeEvent = (i: number) => {
    setEvents(events.filter((_, idx) => idx !== i));
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Timeline of Events</h3>

      {events.map((event, i) => (
        <div
          key={i}
          className="border rounded-lg p-4 shadow-sm bg-white space-y-4"
        >
          <div className="flex justify-between items-center">
            <h4 className="font-medium">Event #{i + 1}</h4>
            {i > 0 && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => removeEvent(i)}
              >
                Remove
              </Button>
            )}
          </div>

          <div>
            <label className="text-sm font-medium">Event Type</label>
            <select
              className="w-full border rounded-md p-2 mt-1"
              value={event.type}
              onChange={(e) => updateEvent(i, "type", e.target.value)}
            >
              <option value="">Select…</option>
              <option>Damage Discovered</option>
              <option>Tow Event</option>
              <option>Police Interaction</option>
              <option>Threat / Aggressive Behavior</option>
              <option>Communication Attempt</option>
              <option>Payment Attempt / Failure</option>
              <option>GPS Location Event</option>
              <option>Vehicle Recovery</option>
              <option>Other</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">Description</label>
            <textarea
              className="w-full border rounded-md p-2 mt-1"
              rows={3}
              placeholder="Record factual, chronological details of the event."
              value={event.description}
              onChange={(e) => updateEvent(i, "description", e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium block mb-1">
              Upload Supporting Evidence
            </label>
            <div className="border rounded-md p-3 bg-muted/40 text-sm text-muted-foreground">
              EvidenceUploader will be inserted here (Chunk 3)
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Internal Only (hidden from renter)
            </span>
            <Switch
              checked={event.internalOnly}
              onCheckedChange={(v) => updateEvent(i, "internalOnly", v)}
            />
          </div>
        </div>
      ))}

      <Button variant="secondary" onClick={addEvent}>
        + Add Timeline Event
      </Button>
    </div>
  );
}