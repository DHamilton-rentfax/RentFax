import React from "react";
import { cn } from "@/lib/utils";

export function Card({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={cn(
        "bg-white border border-gray-200 rounded-xl p-4 shadow-sm",
        className
      )}
    >
      {children}
    </div>
  );
}
