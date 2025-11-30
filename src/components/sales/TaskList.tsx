"use client";

import { completeTask } from "@/actions/sales/tasks";

export function TaskList({ tasks }: { tasks: any[] }) {
  const now = new Date();

  const overdue = tasks.filter((t) => t.status === "open" && t.dueDate?.toDate() < now);
  const today = tasks.filter(
    (t) =>
      t.status === "open" &&
      t.dueDate?.toDate()?.toDateString() === now.toDateString()
  );
  const upcoming = tasks.filter(
    (t) =>
      t.status === "open" &&
      t.dueDate?.toDate() > now &&
      t.dueDate?.toDate().toDateString() !== now.toDateString()
  );

  return (
    <div className="space-y-6">
      {/* Overdue */}
      {overdue.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-red-600">Overdue</h2>
          {overdue.map((task) => (
            <TaskRow key={task.id} task={task} />
          ))}
        </section>
      )}

      {/* Today */}
      <section>
        <h2 className="text-sm font-semibold">Today</h2>
        {today.map((task) => (
          <TaskRow key={task.id} task={task} />
        ))}
      </section>

      {/* Upcoming */}
      <section>
        <h2 className="text-sm font-semibold text-muted-foreground">
          Upcoming
        </h2>
        {upcoming.map((task) => (
          <TaskRow key={task.id} task={task} />
        ))}
      </section>
    </div>
  );
}

function TaskRow({ task }: { task: any }) {
  return (
    <div className="flex justify-between p-3 border rounded-md bg-card">
      <div>
        <div className="font-medium">{task.description}</div>
        <div className="text-xs text-muted-foreground">
          Due: {task.dueDate?.toDate().toLocaleString()}
        </div>
      </div>

      <button
        className="text-green-600 text-sm"
        onClick={() => completeTask(task.id)}
      >
        ✔
      </button>
    </div>
  );
}
