"use client";

import { Switch } from "@/components/ui/switch";
import { AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

export default function AccordionSection({
  id,
  label,
  emoji,
  icon,
  toggled,
  onToggle,
  children,
}: {
  id: string;
  label: string;
  emoji: string;
  icon: React.ReactNode;
  toggled: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <AccordionItem value={id} className="border rounded-xl shadow-sm">
      <AccordionTrigger className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          {icon}
          <span className="font-medium text-lg flex items-center gap-1">
            {emoji} {label}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground mr-2">
            {toggled ? "Yes" : "No"}
          </span>
          <Switch checked={toggled} onCheckedChange={onToggle} />
        </div>
      </AccordionTrigger>

      <AccordionContent className="p-4 bg-muted/30 rounded-b-xl">
        {children}
      </AccordionContent>
    </AccordionItem>
  );
}