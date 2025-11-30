"use client";

import { useState, useEffect } from "react";
import { db } from "@/firebase/client";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createTask, completeTask } from "@/actions/sales/tasks";

export function DealTasks({ dealId }: { dealId: string }) {
  const [tasks, setTasks] = useState<any[]>([]);
  const [newTask, setNewTask] = useState("");

  useEffect(() => {
    const q = query(collection(db, "tasks"), where("dealId", "==", dealId));
    return onSnapshot(q, (snap) => {
      setTasks(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
  }, [dealId]);

  const add = async () => {
    await createTask({ description: newTask, dealId });
    setNewTask("");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Tasks</CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex gap-2">
          <Input
            placeholder="Add task..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
          />
          <Button onClick={add}>
            Add
          </Button>
        </div>

        <div className="space-y-2">
          {tasks.map((task) => (
            <div key={task.id} className="flex justify-between border rounded-md p-2 text-sm">
              <span>{task.description}</span>
              <Button variant="ghost" size="icon" onClick={() => completeTask(task.id)} className="text-green-600 h-6 w-6">
                ✔
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
