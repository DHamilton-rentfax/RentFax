import React from "react";

export default function DashboardSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border rounded-xl bg-white shadow-sm p-6">
      <h3 className="text-lg font-semibold text-[#1A2540] mb-4">
        {title}
      </h3>
      {children}
    </section>
  );
}
