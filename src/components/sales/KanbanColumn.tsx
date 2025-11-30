"use client";

import { Draggable, Droppable } from "react-beautiful-dnd";
import { KanbanDealCard } from "./KanbanDealCard";

export function KanbanColumn({ columnId, title, deals }: any) {
  const mrrTotal = deals.reduce((sum: number, d: any) => sum + (d.amountMonthly || 0), 0);

  return (
    <div className="flex flex-col w-72 bg-muted/40 border rounded-lg">
      <div className="p-3 border-b">
        <h3 className="font-semibold">{title}</h3>
        <div className="text-xs text-muted-foreground">Total MRR: ${mrrTotal.toLocaleString()}</div>
      </div>

      <Droppable droppableId={columnId}>
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="p-3 space-y-3 min-h-[200px]"
          >
            {deals.map((deal: any, index: number) => (
              <Draggable key={deal.id} draggableId={deal.id} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <KanbanDealCard deal={deal} />
                  </div>
                )}
              </Draggable>
            ))}

            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}
