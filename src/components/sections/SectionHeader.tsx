"use client";

import React from "react";

export default function SectionHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-6">
      {/* Gold Accent Bar */}
      <div className="h-1 w-12 bg-[#D4A017] rounded mb-3"></div>

      {/* Title */}
      <h2 className="text-2xl font-bold text-[#1A2540]">{title}</h2>

      {/* Optional subtitle */}
      {subtitle && (
        <p className="text-sm text-gray-600 mt-1 max-w-2xl">{subtitle}</p>
      )}
    </div>
  );
}
