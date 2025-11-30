"use client";

import { useState } from "react";
import { createTask } from "@/actions/sales/tasks";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function CreateTaskModal({ open, onOpenChange }: any) {
  const [desc, setDesc] = useState("");
  const [due, setDue] = useState("");

  const submit = async () => {
    if (!desc || !due) return;
    await createTask({
      description: desc,
      dueDate: new Date(due),
    });
    setDesc("");
    setDue("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Task</DialogTitle>
        </DialogHeader>

        <Input placeholder="Task description" onChange={(e) => setDesc(e.target.value)} />

        <Input
          type="datetime-local"
          onChange={(e) => setDue(e.target.value)}
        />

        <Button onClick={submit} className="w-full mt-4">
          Save Task
        </Button>
      </DialogContent>
    </Dialog>
  );
}
