"use client";

import { useEffect, useState } from "react";
import { db } from "@/firebase/client";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { TaskList } from "@/components/sales/TaskList";
import { CreateTaskModal } from "@/components/sales/CreateTaskModal";
import { Button } from "@/components/ui/button";

export default function TasksPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const q = query(collection(db, "tasks"), orderBy("dueDate", "asc"));
    return onSnapshot(q, (snap) => {
      setTasks(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <h1 className="text-xl font-bold">Tasks</h1>
        <Button onClick={() => setOpen(true)}>New Task</Button>
      </div>

      <TaskList tasks={tasks} />

      <CreateTaskModal open={open} onOpenChange={setOpen} />
    </div>
  );
}
