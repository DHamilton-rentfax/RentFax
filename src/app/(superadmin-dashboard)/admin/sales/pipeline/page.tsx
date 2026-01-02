"use client";

import { useEffect, useState } from "react";
import { db } from "@/firebase/client";
import { collection, onSnapshot } from "firebase/firestore";
import { DragDropContext } from "react-beautiful-dnd";
import { updateDealStage } from "@/actions/sales/deals";
import { KanbanColumn } from "@/components/sales/KanbanColumn";

export default function PipelinePage() {
  const [deals, setDeals] = useState<any[]>([]);

  const stages = [
    "new",
    "qualified",
    "demo",
    "proposal",
    "negotiation",
    "won",
    "lost",
  ];

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "deals"), (snap) => {
      setDeals(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return unsub;
  }, []);

  const grouped = stages.reduce((acc, stage) => {
    acc[stage] = deals.filter((d) => d.stage === stage);
    return acc;
  }, {} as any);

  const onDragEnd = async (result: any) => {
    if (!result.destination) return;

    const dealId = result.draggableId;
    const newStage = result.destination.droppableId;
    const oldStage = result.source.droppableId;

    if (newStage === oldStage) return;

    // Optimistic UI update
    const dealToMove = deals.find((d) => d.id === dealId);
    if (dealToMove) {
      const updatedDeals = deals.map((d) =>
        d.id === dealId ? { ...d, stage: newStage } : d
      );
      setDeals(updatedDeals);
    }

    // Update backend
    await updateDealStage(dealId, newStage);

    // Auto-log activity later via pack 6
  };

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">Pipeline</h1>

      {/* Horizontal scroll for mobile */}
      <div className="overflow-x-auto pb-4">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex gap-4">
            {stages.map((stage) => (
              <KanbanColumn
                key={stage}
                columnId={stage}
                title={stage.charAt(0).toUpperCase() + stage.slice(1)}
                deals={grouped[stage] || []}
              />
            ))}
          </div>
        </DragDropContext>
      </div>
    </div>
  );
}
